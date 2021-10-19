/*
 * Copyright (c) 2021. shogogg <shogo@studofly.net>
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
type ColumnAlign = 'c' | 'l' | 'r'

type ColumnTypeNumber = 'n'

type ColumnTypeString = 's'

export type ColumnType = ColumnTypeNumber | ColumnTypeString

type Language = 'en' | 'ja'

export type RecordDef = {
  aligns: ColumnAlign[]
  columns: number
  lengths: number[]
  offsets: number[]
  types: ColumnType[]
  labels: Record<Language, string[]>
}

export type Format = {
  recordLength: number
  header: RecordDef
  data: RecordDef
  trailer: RecordDef
}

export type Classification = '91'
