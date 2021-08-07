/**
 * node-utils-h - strings tests
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
const {ger, cases} = require('../helpers/index.js')

const {strings} = require('../../index.js')

describe.only('strings', () => {

    beforeEach(function () {

    })

    describe('#cat', () => {

        cases.defaults(strings.cat)
        .build({json: 'args'}, [
            {exp: 'abc', args: ['a','b','c']},
            {exp: 'abc', args: [['a','b','c']]},
            {exp: 'abc', args: [['a','b'],'c']},
            {exp: ''},
        ])
    })

    describe('#endsWith', () => {

        cases(strings.endsWith, [
            {err: TypeError},
        ])
    })

    describe('#escapeRegex', () => {

        cases(strings.escapeRegex, [
            {err: TypeError, oper: 'instanceof'},
            {skip: true},
        ])
    })

    describe('#lcfirst', () => {

        cases(strings.lcfirst, [
            {err: TypeError, oper: 'instanceof', args: [['a']], json: 'args'},
            {skip: true},
        ])
    })

    describe('#stripAnsi', () => {

        cases(strings.escapeRegex, [
            {err: TypeError, oper: 'instanceof'},
            {skip: true},
        ])
    })

    describe('#ucfirst', () => {

        cases(strings.ucfirst, [
            {err: TypeError, oper: 'instanceof', args: [['a']], json: 'args'},
            {skip: true},
        ])
    })
})