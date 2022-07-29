/**
 * @quale/core - arrays tests
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
import {expect} from 'chai'
import {def} from '../helpers/index.js'
const {set, test} = def
import * as arrays from '../../src/arrays.js'

describe('arrays', () => {

    def(arrays.extend, () => {

        def('errors', {json: 'args'}, () => {
            test({err: TypeError, args: []})
        })

        def({oper: 'deep.equal', json: true}, () => {

            test(
                {exp: [1,3,4], args: [[1], [3,4]]},
            )

            def(() => {
                set({
                    desca: 'modify the array',
                    expg: ({args}) => args[0]}
                )
                test(
                    {exp: [1, 2],  args: [[1], [2]] },
                    {exp: [{}, 2], args: [[{}],[2]] },
                )
            })
        })
    })

    def(arrays.bisect, {oper: 'deep.equal'}, () => {

        test(
            {exp: [[4],[6]], args:[[4,6], n => n > 5]},
            {exp: [[1,2], []], args:[[1,2], n => n > 2]},
            {exp: [[1], [2]], args: [[1,2]]},
            {exp: [[1,2], [3]], args: [[1,2,3]]},
        )
    })

    def(arrays.sum, {json: 'args'}, () => {

        test(
            {err: TypeError, args: []},
            {exp:  8, args: [[1,3,4]]},
            {exp:  3, args: [[1,2]]},
            {exp:  0, args: [[]]},
            {exp: 10, args: [[5,5]]},
        )
    })

    describe('closestIndex', function() {
        it('simple test', function() {
            const arr = [1, 4, 8, 12]
            const res = arrays.closestIndex(5, arr)
            expect(res).to.equal(1)
        })
    })
    describe('closest', function() {
        it('simple test', function() {
            const arr = [1, 4, 8, 12]
            const res = arrays.closest(5, arr)
            expect(res).to.equal(4)
        })
    })
})