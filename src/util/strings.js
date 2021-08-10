/**
 * node-utils-h - string utils
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
 * regex.ansiGlobal copied from *ansi-regex*:
 *  - https://github.com/chalk/ansi-regex/blob/c1b5e45f/index.js
 *  - https://www.npmjs.com/package/ansi-regex
 * ----------------------
 * stringWidth copied from string-width:
 * - https://www.npmjs.com/package/string-width
 * - https://github.com/sindresorhus/string-width
 * portions extracted to isCombiningCharCodePoint, isControlCharCodePoint,
 * and isSurrogateCodePoint.
 * ----------------------
 * isFullwidthCodePoint copied from is-fullwidth-code-point:
 * - https://www.npmjs.com/package/is-fullwidth-code-point
 * - https://github.com/sindresorhus/is-fullwidth-code-point/blob/27f57288/index.js
 * ----------------------
 * MIT License
 * 
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * ----------------------
 * See file NOTICE.md for full license details.
 * ----------------------
 */

const regex = {

    ansi: {
        /**
         * Base regex (global) from:
         *   - https://github.com/chalk/ansi-regex/blob/c1b5e45f/index.js
         */
        global :  /[\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g,
        plain  :  /[\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/,
        // Matches all consecutive sequences.
        consec : /([\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~])))+/,
        // Matches all consecutive sequences from the start of the string.
        start  :/^([\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~])))+/,
        // Match (limited) consecutive sequences from the start.
        limited : /^(\x1B([[0-9;]*m)?)+/
    },

    emoji: {
        /**
         * Source from: https://github.com/mathiasbynens/emoji-regex
         * Copyright Mathias Bynens <https://mathiasbynens.be/>
         * MIT License.
         */
        global: require('../lib/emoji-regex.js'),
        plain : new RegExp(require('../lib/emoji-regex.js').source),
    },

    /**
     * Regex special chars.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#using_special_characters
     */
    special: /[.*+?^${}()|[\]\\]/g,
}

const codes = {

    /**
     * Diacritics are always added after the main character.
     * Code extracted from string-width, (C) Sindre Sorhus, MIT License.
     */
    isCombining: function isCombiningCharCodePoint(cp) {
        return Number.isInteger(cp) && cp >= 0x300 && cp <= 0x36F
    },

    /**
     * Control codes are not visually represented.
     * Code extracted from string-width, (C) Sindre Sorhus, MIT License.
     */
    isControl: function isControlCharCodePoint(cp) {
        return Number.isInteger(cp) && (cp <= 0x1F || (cp >= 0x7F && cp <= 0x9F))
    },

    /**
     * Surrogates come in pairs, e.g. emojis.
     * Code extracted from string-width, (C) Sindre Sorhus, MIT License.
     */
    isSurrogate: function isSurrogateCodePoint(cp) {
        return Number.isInteger(cp) && cp > 0xFFFF
    },

    /**
     * from is-fullwidth-code-point:
     * - https://www.npmjs.com/package/is-fullwidth-code-point
     * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
     * MIT License
     * ------------
     * Code points are derived from:
     * https://unicode.org/Public/UNIDATA/EastAsianWidth.txt
     */
    isFullwidth: function isFullwidthCodePoint(cp) {
        return Number.isInteger(cp) && cp >= 0x1100 && (
            cp <= 0x115F || // Hangul Jamo
            cp === 0x2329 || // LEFT-POINTING ANGLE BRACKET
            cp === 0x232A || // RIGHT-POINTING ANGLE BRACKET
            // CJK Radicals Supplement .. Enclosed CJK Letters and Months
            (0x2E80 <= cp && cp <= 0x3247 && cp !== 0x303F) ||
            // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
            (0x3250 <= cp && cp <= 0x4DBF) ||
            // CJK Unified Ideographs .. Yi Radicals
            (0x4E00 <= cp && cp <= 0xA4C6) ||
            // Hangul Jamo Extended-A
            (0xA960 <= cp && cp <= 0xA97C) ||
            // Hangul Syllables
            (0xAC00 <= cp && cp <= 0xD7A3) ||
            // CJK Compatibility Ideographs
            (0xF900 <= cp && cp <= 0xFAFF) ||
            // Vertical Forms
            (0xFE10 <= cp && cp <= 0xFE19) ||
            // CJK Compatibility Forms .. Small Form Variants
            (0xFE30 <= cp && cp <= 0xFE6B) ||
            // Halfwidth and Fullwidth Forms
            (0xFF01 <= cp && cp <= 0xFF60) ||
            (0xFFE0 <= cp && cp <= 0xFFE6) ||
            // Kana Supplement
            (0x1B000 <= cp && cp <= 0x1B001) ||
            // Enclosed Ideographic Supplement
            (0x1F200 <= cp && cp <= 0x1F251) ||
            // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
            (0x20000 <= cp && cp <= 0x3FFFD)
        )
    },
}

const strings = module.exports = {

    regex,

    cat: function cat(...args) {
        return args.flat().join('')
    },

    /**
     *
     * @param {str} The line to break
     * @param {integer} The max width
     * @return {array} The lines
     */
    breakLine: function breakLine(str, maxWidth) {
        if (!Number.isInteger(maxWidth) || maxWidth < 2) {
            // Allow for width Infinity, protect againt NaN or < 1.
            return [str]
        }

        const lines = []

        // Prime the first ANSI match. When a match fails, don't check the
        // regex again.
        let ansiMatch = str.match(regex.ansi.consec)
        let ansiIndex = ansiMatch ? ansiMatch.index : null

        let line = '', lineWidth = 0
        for (let index = 0; index < str.length; ++index) {

            if (ansiIndex === index) {
                // ANSI segment has no width. Add the match to the line and
                // advance the indes.
                line += ansiMatch[0]
                index += ansiMatch[0].length
                if (index === str.length) {
                    break
                }
                // Prime the next ANSI match.
                ansiMatch = str.substr(index).match(regex.ansi.consec)
                ansiIndex = ansiMatch ? ansiMatch.index + index : null
            }

            const code = str.codePointAt(index)
            let segment = str[index], segmentWidth

            if (codes.isSurrogate(code)) {
                // Surrogates come in pairs and the width will be 2. Add the
                // next char to the segment and advance the index.
                segmentWidth = 2
                segment += str[++index]
            } else if (codes.isCombining(code) || codes.isControl(code)) {
                // Diacritics are always added after the main character, so they
                // do not increase the width. Control characters have no spatial
                // representation.
                segmentWidth = 0
            } else if (codes.isFullwidth(code)) {
                // Full (double) with character.
                segmentWidth = 2
            } else {
                // Single width character.
                segmentWidth = 1
            }

            if (lineWidth + segmentWidth > maxWidth) {
                // Break the line and reset.
                lines.push(line)
                lineWidth = 0
                line = ''
            }
            // Add the segment to the line and update the width.
            lineWidth += segmentWidth
            line += segment
        }
        if (line) {
            lines.push(line)
        }
        return lines
    },

    /**
     * String ends with. Every string ends with the empty string.
     *
     * @throws {TypeError}
     * @param {string} String to examine
     * @param {string} The end string to search for
     * @return {boolean}
     */
    endsWith: function endsWith(str, srch) {
        return str.length - str.lastIndexOf(srch) === srch.length
    },

    /**
     * Escape special regex characters in a string.
     *
     * @throws {TypeError}
     * @param {string} The string to escape
     * @return {string} The escaped string
     */
    escapeRegex: function escapeRegex(str) {
        return str.replace(regex.special, '\\$&')
    },

    /**
     * Lowercase the first letter of a string.
     *
     * @throws {TypeError}
     * @param {string} The input string
     * @return {string} The result string
     */
    lcfirst: function lcfirst(str) {
        if (str == null || !str.length) {
            return str
        }
        return str.substring(0, 1).toLowerCase() + str.substring(1)
    },

    /**
     * Strip ANSI sequences from a string.
     *
     * @throws {TypeError}
     * @param {string} The input string
     * @return {string} The result string
     */
    stripAnsi: function stripAnsi(str) {
        return str.replace(regex.ansi.global, '')
    },

    /**
     * Capitalize the first letter of a string.
     *
     * @throws {TypeError}
     * @param {string} The input string
     * @return {string} The result string
     */
    ucfirst: function ucfirst(str) {
        if (str == null || !str.length) {
            return str
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1)
    },

    /**
     * string-width:
     * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
     * MIT License
     * See file NOTICE.md for full license details.
     * Portions abstracted to separate codepoint methods.
     *
     * Get the visual width of a string
     *
     * @param {string} The string to check
     * @return {integer} The visual width
     */
    widthOf: function stringWidth(str) {
        if (typeof str !== 'string' || str.length === 0) {
            return 0
        }
        str = strings.stripAnsi(str)
        if (str.length === 0) {
            return 0
        }
        str = str.replace(regex.emoji.global, '  ')
        let width = 0
        for (let index = 0; index < str.length; ++index) {
            const codePoint = str.codePointAt(index)
            // Ignore control characters
            if (codes.isControl(codePoint)) {
                continue
            }
            // Ignore combining characters
            if (codes.isCombining(codePoint)) {
                continue
            }
            // Surrogates
            if (codes.isSurrogate(codePoint)) {
                index++
            }
            width += codes.isFullwidth(codePoint) ? 2 : 1
        }
        return width
    },
}