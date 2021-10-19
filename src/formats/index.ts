/*
 * Copyright (c) 2021. shogogg <shogo@studofly.net>
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
import { format91 } from './format-91.js'
import { Classification, Format } from './types'

export const formats: Record<Classification, Format> = {
  '91': format91
}
