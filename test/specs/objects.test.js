/**
 * @quale/core - objects tests
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

const defprop = Object.defineProperty

describe('objects', () => {

    def(objects.entries, {oper: 'deep.equal'}, () => {
        const s1 = Symbol()
        test(
            {exp: [['a',1]], args: [{a: 1}]},
            {exp: [['a',1]], args: [defprop({a: 1}, 'b', {value: 2})]},
            {
                exp: [['a',1],['b',2]],
                args: [defprop({a: 1}, 'b', {value: 2}), true],
            },
            {
                exp: [['a',1],['b',2]],
                args: [defprop({a: 1}, 'b', {value: 2, enumerable: true})],
            },
            {
                exp: [['a',1],[s1,2]],
                args: [defprop({a: 1}, s1, {value: 2, enumerable: true})],
            },
            {
                exp: [['a',1],[s1,2]],
                args: [defprop({a: 1}, s1, {value: 2}), true],
            },
        )
    })

    def(objects.isEmpty, () => {
        def({exp: true}, () => {
            test(
                {args: [{}]},
                {args: [defprop({}, 'a', {value: 1})]},
                {args: [defprop({}, Symbol(), {value: 1})]},
            )
        })
        def({exp: false}, () => {
            test(
                {args: []},
                {args: [{a: 1}]},
                {args: [Object.fromEntries([[undefined, undefined]])]},
                {args: [defprop({}, 'a', {value: 1, enumerable: true})]},
                {args: [defprop({}, Symbol(), {value: 1, enumerable: true})]},
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

    def(objects.keys, {oper: 'deep.equal'}, () => {
        const s1 = Symbol()
        test(
            {exp: ['a'], args: [{a: 1}]},
            {exp: ['a'], args: [defprop({a: 1}, 'b', {value: 2})]},
            {
                exp: ['a','b'],
                args: [defprop({a: 1}, 'b', {value: 2}), true]
            },
            {
                exp: ['a','b'],
                args: [defprop({a: 1}, 'b', {value: 2, enumerable: true})],
            },
            {exp: ['a'], args: [defprop({a: 1}, s1, {value: 2})]},
            {exp: ['a',s1], args: [defprop({a: 1}, s1, {value: 2}), true]},
            {
                exp: ['a',s1],
                args: [defprop({a: 1}, s1, {value: 2, enumerable: true})],
            },
        )
    })

    def(objects.lget, () => {
        const s1 = Symbol()
        test(
            {exp: 'A', args: [new (class A{}), 'constructor.name']},
            {exp: s1, args: [{}, 'a', s1]},
            {exp: 1, args: [defprop({}, s1, {value: 1, enumerable: true}), s1]},
            {exp: 1, args: [defprop({}, s1, {value: 1, enumerable: true}), [s1]]},
            {exp: 1, args: [{}, [], 1]},
            {exp: undefined, args: [{a: 1}, 'a.b']},
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