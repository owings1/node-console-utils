/**
 * node-utils-h - ANSI screen helper
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
const ansi = require('../util/ansi.js')
const {
    isBoolean,
    isWriteableStream,
} = require('../util/types.js')

const Screen = module.exports = class Screen {

    constructor(opts) {
        if (isWriteableStream(opts)) {
            opts = {output: opts}
        } else if (isBoolean(opts)) {
            opts = {isAnsi: opts}
        }
        this.opts = {isAnsi: true, output: process.stdout, ...opts}
        this.str = {...ansi}
    }

    write(str) {
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

    noCursor(cb) {
        let isAsync = false
        let ret
        try {
            this.hideCursor()
            ret = cb()
            isAsync = ret instanceof Promise
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

Object.entries(ansi).forEach(([method, func]) => {
    Screen.prototype[method] = function (...args) {
        if (this.isAnsi) {
            this.write(ansi[method](...args))
        }
        return this
    }
})