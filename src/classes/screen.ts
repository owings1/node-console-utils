/**
 * @quale/core - ANSI screen helper
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
import * as ansi from '../ansi.js'
import {isBoolean, isPromise, isWriteableStream} from '../types.js'
import {Stream} from 'stream'
export default class Screen {

    opts: {
        isAnsi: boolean
        output: any
    }
    str: object

    constructor(opts: Stream|boolean|object) {
        if (isWriteableStream(opts)) {
            opts = {output: opts}
        } else if (isBoolean(opts)) {
            opts = {isAnsi: opts}
        }
        // @ts-ignore
        this.opts = {isAnsi: true, output: process.stdout, ...opts}
        this.str = ansi //{...ansi}
    }

    /**
     * @param str
     */
    write(str: string) {
        this.output.write(str)
        return this
    }

    get isAnsi() {
        return Boolean(this.opts.isAnsi)
    }

    set isAnsi(value) {
        this.opts.isAnsi = Boolean(value)
    }

    get output() {
        return this.opts.output
    }

    set output(strm) {
        if (!isWriteableStream(strm)) {
            throw new TypeError(`Output is not a writeable stream`)
        }
        this.opts.output = strm
    }

    get height() {
        return this.output.rows || 64
    }

    get width() {
        return this.output.columns || 256
    }

    up(n: number) {
        if (this.isAnsi) {
            this.write(ansi.up(n))
        }
        return this
    }
    down(n: number) {
        if (this.isAnsi) {
            this.write(ansi.down(n))
        }
        return this
    }
    left(n: number) {
        if (this.isAnsi) {
            this.write(ansi.left(n))
        }
        return this
    }
    right(n: number) {
        if (this.isAnsi) {
            this.write(ansi.right(n))
        }
        return this
    }
    column(n: number) {
        if (this.isAnsi) {
            this.write(ansi.column(n))
        }
        return this
    }
    clear() {
        if (this.isAnsi) {
            this.write(ansi.clear())
        }
        return this
    }
    erase(n: number) {
        if (this.isAnsi) {
            this.write(ansi.erase(n))
        }
        return this
    }
    eraseDisplayBelow() {
        if (this.isAnsi) {
            this.write(ansi.eraseDisplayBelow())
        }
        return this
    }
    eraseLine() {
        if (this.isAnsi) {
            this.write(ansi.eraseLine())
        }
        return this
    }
    moveTo(x: number, y: number) {
        if (this.isAnsi) {
            this.write(ansi.moveTo(x, y))
        }
        return this
    }
    writeRows(left: number, top: number, height: number, line: string) {
        if (this.isAnsi) {
            this.write(ansi.writeRows(left, top, height, line))
        }
        return this
    }
    eraseLines(n: number) {
        if (this.isAnsi) {
            this.write(ansi.eraseLines(n))
        }
        return this
    }
    saveCursor() {
        if (this.isAnsi) {
            this.write(ansi.saveCursor())
        }
        return this
    }
    restoreCursor() {
        if (this.isAnsi) {
            this.write(ansi.restoreCursor())
        }
        return this
    }
    hideCursor() {
        if (this.isAnsi) {
            this.write(ansi.hideCursor())
        }
        return this
    }
    showCursor() {
        if (this.isAnsi) {
            this.write(ansi.showCursor())
        }
        return this
    }
    /**
     * @param {Function} cb
     */
    noCursor(cb: () => any) {
        let isAsync = false
        try {
            this.hideCursor()
            const ret = cb()
            isAsync = isPromise(ret)
            if (isAsync) {
                return ret.finally(() => this.showCursor())
            }
        } finally {
            if (!isAsync) {
                this.showCursor()
            }
        }
    }
}

export {Screen}
