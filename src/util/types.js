/**
 * node-console-utils - Type checking/casting utils
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
/**
 * Contains code copied directly and repacked (with minor style adjustment)
 * from is-plain-object
 *
 * - https://www.npmjs.com/package/is-plain-object
 * - https://github.com/jonschlinkert/is-plain-object/blob/0a47f0f6/is-plain-object.js
 *
 * Methods Is.Object() and Is.PlainObject()
 *
 * The is-plain-object license is as follows:
 * ----------------------------------
 *
 * MIT License
 * 
 * Copyright (c) 2015 Olivier Tassinari
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const {EventEmitter} = require('events')

/**
 * Returns a useful type value for the parameter. The default is to return the
 * value of `typeof arg`, else one of the following: 'array', 'buffer', 'class',
 * 'object', 'null', or 'stream'.
 *
 * @param {*} The parameter to check
 * @return {string} The type
 */
function typeOf(arg) {
    if (arg === null) {
        return 'null'
    }
    if (Is.Array(arg)) {
        return 'array'
    }
    if (Is.Buffer(arg)) {
        return 'buffer'
    }
    if (Is.Stream(arg)) {
        return 'stream'
    }
    if (Is.Class(arg)) {
        return 'class'
    }
    if (Is.Object(arg)) {
        return 'object'
    }
    return typeof arg
}

const Cast = {

    /**
     * Cast a parameter to an array. If the parameter is an array, the parameter
     * is returned, otherwise a new array is created. If it is null or undefined,
     * an empty array is returned, otherwise a singleton array with the parameter
     * is return.
     *
     * @param {*} The parameter to cast
     * @return {array} The parameter if it is an array, or a new array
     */
    toArray: function castToArray(val) {
        if (Is.Array(val)) {
            return val
        }
        const arr = []
        if (val != null) {
            arr.push(val)
        }
        return arr
    },
}

const Is = {

    /**
     * Whether the parameter is an array.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Array: function isArray(arg) {
        return Array.isArray(arg)
    },

    /**
     * Whether the parameter is a boolean. Returns false if it was constructed
     * with the `new` keyword.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Boolean: function isBoolean(arg) {
        return arg === true || arg === false
    },

    /**
     * Whether the parameter is a buffer.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Buffer: function isBuffer(arg) {
        return Buffer.isBuffer(arg)
    },

    /**
     * Whether the parameter is probably a class. This tries to determine
     * whether something *must* be constructed with the `new` keyword.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Class: function isClass(arg) {
        if (Is.Function(arg) === false) {
            return false
        }
        const str = Function.prototype.toString.call(arg)
        if (str.indexOf('class') === 0 && (str[5] === ' ' || str[5] === '{')) {
            return true
        }
        // See: https://babeljs.io/docs/en/babel-plugin-transform-classes
        if (str.indexOf('classCallCheck') > -1) {
            return true
        }
        return str.indexOf('Cannot call a class as a function') > -1
    },

    /**
     * Whether the parameter is an instance of Error.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Error: function isError(arg) {
        return arg instanceof Error
    },

    /**
     * Whether the parameter is a function.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Function: function isFunction(arg) {
        return typeof arg === 'function'
    },

    /**
     * Whether the parameter is iterable. NB: an object is not iterable.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Iterable: function isIterable(arg) {
        return arg != null && Is.Function(arg[Symbol.iterator])
    },

    /**
     * Whether the parameter is a number.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Number: function isNumber(arg) {
        return typeof arg === 'number'
    },
    /**
     * Whether the parameter is an object.
     *
     * Returns false for: buffer, null, function, new String/Boolean
     * Returns true for: stream
     *
     * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
     *
     * Copyright (c) 2014-2017, Jon Schlinkert.
     * Released under the MIT License.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Object: function isObject(arg) {
        return Object.prototype.toString.call(arg) === '[object Object]'
    },

    /**
     * Whether the parameter is probably a "plain" object.
     *
     * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
     *
     * Copyright (c) 2014-2017, Jon Schlinkert.
     * Released under the MIT License.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    PlainObject: function isPlainObject(o) {
        let ctor
        let prot
        if (Is.Object(o) === false) {
            return false
        }
        // If has modified constructor
        ctor = o.constructor
        if (ctor === undefined) {
            return true
        }
        // If has modified prototype
        prot = ctor.prototype
        if (Is.Object(prot) === false) {
            return false
        }
        // If constructor does not have an Object-specific method
        if (prot.hasOwnProperty('isPrototypeOf') === false) {
            return false
        }
        // Most likely a plain Object
        return true
    },

    /**
     * Whether the parameter is a readable stream.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    ReadableStream: function isReadableStream(arg) {
        return arg instanceof EventEmitter && Is.Function(arg.read)
    },

    /**
     * Whether the parameter is a stream.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Stream: function isStream(arg) {
        return Is.ReadableStream(arg) || Is.WriteableStream(arg)
    },

    /**
     * Whether the parameter is a string. Returns false if it was constructed
     * with the `new` keyword.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    String: function isString(arg) {
        return typeof arg === 'string'
    },

    /**
     * Whether the parameter is a Symbol.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    Symbol: function isSymbol(arg) {
        return typeof arg === 'symbol'
    },

    /**
     * Alias for `isWriteableStream()`.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    WritableStream: function isWritableStream(arg) {
        return Is.WriteableStream(arg)
    },

    /**
     * Whether the parameter is a writable (writeable) stream.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    WriteableStream: function isWriteableStream(arg) {
        return (
            arg instanceof EventEmitter &&
            Is.Function(arg.write) &&
            Is.Function(arg.end)
        )
    },
}



module.exports = {
    typeOf,
    Cast,
    Is,
    ...namedf(Cast),
    ...namedf(Is),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}