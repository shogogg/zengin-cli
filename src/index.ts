/*
 * Copyright (c) 2021. shogogg <shogo@studofly.net>
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
import { Command } from 'commander'
import stringify from 'csv-stringify/lib/sync.js'
import { promises as fs } from 'fs'
import { Iconv } from 'iconv'
import { markdownTable } from 'markdown-table'
import stringWidth from 'string-width'
import { formats } from './formats/index.js'
import { Classification, ColumnType, RecordDef } from './formats/types'

const COMMAND_NAME = 'zengin'
const INPUT_ENCODING = 'Shift_JIS'
const OUTPUT_ENCODING = 'UTF-8'

const command = new Command(COMMAND_NAME)
const iconv = new Iconv(INPUT_ENCODING, OUTPUT_ENCODING)

// Create an array containing a 0..n range elements.
const range = (n: number) => [...Array(n)].map((_, i) => i)

// Read a content as Buffer from a specified file.
const readFileInput = async (filepath: string): Promise<Buffer> => await fs.readFile(filepath)

// Read a content as Buffer from STDIN.
const readStandardInput = async (): Promise<Buffer> => {
  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

// Read input as buffer from file or stdin.
const readInput = async (arg: string | undefined): Promise<Buffer> => typeof arg === 'string'
  ? readFileInput(arg)
  : readStandardInput()

// Chunk a buffer to records.
const readBuffer = (buffer: Buffer, recordLength: number): Buffer[] => {
  if (buffer.length < recordLength) {
    return []
  } else if (buffer[0] === 0x0A || buffer[0] === 0x0D) {
    return readBuffer(buffer.slice(1), recordLength)
  } else {
    return [
      buffer.slice(0, recordLength),
      ...readBuffer(buffer.slice(recordLength), recordLength)
    ]
  }
}

// Read a content from buffer.
const readContent = (buffer: Buffer, offset: number, length: number, type: ColumnType): string => {
  const x = iconv.convert(buffer.slice(offset, offset + length)).toString().trimEnd()
  return type === 'n' ? x.replace(/^0+/, '') : x
}

// Parse a record.
const parseRecord = (record: Buffer, def: RecordDef): string[] => {
  return range(def.columns).map(i => readContent(record, def.offsets[i], def.lengths[i], def.types[i]))
}

// Convert an array to csv.
const toCsv = (data: string[][]): string => stringify(data)

// Convert an array to markdown table.
const toMarkdown = (align: string[]) => (data: string[][]): string => markdownTable(data, {
  align,
  stringLength: stringWidth
})

// Command-line options type definition.
type CommandLineOptions = {
  classification: Classification
  data: boolean
  header: boolean
  ja: boolean
  markdown: boolean
  trailer: boolean
}

// noinspection JSUnusedGlobalSymbols
export const main = async (version: string) => {
  command
    .description('A simple command-line tool for parsing Zengin format file')
    .requiredOption('-c, --classification <code>', 'the classification code, e.g. 91 for withdrawal')
    .option('-D, --data', 'output data record only')
    .option('-H, --header', 'output header record only')
    .option('-j, --ja', 'output table headers in japanese instead of english')
    .option('-m, --markdown', 'output as markdown table')
    .option('-T, --trailer', 'output trailer record only')
    .version(` ${version}`)
    .parse()

  const options = command.opts<CommandLineOptions>()

  const all = !options.header && !options.data && !options.trailer

  const classification = options.classification
  const format = formats[classification]
  const input = await readInput(command.args[0])
  const rawRecords = readBuffer(input, format.recordLength)

  const x = input.readUInt8(120)
  console.log({ input, rawRecords, x })


  const content: string[] = []

  if (all || options.header) {
    const rawHeader = rawRecords[0]
    const toString = options.markdown ? toMarkdown(format.header.aligns) : toCsv
    content.push(toString([
      options.ja ? format.header.labels.ja : format.header.labels.en,
      parseRecord(rawHeader, format.header)
    ]))
  }
  if (all || options.data) {
    const rawData = rawRecords.slice(1, -2)
    const toString = options.markdown ? toMarkdown(format.data.aligns) : toCsv
    content.push(toString([
      options.ja ? format.data.labels.ja : format.data.labels.en,
      ...rawData.map(x => parseRecord(x, format.data))
    ]))
  }
  if (all || options.trailer) {
    const rawTrailer = rawRecords.slice(-2, -1)[0]
    const toString = options.markdown ? toMarkdown(format.trailer.aligns) : toCsv
    content.push(toString([
      options.ja ? format.trailer.labels.ja : format.trailer.labels.en,
      parseRecord(rawTrailer, format.trailer)
    ]))
  }

  process.stdout.write(content.join('\n\n'))
}
