/*
 * Copyright (c) 2021. shogogg <shogo@studofly.net>
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    './dist/config/typescript'
  ],
  ignorePatterns: [
    'dist/'
  ]
}
