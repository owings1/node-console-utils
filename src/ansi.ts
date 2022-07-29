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

/**
 * @param {Number} n
 * @return {String}
 */
export function up(n: number): string {
    n = safen(n)
    return n ? `\x1B[${n}A` : ''
}

/**
 * @param {Number} n
 * @return {String}
 */
export function down(n: number): string {
    n = safen(n)
    return n ? `\x1B[${n}B` : ''
}

/**
 * @param {Number} n
 * @return {String}
 */
export function right(n: number): string {
    n = safen(n)
    return n ? `\x1B[${n}C` : ''
}

/**
 * @param {Number} n
 * @return {String}
 */
export function left(n: number): string {
    n = safen(n)
    return n ? `\x1B[${n}D` : ''
}

/**
 * @param {Number} n
 * @return {String}
 */
export function column(n: number): string {
    n = safen(n)
    return n ? `\x1B[${n}G` : ''
}

/**
 * @return {String}
 */
export function clear(): string {
    return '\x1B[H\x1B[2J'
}

/**
 * @param {Number} n
 * @return {String}
 */
export function erase(n: number): string {
    n = safen(n)
    return n ? `\x1B[${n}X` : ''
}

/**
 * @return {String}
 */
export function eraseDisplayBelow(): string {
    return '\x1B[0J'
}

/**
 * @return {String}
 */
export function eraseLine(): string {
    return '\x1B[2K'
}

/**
 * @param {Number} n
 * @return {String}
 */
export function eraseLines(n: number): string {
    n = safen(n)
    if (!n) {
        return ''
    }
    let str = ''
    for (let i = 0; i < n; ++i) {
        str += eraseLine()
        if (i < n - 1) {
            str += '\x1B[1A'
        }
    }
    str += '\x1B[G'
    return str
}

/**
 * @param {Number} x
 * @param {Number} y
 * @return {String}
 */
export function moveTo(x: number, y: number): string {
    x = safen(x) || 1
    y = safen(y) || 1
    return `\x1B[${y};${x}H`
}

/**
 * @param {Number} left
 * @param {Number} top
 * @param {Number} height
 * @param {String} line
 * @return {String}
 */
export function writeRows(left: number, top: number, height: number, line: string): string {
    let str = ''
    for (let i = 0; i < height; ++i) {
        str += moveTo(left, top + i)
        str += line
    }
    return str
}

/**
 * @return {String}
 */
export function saveCursor(): string {
    return isApple ? '\x1B7' : '\x1B[s'
}

/**
 * @return {String}
 */
export function restoreCursor(): string {
    return isApple ? '\x1B8' : '\x1B[u'
}

/**
 * @return {String}
 */
export function hideCursor(): string {
    return '\x1B[?25l'
}

/**
 * @return {String}
 */
export function showCursor(): string {
    return '\x1B[?25h'
}

/**
 * @param {Number} n
 * @return {Number}
 */
function safen(n: number): number {
    if (Number.isFinite(n) && Number.isInteger(n) && n > 0) {
        return n
    }
    return 0
}