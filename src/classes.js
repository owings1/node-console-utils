/**
 * @quale/core - class utils
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
const {isFunction} = require('./types.js')
const getProto = Object.getPrototypeOf

const classes = {

    ancestors: function classAncestors(arg) {
        const ancs = []
        if (isFunction(arg) === false) {
            return ancs
        }
        for (let cls = getProto(arg); cls && cls.name; cls = getProto(cls)) {
            ancs.push(cls)
        }
        return ancs
    },

    inherits: function classInherits(arg, check) {
        if (isFunction(arg) === false || isFunction(check) === false) {
            return false
        }
        for (let cls = getProto(arg); cls && cls.name; cls = getProto(cls)) {
            if (cls === check) {
                return true
            }
        }
        return false
    },
}

module.exports = {
    ...classes,
    ...namedf(classes),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}