/**
 * @quale/core - ANSI sequences
 *
 * Copyright (C) 2021-2022 Doug Owings
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
import process from 'process'

const isApple = process.env.TERM_PROGRAM === 'Apple_Terminal'

export const ansi = {

    up: n => {
        n = safen(n)
        return n ? `\x1B[${n}A` : ''
    },

    down: n => {
        n = safen(n)
        return n ? `\x1B[${n}B` : ''
    },

    right: n => {
        n = safen(n)
        return n ? `\x1B[${n}C` : ''
    },

    left: n => {
        n = safen(n)
        return n ? `\x1B[${n}D` : ''
    },

    column: n => {
        n = safen(n)
        return n ? `\x1B[${n}G` : ''
    },

    clear: () => '\x1B[H\x1B[2J',

    erase: n => {
        n = safen(n)
        return n ? `\x1B[${n}X` : ''
    },

    eraseDisplayBelow: () => '\x1B[0J',

    eraseLine: () => '\x1B[2K',

    eraseLines: n => {
        n = safen(n)
        if (!n) {
            return ''
        }
        let str = ''
        for (let i = 0; i < n; ++i) {
            str += ansi.eraseLine()
            if (i < n - 1) {
                str += '\x1B[1A'
            }
        }
        str += '\x1B[G'
        return str
    },

    moveTo: (x, y) => {
        x = safen(x) || 1
        y = safen(y) || 1
        return `\x1B[${y};${x}H`
    },

    writeRows: (left, top, height, line) => {
        let str = ''
        for (let i = 0; i < height; ++i) {
            str += ansi.moveTo(left, top + i)
            str += line
        }
        return str
    },

    saveCursor: () => isApple ? '\x1B7' : '\x1B[s',

    restoreCursor: () => isApple ? '\x1B8' : '\x1B[u',

    hideCursor: () => '\x1B[?25l',

    showCursor: () => '\x1B[?25h',
}

export default ansi

function safen(n) {
    if (Number.isFinite(n) && Number.isInteger(n) && n > 0) {
        return n
    }
    return 0
}