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
const {ger, def, def: {test}} = require('../helpers/index.js')

const {types} = require('../../index.js')

describe('types', () => {

    beforeEach(function () {

    })

    describe('#typeOf', () => {

        def(types.typeOf, [
            {exp: 'string', args: 'foo'}
        ])

        it('should ...')
        it('todo', function () {
            
        })
    })

    describe('Cast', () => {

        describe('#toArray', () => {

            it('should ...')
            it('todo', function () {
                
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
                    
                )
            })
            def({exp: false}, () => {
                test(
                    
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

        def(Is.Object, () => {

            def({exp: true}, () => {
                test(
                    
                )
            })
            def({exp: false}, () => {
                test(
                    
                )
            })
        })

        def(Is.PlainObject, () => {

            def({exp: true}, () => {
                test(
                    
                )
            })
            def({exp: false}, () => {
                test(
                    
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