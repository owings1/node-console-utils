/**
 * node-utils-h - types tests
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
const {ger, def, def: {test}, MockOutput} = require('../helpers/index.js')

const {types} = require('../../index.js')


describe('types', () => {

    beforeEach(function () {

    })


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
            {exp: 'regex',    args: [ /a/ ]},
            {exp: 'stream',   args: [ new MockOutput ]},
            {exp: 'string',   args: [ 'foo' ]},
            {exp: 'symbol',   args: [ Symbol('foo') ]},
        )
    })

    describe('Cast', () => {

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

    def('Is', () => {

        const {Is} = types

        def(Is.Array, () => {
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

        def(Is.Boolean, () => {

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

        def(Is.Buffer, () => {

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

        def(Is.Class, () => {

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

        def(Is.Error, () => {

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

        def(Is.Function, () => {

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

        def(Is.Iterable, () => {

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

        def(Is.Number, () => {

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

        def(Is.Object, () => {

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

        def(Is.PlainObject, () => {

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

        def(Is.ReadableStream, () => {

            def({exp: true}, () => {
                test(
                    
                )
            })
            def({exp: false}, () => {
                test(
                    
                )
            })
        })

        def(Is.Regex, () => {

            def({exp: true}, () => {
                test(

                )
            })
            def({exp: false}, () => {
                test(

                )
            })
        })

        def(Is.String, () => {

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

        def(Is.Symbol, () => {

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

        def('Stream', () => {

            const fakew = {write: () => {}, end: () => {}}

            def(Is.Stream, () => {

                def({exp: true}, () => {
                    test(
                    
                    )
                })
                def({exp: false}, () => {
                    test(
                    
                    )
                })
            })
            def(Is.WritableStream, () => {

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

            def(Is.WriteableStream, {json: false}, () => {

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
        
    })
})