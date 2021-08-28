/**
 * @quale/util - Screen tests.
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
const {merging: {merge}, ger, MockOutput} = require('../helpers/index.js')
const {Screen} = require('../../index.js')

describe('Screen', () => {

    beforeEach(function () {
        this.opts = {}
        this.output = new MockOutput
        this.create = function (opts) {
            opts = merge({output: this.output}, this.opts, opts)
            return new Screen(opts)
        }
    })

    describe('#clear', () => {

        it("should write '\\x1B[H\\x1B[2J'", function () {
            this.create().clear()
            expect(this.output.raw).to.equal('\x1B[H\x1B[2J')
        })
    })

    describe('#column', () => {

        it("should write '\\x1B[4G' for 4", function () {
            this.create().column(4)
            expect(this.output.raw).to.equal('\x1B[4G')
        })
    })

    describe('#down', () => {

        it("should write '\\x1B[4B' for 4", function () {
            this.create().down(4)
            expect(this.output.raw).to.equal('\x1B[4B')
        })
    })

    describe('#erase', () => {

        it("should write '\\x1B[4X' for 4", function () {
            this.create().erase(4)
            expect(this.output.raw).to.equal('\x1B[4X')
        })
    })

    describe('#eraseDisplayBelow', () => {

        it("should write '\\x1B[0J'", function () {
            this.create().eraseDisplayBelow()
            expect(this.output.raw).to.equal('\x1B[0J')
        })
    })

    describe('#eraseLine', () => {

        it("should write '\\x1B[2K'", function () {
            this.create().eraseLine()
            expect(this.output.raw).to.equal('\x1B[2K')
        })
    })

    describe('#eraseLines', () => {

        it("should write '\\x1B[2K\\x1B[G' for 1", function () {
            this.create().eraseLines(1)
            expect(this.output.raw).to.equal('\x1B[2K\x1B[G')
        })
    })

    describe('#hideCursor', () => {

        it("should write '\\x1B[?25l'", function () {
            this.create().hideCursor()
            expect(this.output.raw).to.equal('\x1B[?25l')
        })
    })

    describe('#left', () => {

        it("should write '\\x1B[4D' for 4", function () {
            this.create().left(4)
            expect(this.output.raw).to.equal('\x1B[4D')
        })
    })

    describe('#moveTo', () => {

        it("should write '\\x1B[3;2H' for (2,3)", function () {
            this.create().moveTo(2, 3)
            expect(this.output.raw).to.equal('\x1B[3;2H')
        })
    })

    describe('#restoreCursor', () => {

        it("should write '\\x1B8' or '\\x1B[u'", function () {
            this.create().restoreCursor()
            expect(
                this.output.raw === '\x1B8' ||
                this.output.raw === '\x1B[u'
            ).to.equal(true)
        })
    })

    describe('#right', () => {

        it("should write '\\x1B[4C' for 4", function () {
            this.create().right(4)
            expect(this.output.raw).to.equal('\x1B[4C')
        })
    })

    describe('#saveCursor', () => {

        it("should write '\\x1B7' or '\\x1B[s'", function () {
            this.create().saveCursor()
            expect(
                this.output.raw === '\x1B7' ||
                this.output.raw === '\x1B[s'
            ).to.equal(true)
        })
    })

    describe('#showCursor', () => {

        it("should write '\\x1B[?25h'", function () {
            this.create().showCursor()
            expect(this.output.raw).to.equal('\x1B[?25h')
        })
    })

    describe('#up', () => {

        it("should write '\\x1B[4A' for 4", function () {
            this.create().up(4)
            expect(this.output.raw).to.equal('\x1B[4A')
        })
    })

    describe('#writeRows', () => {

        it("should write '' for (2, 3, 1, 'o')", function () {
            this.create().writeRows(2, 3, 1, 'o')
            expect(this.output.raw).to.equal('\x1B[3;2Ho')
        })
    })
})