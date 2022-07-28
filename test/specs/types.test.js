/**
 * @quale/core - types tests
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
import stream from 'stream'
import {def, MockOutput} from '../helpers/index.js'
const {set, test} = def
import {expect} from 'chai'

import * as types from '../../src/types.js'

describe('types', () => {

    def(types.typeOf, () => {

        test(
            {exp: 'array',    args: [ [] ]},
            {exp: 'buffer',   args: [ Buffer.alloc(0) ]},
            {exp: 'class',    args: [ class A{} ]},
            {exp: 'function', args: [ function(){} ]},
            {exp: 'null',     args: [ null ]},
            {exp: 'number',   args: [ 1 ]},
            {exp: 'number',   args: [ NaN ]},
            {exp: 'object',   args: [ {} ]},
            {exp: 'promise',  args: [ new Promise(r => r()) ]},
            {exp: 'regex',    args: [ /a/ ]},
            {exp: 'stream',   args: [ new MockOutput ]},
            {exp: 'string',   args: [ 'foo' ]},
            {exp: 'symbol',   args: [ Symbol('foo') ]},
        )
    })

    describe('cast', () => {

        def(types.castToArray, {oper: 'deep.equal'}, () => {

            test(
                {exp: [1]    , args: [1]},
                {exp: []     , args: [undefined]},
                {exp: []     , args: [null]},
                {exp: [false], args: [false]},
                {exp: [0]    , args: [0]},
            )

            def({expg: ({args: [arr]}) => arr, desca: 'return input array'}, () => {
                test(
                    {exp: [1], args: [[1]]},
                )
            })
        })
    })

    def('is', () => {

        const fakew = {write: () => {}, end: () => {}}

        def(types.isArray, () => {

            def({exp: true}, () => {
                test(
                    {args: [[]]},
                    {args: [[1]]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [{length: 1}]},
                    {args: ['Array']},
                )
            })
        })

        def(types.isBoolean, () => {

            def({exp: true}, () => {
                test(
                    {args: [true]},
                    {args: [false]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: ['true']},
                    {args: ['false']},
                    {args: ['']},
                    {args: [1]},
                    {args: [0]},
                    {args: [null]},
                    {args: [undefined]},
                    {args: [new Boolean], argsstr: 'new Boolean'},
                )
            })
        })

        def(types.isBuffer, () => {

            def({exp: true}, () => {
                test(
                    {args: Buffer.alloc(0), argsstr_: 'Buffer'}
                )
            })

            def({exp: false}, () => {
                test(
                    {args: {type:"Buffer", data:[]}}
                )
            })
        })

        def(types.isClass, () => {

            def({exp: true}, () => {
                test(
                    {args: [class A{}]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [function() {}]},
                )
            })
        })

        def(types.isError, () => {

            def({exp: true}, () => {
                test(
                    {args: [new Error], argsstr: 'new Error'},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [Error]}
                )
            })
        })

        def(types.isFunction, () => {

            def({exp: true}, () => {
                test(
                    {args: [function foo(){}]},
                    {args: [() => {}]},
                    {args: [Error]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [{call: ()=>{}}]},
                )
            })
        })

        def(types.isIterable, () => {

            def({exp: true}, () => {
                test(
                    {args: [[]]},
                    {args: ['']},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [1]},
                    {args: [null]},
                    {args: [{}]},
                )
            })
        })

        def(types.isNumber, () => {

            def({exp: true}, () => {
                test(
                    {args: [1]},
                    {args: [Infinity]},
                    {args: [-Infinity]},
                    {args: [NaN]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: ['1']},
                    {args: ['Infinity']},
                    {args: [{}]},
                )
            })
        })

        def(types.isObject, () => {

            def({exp: true}, () => {
                test(
                    {args: [{}]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [null]},
                    {args: [function(){}]},
                )
            })
        })

        def(types.isPlainObject, () => {

            def({exp: true}, () => {
                test(
                    {args: [{}]},
                    {args: [{constructor: function(){}}]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [function(){}]},
                    {args: [new (class A{})]},
                    {args: [true]},
                    {args: [null]},
                )
            })
        })

        def(types.isRegex, () => {

            def({exp: true}, () => {
                test(
                    {args: [new RegExp('a')]},
                    {args: [/x/]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: ['/x/']},
                )
            })
        })

        def(types.isString, () => {

            def({exp: true}, () => {
                test(
                    {args: ['']}
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [new String('')]},
                )
            })
        })

        def(types.isSymbol, () => {

            def({exp: true}, () => {
                test(
                    {args: [Symbol()]},
                    {args: [Symbol.iterator]},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [new (class Symbol{})]},
                    {args: [Symbol]},
                )
            })
        })

        def(types.isReadableStream, () => {

            def({exp: true}, () => {
                test(
                    {args:[stream.Readable()]},
                    {args: [process.stdin], argsstr: 'process.stdin'},
                    {args: [process.stdout], argsstr: 'process.stdout'},
                )
            })

            def({exp: false}, () => {
                test(
                    {args:[new MockOutput]},
                    {args:[{write: () => {}, end: () => {}}]},
                )
            })
        })

        def(types.isStream, () => {

            def({exp: true}, () => {
                test(
                    {args: [process.stdout], argsstr: 'process.stdout'},
                    {args: [process.stdin], argsstr: 'process.stdin'},
                )
            })

            def({exp: false}, () => {
                test(
                    {args:[fakew]},
                )
            })
        })

        def(types.isWritableStream, () => {

            def({exp: true}, () => {
                test(
                    {args: [process.stdout], argsstr: 'process.stdout'},
                    {args: [process.stderr], argsstr: 'process.stderr'},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [fakew]},
                )
            })
        })

        def(types.isWriteableStream, {json: false}, () => {

            def({exp: true}, () => {
                test(
                    {args: [process.stdout], argsstr: 'process.stdout'},
                    {args: [process.stderr], argsstr: 'process.stderr'},
                )
            })

            def({exp: false}, () => {
                test(
                    {args: [fakew]},
                )
            })
        })
    })

    describe('classes', () => {

        describe('A > B > C, R > S, R > T', () => {
    
            class A {}
            class B extends A {}
            class C extends B {}
    
            class R {}
            class S extends R {}
            class T extends R {}
    
            def(types.isSubclass, () => {
            
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
    
            def(types.getSubclasses, {oper: 'deep.equal'}, () => {
                test(
                    {exp: [B, A], args: [C]},
                )
            })
        })
    })
})