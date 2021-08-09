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
const isFullwidth = require('../lib/fullwidth.js')

const regex = {

    /**
     * From: https://github.com/chalk/ansi-regex/blob/c1b5e45f/index.js
     */
    ansig: /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g,

    /**
     * Source from: https://github.com/mathiasbynens/emoji-regex
     */
    emoji: require('../lib/emoji-regex.js'),

    /**
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#using_special_characters
     */
    regex: /[.*+?^${}()|[\]\\]/g,
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
        // Matches all consecutive ANSI sequences from the beginning of the string.
        const ansiRegex = /^(\x1B([[0-9;]*m)?)+/
        const lines = []
        let thisLine = ''
        for (let i = 0; i < str.length; ++i) {
            const ansiMatch = str.substr(i).match(ansiRegex)
            if (ansiMatch) {
                // Add all consecutive ANSI controls, since they do not increase the
                // width. This also prevents an extra line at the end if it is just a
                // closing color code.
                const ansiLength = ansiMatch[0].length
                thisLine += str.substr(i, ansiLength)
                i += ansiLength
            }
            // We could try to optimize here by grabbing more than just the next
            // character, but we would have to be prepared to backtrack if we end
            // up exceeding the width.
            const nextChar = str[i] || ''
            if (strings.widthOf(thisLine + nextChar) > width) {
                // If adding the next character to the line would exceed the width,
                // then start a new line.
                lines.push(thisLine)
                thisLine = ''
            }
            thisLine += nextChar
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
            width += isFullwidth(codePoint) ? 2 : 1
        }
        return width
    },
}