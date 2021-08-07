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
const {ger, cases: {defaults: defs}} = require('../helpers/index.js')

const {strings} = require('../../index.js')

describe.only('strings', () => {

    describe('#cat', () => {

        defs(strings.cat, {json: 'args'}).build([
            {exp: 'abc', args: ['a','b','c']},
            {exp: 'abc', args: [['a','b','c']]},
            {exp: 'abc', args: [['a','b'],'c']},
            {exp: ''},
        ])
    })

    describe('#endsWith', () => {

        defs(strings.endsWith).build({err: TypeError}, [
            {args: ['']},
            {args: [null, '']},
        ]).build({exp: true}, [
            {args: ['a ', ' ']},
            {args: ['huoihasdf', 'asdf']},
            {args: ['', '']},
            {args: ['asdf', '']},
        ]).build({exp: false}, [
            {args: ['asdf', 'huoihasdf']},
            {args: ['huoihasdf', 'asdF']},
        ])
    })

    describe('#escapeRegex', () => {

        defs(strings.escapeRegex).build([
            {err: TypeError},
            {exp: '\\^', args: '^'},
        ])
    })

    describe('#lcfirst', () => {

        defs(strings.lcfirst).build([
            {err: TypeError, args: [['a']], json: 'args'},
            {exp: 'foo', args: 'Foo'},
            {exp: 'fOO', args: 'FOO'},
            {exp: '1foo', args: '1foo'},
            {exp: '', args: ''},
        ])
    })

    describe('#stripAnsi', () => {


        defs(strings.stripAnsi, {json: true}).build([
            {err: TypeError},
            {exp: 'tongue', args: '\x1B[31mtongue\x1B[39m'},
            {exp: 'skirt', args: ['\x1B[34mskirt\x1B[39m', 6]},
            {exp: 'x1B[34mskirt1B[39m', args: 'x1B[34mskirt1B[39m'},
        ])
    })

    describe('#ucfirst', () => {

        defs(strings.ucfirst).build([
            {err: TypeError, args: [['a']], json: 'args'},
            {exp: 'Foo', args: 'foo'},
            {exp: 'FOO', args: 'fOO'},
            {exp: '1foo', args: '1foo'},
            {exp: '', args: ''},
        ])
    })
})