/*
 * Copyright (c) 2021. shogogg <shogo@studofly.net>
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
export const offsets = (lengths: number[], offset: number = 0): number[] => {
  if (lengths.length === 0) {
    return [offset]
  } else {
    const [head, ...tail] = lengths
    return [offset, ...offsets(tail, offset + head)]
  }
}
