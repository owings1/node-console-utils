import {stripAnsi} from '../../src/strings.js'
import * as stream from 'stream'
import {EventEmitter} from 'events'
export class MockOutput extends stream.Writable {

    constructor(opts = {}) {
        super()
        this.raw = ''
        this.opts = {...opts}
    }

    write(chunk) {
        this.raw += chunk
        if (this.debug) {
            process.stderr.write(chunk)
        }
    }

    end() {}

    get debug() { return Boolean(this.opts.debug) }

    set debug(v) { this.opts.debug = Boolean(v) }

    get lines() { return this.raw.split('\n') }

    get plain() { return stripAnsi(this.raw) }
}

export class MockInput extends EventEmitter {

    constructor(...args) {
        super(...args)
    }

    write() { return this }

    moveCursor() { return this }

    setPrompt() { return this }

    close() { return this }

    pause () { return this }

    resume() { return this }
}

export class MockReadline extends EventEmitter {

    constructor(opts = {}) {
        super()
        this.line = ''
        this.input = new MockInput
        this.output = new MockOutput(opts)
        this.input.on('keypress', value => {
           if (value) {
               this.line += value
           }
        })
    }

    write(chunk) {
        this.output.write(chunk)
        return this
    }

    moveCursor() { return this }

    setPrompt() { return this }

    close() { return this }

    pause () { return this }

    resume() { return this }

    _getCursorPos () { return {cols: 0, rows: 0} }    
}
