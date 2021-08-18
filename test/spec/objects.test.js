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
const {ger, def, def: {test}} = require('../helpers/index.js')

const {objects} = require('../../index.js')

describe('objects', () => {

    beforeEach(function () {

    })

    def(objects.isEmpty, () => {
        def({exp: true}, () => {
            test(
                {args: [{}]},
            )
        })
        def({exp: false}, () => {
            test(
                {args: [{a: 1}]},
                {args: [Object.fromEntries([[undefined, undefined]])]},
            )
        })
    })

    def(objects.isNonEmpty, () => {
        def({exp: true}, () => {
            test(
                {args: [{a: 1}]},
                {args: [Object.fromEntries([[undefined, undefined]])]},
            )
        })
        def({exp: false}, () => {
            test(
                {args: []},
                {args: [{}]},
                {args: [function(){}]},
            )
        })
    })

    def(objects.isNullOrEmpty, () => {
        def({exp: true}, () => {
            test(
                {args: []},
                {args: [{}]},
            )
        })
        def({exp: false}, () => {
            test(
                {args: [{a: 1}]},
            )
        })
    })

    def(objects.lget, () => {
        test(
            {exp: 'A', args: [new (class A{}), 'constructor.name']}
        )
    })

    def(objects.lset, {oper: 'deep.equal'}, () => {
        test(

        )
        def({resg: ({args}) => args[0], desca: 'modify the object'}, () => {
            test(
                
            )
        })
    })

    def(objects.rekey, {oper: 'deep.equal'}, () => {
        test(

        )
        def({resg: ({args}) => args[0], desca: 'not modify the object'}, () => {
            test(
                
            )
        })
    })

    def(objects.revalue, {oper: 'deep.equal'}, () => {

        function addOne(n) { return n + 1 }

        test(
            {exp: {a:2, b:3}, args: [{a:1, b:2}, addOne]},
            {exp: {a:2, b:3}, args: [{a:1, b:2}, null, addOne]},
        )
        def({resg: ({args}) => args[0], desca: 'not modify the object'}, () => {
            test(
                {exp: {a:1, b:2}, args: [{a:1, b:2}, addOne]},
            )
        })

        it('should create object with null prototype', function () {
            const input = {a:1, b:2}
            const obj = objects.revalue(input, null, addOne)
            expect(obj.constructor).to.equal(undefined)
        })

        it('should create object with Object.prototype', function () {
            const input = {a:1, b:2}
            const obj = objects.revalue(input, Object.prototype, addOne)
            expect(obj.constructor.prototype).to.equal(Object.prototype)
        })
    })

    def(objects.valueHash, {oper: 'deep.equal'}, () => {
        test(
            {exp: {a:true, b:true}, args: [['a', 'b']]},
            {exp: {a:true, b:true}, args: [['a', 'b'], null]},
            {exp: {a:true, b:true}, args: [{x: 'a', y: 'b'}]},
        )

        it('should create object with null prototype', function () {
            const input = [1, 2, 3]
            const obj = objects.valueHash(input, null)
            expect(obj).to.deep.equal({1: true, 2: true, 3: true})
            expect(obj.constructor).to.equal(undefined)
        })

        it('should create object with Object.prototype', function () {
            const input = [1, 2, 3]
            const obj = objects.valueHash(input)
            expect(obj).to.deep.equal({1: true, 2: true, 3: true})
            expect(obj.constructor.prototype).to.equal(Object.prototype)
        })
    })

    def(objects.update, {oper: 'deep.equal'}, () => {
        test(

        )
        def({resg: ({args}) => args[0], desca: 'modify the object'}, () => {
            test(
                
            )
        })
    })

})