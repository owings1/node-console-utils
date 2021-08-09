/**
 * node-utils-h - array utils
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
const {isArray} = require('./types.js')
const {ArgumentError} = require('../errors.js')

function checkArray(arg, name = 'arr') {
    if (!isArray(arg)) {
        throw new ArgumentError(`Argument (${arg}) not an array`)
    }
}

const arrays = {

    /**
     * Append all values to an array.
     *
     * @throws {ArgumentError}
     *
     * @param {array} The array to push to
     * @param {array} The values to push
     * @return {array} The input array
     */
    append: function arrayAppend(arr, values) {
        checkArray(arr)
        values.forEach(value => arr.push(value))
        return arr
    },

    /**
     * Get the last element of an array.
     *
     * @throws {ArgumentError}
     *
     * @param {array} The array
     * @return {*} The last element or undefined.
     */
    last: function arrayLast(arr) {
        checkArray(arr)
        return arr[arr.length - 1]
    },

    /**
     * Sum all numbers in the array.
     *
     * @throws {ArgumentError}
     *
     * @param {array} The input array
     * @return {integer} The result sum
     */
    sum: function arraySum(arr) {
        checkArray(arr)
        return arr.reduce((acc, cur) => acc + cur, 0)
    },
}

module.exports = {
    ...arrays,
    ...namedf(arrays),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(arrays).map(f => [f.name, f])
    )
}