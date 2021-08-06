import stream from 'stream'
import {stripAnsi} from '../../src/util/strings.js'

export class MockOutput extends stream.Writable {

    constructor(...args) {
        super(...args)
        this.raw = ''
    }

    write(chunk) { this.raw += chunk }

    end() {}

    get lines() { return this.raw.split('\n') }

    get plain() { return stripAnsi(this.raw) }
}