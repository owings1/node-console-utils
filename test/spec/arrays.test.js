/**
 * node-utils-h - arrays tests
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
const {expect} = require('chai')
const {ger, cases: {def}} = require('../helpers/index.js')

const {tests, test, set, unset} = def()

const {arrays} = require('../../index.js')

describe.only('arrays', () => {

    beforeEach(function () {

    })

    describe.only('#append', () => {

        set(arrays.append, {json: true})

        tests(() => {
            set({oper: 'deep.equal'}).test(
                {exp: [1,3,4], args: [[1], [3,4]]},
            ).set(
                {desca: 'modify the array'}, 
                {expg: test => test.args[0]},
            ).test(
                {exp: [1, 2], args: [[1], [2]]},
                {exp: [{}, 2], args: [[{}], [2]]},
            )
        }).tests(() => {
            set({eoper: 'erri', json: 'args'}).test(
                {err: TypeError, debug: false},
            )
        })

        unset(true)
    })

    describe('#sum', () => {

        set(arrays.sum, {json: 'args'})

        test(
            {err: TypeError},
            {exp: 8, args: [[1,3,4]]},
        )

        unset(true)
    })
})