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
const codes = require('./codes.js')
const regexes = require('./regexes.js')

const BG_CLOSE = '\x1B[49m'

const strings = {
    /**
     *
     * @param {string} The line to break
     * @param {integer} The max width
     * @return {array} The lines
     */
    breakLine: function breakLine(str, maxWidth, {tolerance = 0} = {}) {
        if (!str || !Number.isInteger(maxWidth) || maxWidth < 2) {
            // Allow for width Infinity, protect againt NaN or < 1.
            return [str]
        }
        // Normalize line breaks.
        str = str.replace(/*regexes.lineBreak.global*//\r\n/g, '\n')
        // Initialize variables.
        const lines = [], bgUnclosed = []
        let line = '', lineWidth = 0, index = 0, ansiMatch, ansiIndex
        // Routine to close background style if needed, push and reset the line
        // with the open sequences (if any), and reset the lineWidth.
        const push = () => {
            line += bgUnclosed.length ? BG_CLOSE : ''
            lines.push(line)
            line = bgUnclosed.join('')
            lineWidth = 0
        }
        // Routine to search for the next ANSI sequences.
        const searchAnsi = () => {
            ansiMatch = str.substr(index).match(regexes.ansi.consec)
            ansiIndex = ansiMatch ? ansiMatch.index + index : null
        }
        // Prime the first ANSI match. When a match fails, don't check the
        // regex again.
        searchAnsi()
        for (; index < str.length; ++index) {            
            if (ansiIndex === index) {
                // ANSI segments have no width. Add the match to the line and
                // advance the index.
                const [ansi] = ansiMatch
                line += ansi
                index += ansi.length
                // Track background open sequences so we can close and reopen
                // them on break.
                const bgs = ansi.match(regexes.ansi.bgGlobal)
                if (bgs) {
                    let i = bgs.lastIndexOf(BG_CLOSE) + 1
                    if (i === bgs.length) {
                        // The last background sequence is a close sequence, so
                        // all background sequences are hitherto closed.
                        bgUnclosed.splice(0)
                    } else {
                        // Track the remaining background open sequences.
                        for (; i < bgs.length; ++i) {
                            bgUnclosed.push(bgs[i])
                        }
                    }
                }
                if (index === str.length) {
                    break
                }
                // Prime the next ANSI match.
                searchAnsi()
            }
            const code = str.codePointAt(index)
            if (code === 0x0A) {
                // Line break.
                push()
                continue
            }
            // Build the segment and determine its width. The segment will
            // either be:
            //      a. the next char
            //      b. the next two chars, in the case of a surrogate
            //      c. empty string, in the case of a breaking space, when we
            //         are at maxWidth
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
            // Determine whether to break.
            if (lineWidth + segmentWidth > maxWidth + tolerance) {
                push()
            }
            // Add the segment to the line and update the width.
            lineWidth += segmentWidth
            line += segment
        }
        push()
        return lines
    },

    breakLines: function breakLines(lines, width) {
        return lines.map(line => strings.breakLine(line, width))
    },

    cat: function cat(...args) {
        return args.flat().join('')
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
        return str.replace(regexes.special, '\\$&')
    },

    /**
     * Lowercase the first letter of a string.
     *
     * @throws {TypeError}
     * @param {string} The input string
     * @return {string} The result string
     */
    lcfirst: function lcfirst(str) {
        return str ? str[0].toLowerCase() + str.substring(1) : str
    },

    /**
     * Strip ANSI sequences from a string.
     *
     * @throws {TypeError}
     * @param {string} The input string
     * @return {string} The result string
     */
    stripAnsi: function stripAnsi(str) {
        return str.replace(regexes.ansi.global, '')
    },

    /**
     * Capitalize the first letter of a string.
     *
     * @throws {TypeError}
     * @param {string} The input string
     * @return {string} The result string
     */
    ucfirst: function ucfirst(str) {
        return str ? str[0].toUpperCase() + str.substring(1) : str
    },

    /**
     * string-width:
     * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
     * MIT License
     * See file NOTICE.md for full license details.
     *
     * - Portions abstracted to separate codepoint methods.
     * - Code modified to avoid emoji regex.
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
        //str = str.replace(regexes.emoji.global, '  ')
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
                // Modification: avoid using emoji regex, and assume a surrogate
                // pair consumes width 2.
                width += 1
            }
            width += codes.isFullwidth(codePoint) ? 2 : 1
        }
        return width
    },
}

module.exports = {
    ...strings,
    ...namedf(strings),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}