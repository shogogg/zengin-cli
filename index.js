/*
 * Copyright (c) 2021. shogogg <shogo@studofly.net>
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

import { createRequire } from 'module'
import { main } from './dist/index.js'

const require = createRequire(import.meta.url)
const { version } = require('./package.json')

// noinspection JSIgnoredPromiseFromCall
main(version)
