/**
 * node-utils-h - objects tests
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
const {ger, def} = require('../helpers/index.js')

const {objects} = require('../../index.js')

describe('objects', () => {

    beforeEach(function () {

    })

    describe('#isEmpty', () => {

        def(objects.isEmpty, [{skip: true, desc: 'TODO...'}])
    })

    describe('#isNullOrEmpty', () => {

        def(objects.isNullOrEmpty, [{skip: true, desc: 'TODO...'}])
    })

    describe('#lget', () => {

        def(objects.lget, [{skip: true, desc: 'TODO...'}])
    })

    describe('#lset', () => {

        def(objects.lset, [{skip: true, desc: 'TODO...'}])
    })

    describe('#rekey', () => {

        def(objects.rekey, [{skip: true, desc: 'TODO...'}])
    })

    describe('#revalue', () => {

        def(objects.revalue, [{skip: true, desc: 'TODO...'}])
    })

    describe('#valuesHash', () => {

        def(objects.valuesHash, [{skip: true, desc: 'TODO...'}])
    })

    describe('#update', () => {

        def(objects.update, [{skip: true, desc: 'TODO...'}])
    })
})