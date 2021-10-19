/*
 * Copyright (c) 2021. shogogg <shogo@studofly.net>
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
import { Format } from './types'
import { offsets } from './utils.js'

const HEADER_LENGTHS = [
  1,
  2,
  1,
  10,
  40,
  4,
  4,
  15,
  3,
  15,
  1,
  7
]

const DATA_LENGTHS = [
  1,
  4,
  15,
  3,
  15,
  4,
  1,
  7,
  30,
  10,
  1,
  20,
  1
]

const TRAILER_LENGTHS = [
  1,
  6,
  12,
  6,
  12,
  6,
  12
]

export const format91: Format = {
  recordLength: 120,
  header: {
    aligns: ['c', 'c', 'c', 'c', 'l', 'c', 'c', 'l', 'c', 'l', 'c', 'l'],
    types: ['s', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
    columns: HEADER_LENGTHS.length,
    lengths: HEADER_LENGTHS,
    offsets: offsets(HEADER_LENGTHS),
    labels: {
      en: [
        'Record Identifier',
        'Classification',
        'Code Type',
        'EFT Requestor ID',
        'Account Holder\'s Name',
        'Transfer Date',
        'Receiving Bank Number',
        'Receiving Bank Name',
        'Receiving Branch Number',
        'Receiving Branch Name',
        'Account Type',
        'Account Number'
      ],
      ja: [
        'データ区分',
        '種別コード',
        'コード区分',
        '委託者コード',
        '委託者名',
        '引落日',
        '取引銀行番号',
        '取引銀行名',
        '取引支店番号',
        '取引支店名',
        '預金種目（委託者）',
        '口座番号（委託者）'
      ]
    }
  },
  data: {
    aligns: ['c', 'c', 'l', 'c', 'l', 'l', 'c', 'l', 'l', 'r', 'c', 'c', 'c'],
    types: ['s', 's', 's', 's', 's', 's', 's', 's', 's', 'n', 's', 's', 's'],
    columns: DATA_LENGTHS.length,
    lengths: DATA_LENGTHS,
    offsets: offsets(DATA_LENGTHS),
    labels: {
      en: [
        'Record Identifier',
        'Withdrawal Bank Number',
        'Withdrawal Bank Name',
        'Withdrawal Branch Number',
        'Withdrawal Branch Name',
        'Dummy',
        'Account Type',
        'Account Number',
        'Account Holder Name',
        'Transfer Amount',
        'Status',
        'Customer Code',
        'Result'
      ],
      ja: [
        'データ区分',
        '引落銀行番号',
        '引落銀行名',
        '引落支店番号',
        '引落支店名',
        'ダミー',
        '預金種目',
        '口座番号',
        '預金者名',
        '引落金額',
        '新規コード',
        '顧客番号',
        '振替結果コード',
      ]
    }
  },
  trailer: {
    aligns: ['c', 'r', 'r', 'r', 'r', 'r', 'r'],
    types: ['s', 'n', 'n', 'n', 'n', 'n', 'n'],
    columns: TRAILER_LENGTHS.length,
    lengths: TRAILER_LENGTHS,
    offsets: offsets(TRAILER_LENGTHS),
    labels: {
      en: [
        'Record Identifier',
        'Total Count',
        'Total Amount',
        'Completed Count',
        'Completed Amount',
        'Incomplete Count',
        'Incomplete Count'
      ],
      ja: [
        'データ区分',
        '合計件数',
        '合計金額',
        '振替済件数',
        '振替済金額',
        '振替不能件数',
        '振替不能金額',
      ]
    }
  }
}
