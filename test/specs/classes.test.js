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

import * as classes from '../../src/classes.js'

describe('classes', () => {

    describe('A > B > C, R > S, R > T', () => {

        class A {}
        class B extends A {}
        class C extends B {}

        class R {}
        class S extends R {}
        class T extends R {}

        def(classes.inherits, () => {
        
            def({exp: true}, () => {
                test(
                    {args: [TypeError, Error]},
                    {args: [B, A]},
                    {args: [C, B]},
                    {args: [C, A]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [T, S]},
                    {args: [T, B]},
                    {args: [A, A]},
                )
            })
        })

        def(classes.ancestors, {oper: 'deep.equal'}, () => {
            test(
                {exp: [B, A], args: [C]},
            )
        })
    })
})