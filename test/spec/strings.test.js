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
const {ger, def, def: {test, set}} = require('../helpers/index.js')

const {strings, colors: {Chalk}} = require('../../index.js')

describe('strings', () => {

    def(strings.cat, () => {
        test(
            {exp: 'abc', args: ['a','b','c']},
            {exp: 'abc', args: [['a','b','c']]},
            {exp: 'abc', args: [['a','b'],'c']},
            {exp: ''},
        )
    })

    def(strings.endsWith, () => {

        def({err: TypeError}, () => {
            test(
                {args: ['']},
                {args: [null, '']},
            )
        })

        def({exp: true}, () => {
            test(
                {args: ['a ', ' ']},
                {args: ['huoihasdf', 'asdf']},
                {args: ['', '']},
                {args: ['asdf', '']},
            )
        })

        def({exp: false}, () => {
            test(
                {args: ['asdf', 'huoihasdf']},
                {args: ['huoihasdf', 'asdF']},
            )
        })
    })

    def(strings.escapeRegex, () => {
        test(
            {err: TypeError},
            {exp: '\\^', args: '^'},
        )
    })

    def(strings.lcfirst, () => {
        test(
            {err: TypeError, args: [['a']], json: 'args'},
            {exp: 'foo', args: 'Foo'},
            {exp: 'fOO', args: 'FOO'},
            {exp: '1foo', args: '1foo'},
            {exp: '', args: ''},
        )
    })

    def(strings.stripAnsi, {json: true}, () => {
        test(
            {err: TypeError},
            {exp: 'tongue', args: '\x1B[31mtongue\x1B[39m'},
            {exp: 'skirt', args: ['\x1B[34mskirt\x1B[39m', 6]},
            {exp: 'x1B[34mskirt1B[39m', args: 'x1B[34mskirt1B[39m'},
        )
    })

    def(strings.ucfirst, () => {
        test(
            {err: TypeError, args: [['a']], json: 'args'},
            {exp: 'Foo', args: 'foo'},
            {exp: 'FOO', args: 'fOO'},
            {exp: '1foo', args: '1foo'},
            {exp: '', args: ''},
        )
    })

    def(strings.breakLine, () => {

        const {breakLine} = strings
        const chalk = new Chalk({level: 2})

        def('Chinese characters', () => {

            def('string width 76', () => {

                const str = '\x1B[36m❯\x1B[32m◉\x1B[39m\x1B[36m 选项选项选项选项选项选项选项选项选项选项选项\x1B[34m选项选项选\x1B[39m\x1B[36m项选项选项选项选项1\x1B[39m'

                set({oper: 'length', run: breakLine.bind(null, str)})

                test(
                    {exp: 1, args: [76]},
                    {exp: 2, args: [75]},
                    {exp: 3, args: [26]},
                )

                it('should equal original input when lines are joined', function () {
                    const lines = breakLine(str, 10)
                    expect(lines.join('')).to.equal(str)
                })
            })
        })

        def('Korean characters', () => {

            def('string width 94', () => {

                const str = '\x1B[32m정당해산의\x1B[39m 결정 또는 헌법소원에 관한 인용결정을 할 때에는 재판관 6인 이상의 찬성이 있어야 한다'

                set({oper: 'length', run: breakLine.bind(null, str)})

                test(
                    {exp: 1, args: [94]},
                    {exp: 2, args: [93]},
                    {exp: 4, args: [31]},
                )

                it('should equal original input when lines are joined', function () {
                    const lines = breakLine(str, 10)
                    expect(lines.join('')).to.equal(str)
                })
            })
        })

        def('Latin characters', () => {

            def('string width 50', () => {

                const str = 'This is one line that is ' + chalk.green('fifty') + ' characters in width'

                set({oper: 'length', run: breakLine.bind(null, str)})

                test(
                    {exp: 1, args: [50]},
                    {exp: 2, args: [49]},
                    {exp: 4, args: [14]},
                )

                it('should equal original str when lines are joined', function () {
                    const lines = breakLine(str, 14)
                    expect(lines.join('')).to.equal(str)
                })
            })
        })
    })
})