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
 * regex.ansi copied from *ansi-regex*:
 *  - https://github.com/chalk/ansi-regex/blob/c1b5e45f/index.js
 *  - https://www.npmjs.com/package/ansi-regex
 * ----------------------
 * stringWidth copied from string-width:
 * - https://www.npmjs.com/package/string-width
 * - https://github.com/sindresorhus/string-width
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
//const isFullwidth = require('../lib/fullwidth.js')

const regex = {

    /**
     * From: https://github.com/chalk/ansi-regex/blob/c1b5e45f/index.js
     */
    ansig: /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g,

    /**
     * Matches all consecutive ANSI sequences from the beginning of the string.
     */
    ansis1: /^([\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~])))+/,

    //ansis2: /^(\x1B([[0-9;]*m)?)+/,
    /**
     * Source from: https://github.com/mathiasbynens/emoji-regex
     */
    emoji: require('../lib/emoji-regex.js'),
    emojing1: new RegExp(require('../lib/emoji-regex.js').source),

    /**
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#using_special_characters
     */
    regex: /[.*+?^${}()|[\]\\]/g,
}

const codes = {

    // in Unicode, diacritics are always added after the main character
    isCombining: function isCombiningCharCodePoint(cp) {
        return Number.isInteger(cp) && cp >= 0x300 && cp <= 0x36F
    },

    isControl: function isControlCharCodePoint(cp) {
        return Number.isInteger(cp) && (cp <= 0x1F || (cp >= 0x7F && cp <= 0x9F))
    },

    isFullwidth: function isFullwidthCodePoint(cp) {

        if (!Number.isInteger(cp)) {
            return false
        }

        // Code points are derived from:
        // https://unicode.org/Public/UNIDATA/EastAsianWidth.txt
        return cp >= 0x1100 && (
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

    isSurrogate: function isSurrogateCodePoint(cp) {
        return Number.isInteger(cp) && cp > 0xFFFF
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
    breakLine: function breakLine(str, width) {
        if (!Number.isInteger(width) || width < 2) {
            // Allow for width Infinity, protect againt NaN or < 1.
            return [str]
        }
        const ansiRegex_s = regex.ansis1
        const emojiRegex_ng = regex.emojing1
        const lines = []
        let thisLine = ''
        let thisWidth = 0
        let emojiMatch = str.match(emojiRegex_ng)
        let emojiIndex = emojiMatch ? emojiMatch.index : -1
        for (let i = 0; i < str.length; ++i) {
            // Match all consecutive ANSI sequences from the beginning of the string.
            const ansiMatch = str.substr(i).match(ansiRegex_s)
            if (ansiMatch) {
                console.log({ansiMatch})
                // Add all consecutive ANSI controls, since they do not increase the
                // width. This also prevents an extra line at the end if it is just a
                // closing color code.
                const ansiLength = ansiMatch[0].length
                thisLine += str.substr(i, ansiLength)
                i += ansiLength
            }

            if (emojiMatch && emojiIndex === i) {
                console.log({emojiMatch})
                const [emoji] = emojiMatch
                if (thisWidth + emoji.length > width) {
                    lines.push(thisLine)
                    thisLine = 0
                    thisWidth = 0
                }
                thisLine += emoji
                thisWidth += emoji.length
                i += emoji.length - 1
                emojiMatch = str.substr(i).match(emojiRegex_ng)
                emojiIndex = emojiMatch ? emojiMatch.index + i : -1
                continue
            }

            if (i === str.length) {
                break
            }

            const code = str.codePointAt(i)
            
            if (codes.isCombining(code) || codes.isControl(code)) {
                console.log('isCombining||isControl')
                // Diacritics are always added after the main character, so they
                // do not increase the width. Control characters have no spatial
                // representation.
                thisLine += str[i]
                continue
            }

            let nextSegment = str[i]

            let nextWidth
            if (codes.isSurrogate(code)) {
                console.log('isSurrogate')
                // Surrogates, like socks, come in pairs. The width would increase by 2.
                nextSegment += str[++i]
                nextWidth = 2
            } else if (codes.isFullwidth(code)) {
                console.log('isFullwidth')
                nextWidth = 2
            } else {
                nextWidth = 1
            }

            if (thisWidth + nextWidth > width) {
                lines.push(thisLine)
                thisLine = ''
                thisWidth = 0
            }

            thisLine += nextSegment
            thisWidth += nextWidth
        }
        if (thisLine) {
            lines.push(thisLine)
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
        return str.replace(regex.regex, '\\$&')
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
        return str.replace(regex.ansig, '')
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
        str = str.replace(regex.emoji, '  ')
        let width = 0
        for (let index = 0; index < str.length; ++index) {
            const codePoint = str.codePointAt(index)
            // Ignore control characters
            if (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)) {
                continue
            }
            // Ignore combining characters
            if (codePoint >= 0x300 && codePoint <= 0x36F) {
                continue
            }
            // Surrogates
            if (codePoint > 0xFFFF) {
                index++
            }
            width += codes.isFullwidth(codePoint) ? 2 : 1
        }
        return width
    },
}