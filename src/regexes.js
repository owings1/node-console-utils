/**
 * @quale/util - regexes
 *
 * Copyright (C) 2021 Doug Owings
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * regexes.ansi.global copied from *ansi-regex*:
 *  - https://github.com/chalk/ansi-regex/blob/c1b5e45f/index.js
 *  - https://www.npmjs.com/package/ansi-regex
 * ----------------------
 * MIT License
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * -------------------------------------------------------------------------------
 * See file NOTICE.md for details and full license.
 * ------------------------------------------------
 */
const regexes = module.exports = {
    ansi: {
        // Base regex (global) from: https://github.com/chalk/ansi-regex/blob/c1b5e45f/index.js
        global :  /[\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g,
        // Matches all consecutive sequences.
        consec : /([\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~])))+/,
        // Match all background sequences, open or close.
        bgGlobal: /\x1B\[4[0-9]([0-9;]*m)?/g,
    },
    lineBreak: {
        // See: https://unicode.org/reports/tr29/
        global: /\r?\n|[\x0B\x0C\x85\u2028\u2029]/g,
    },
    // Regex special chars.
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#using_special_characters
    special: /[.*+?^${}()|[\]\\]/g,
}