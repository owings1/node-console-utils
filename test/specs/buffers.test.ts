/**
 * @quale/core - buffers tests
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
import {def} from '../helpers/index.js'
const {set, test} = def
import {expect} from 'chai'

import * as buffers from '../../src/buffers.js'

describe('buffers', () => {

    def(buffers.equal, () => {
        test(
            {exp: true  , args: [Buffer.from('a'), Buffer.from('a')]},
            {exp: false , args: [Buffer.from('a'), Buffer.from('b')]},
            {exp: false , args: [[1], [1,2]]},
        )

        it('should accept buffer with null equals', function () {
            const a = Buffer.from('a')
            const b = Buffer.from('a')
            // @ts-ignore
            a.equals = b.equals = null
            const res = buffers.equal(a, b)
            expect(res).to.equal(true)
        })

        it('should return true for buffer with null equals,compare', function () {
            const a = Buffer.from('a')
            const b = Buffer.from('a')
            // @ts-ignore
            a.equals = b.equals = null
            // @ts-ignore
            a.compare = b.compare = null
            const res = buffers.equal(a, b)
            expect(res).to.equal(true)
        })

        it('should return false for buffer with null equals,compare', function () {
            const a = Buffer.from('a')
            const b = Buffer.from('b')
            // @ts-ignore
            a.equals = b.equals = null
            // @ts-ignore
            a.compare = b.compare = null
            const res = buffers.equal(a, b)
            expect(res).to.equal(false)
        })
    })
})