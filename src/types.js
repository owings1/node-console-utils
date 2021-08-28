/**
 * @quale/util - Type checking/casting utils
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
 * Contains code copied and modified from *is-plain-object*:
 * - https://www.npmjs.com/package/is-plain-object
 * - https://github.com/jonschlinkert/is-plain-object/blob/0a47f0f6/is-plain-object.js
 * Methods `isObject()` and `isPlainObject()`.
 * ----------------------
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * ----------------------
 * See file NOTICE.md for full license details.
 * ----------------------
 */
/**
 * Contains code copied and modified from *lodash*:
 *  - https://www.npmjs.com/package/lodash
 *  - https://github.com/lodash/lodash/blob/2da024c3/isPlainObject.js
 * Method `isPlainObject()`
 * ----------------------
 * The MIT License
 *
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 *
 * Based on Underscore.js, copyright Jeremy Ashkenas,
 * DocumentCloud and Investigative Reporters & Editors <http://underscorejs.org/>
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
 * ----------------------
 * See file NOTICE.md for full license details.
 * ----------------------
 */
const {EventEmitter} = require('events')

/**
 * Returns a useful type value for the parameter. The default is to return the
 * value of `typeof arg`, else one of the following: 'array', 'buffer', 'class',
 * 'object', 'null', 'regex', or 'stream'.
 *
 * @param {*} The parameter to check
 * @return {string} The type
 */
function typeOf(arg) {
    if (arg === null) {
        return 'null'
    }
    if (is.array(arg)) {
        return 'array'
    }
    if (is.buffer(arg)) {
        return 'buffer'
    }
    if (is.stream(arg)) {
        return 'stream'
    }
    if (is.class(arg)) {
        return 'class'
    }
    if (is.regex(arg)) {
        return 'regex'
    }
    if (is.promise(arg)) {
        return 'promise'
    }
    if (is.object(arg)) {
        return 'object'
    }
    return typeof arg
}

const cast = {

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
        if (is.array(val)) {
            return val
        }
        const arr = []
        if (val != null) {
            arr.push(val)
        }
        return arr
    },
    ///**
    // * Induce a boolean value.
    // *
    // * @param {*} The value to examine
    // * @param {boolean} (optional) The default value
    // * @return {boolean} The induced value
    // */
    //static induceBool(value, def = false) {
    //    if (typeof value == 'boolean') {
    //        return value
    //    }
    //    if (value != null) {
    //        value = String(value).toLowerCase()
    //        if (def) {
    //            // Default is true, so check for explicit false.
    //            return ['0', 'false', 'no', 'n', 'off'].indexOf(value) < 0
    //        }
    //        // Default is false, so check for explicit true.
    //        return ['1', 'true', 'yes', 'y', 'on'].indexOf(value) > -1
    //    }
    //    return Boolean(def)
    //}

    ///**
    // * Induce an integer value.
    // *
    // * @param {*} The value to examine
    // * @param {integer} (optional) The default value
    // * @return {integer} The induced value
    // */
    //static induceInt(value, def = 0) {
    //    if (Number.isInteger(value)) {
    //        return value
    //    }
    //    if (!Number.isInteger(def)) {
    //        def = 0
    //    }
    //    if (value != null) {
    //        return parseInt(value) || def
    //    }
    //    return def
    //}
}

const is = {

    /**
     * Whether the parameter is an array.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    array: function isArray(arg) {
        return Array.isArray(arg)
    },

    /**
     * Whether the parameter is a boolean. Returns false if it was constructed
     * with the `new` keyword.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    boolean: function isBoolean(arg) {
        return arg === true || arg === false
    },

    /**
     * Whether the parameter is a buffer.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    buffer: function isBuffer(arg) {
        return Buffer.isBuffer(arg)
    },

    /**
     * Whether the parameter is probably a class. This tries to determine
     * whether something *must* be constructed with the `new` keyword.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    class: function isClass(arg) {
        if (is.function(arg) === false) {
            return false
        }
        const str = Function.prototype.toString.call(arg)
        if (str.indexOf('class') === 0 && (str[5] === ' ' || str[5] === '{')) {
            return true
        }
        // See: https://babeljs.io/docs/en/babel-plugin-transform-classes
        if (str.includes('classCallCheck')) {
            return true
        }
        return str.includes('Cannot call a class as a function')
    },

    /**
     * Whether the parameter is an instance of Error.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    error: function isError(arg) {
        return arg instanceof Error
    },

    /**
     * Whether the parameter is a function.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    function: function isFunction(arg) {
        return typeof arg === 'function'
    },

    /**
     * Whether the parameter is iterable. NB: an object is not iterable.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    iterable: function isIterable(arg) {
        return arg != null && is.function(arg[Symbol.iterator])
    },

    /**
     * Whether the parameter is a number.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    number: function isNumber(arg) {
        return typeof arg === 'number'
    },

    /**
     * Whether the parameter is an object.
     *
     * Returns false for: buffer, null, function, new String/Boolean
     * Returns true for: stream
     *
     * From:
     *
     * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
     * https://github.com/jonschlinkert/is-plain-object/blob/0a47f0f6/is-plain-object.js
     * Copyright (c) 2014-2017, Jon Schlinkert.
     * Released under the MIT License.
     *
     * See file NOTICE.md for full license details.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    object: function isObject(arg) {
        return Object.prototype.toString.call(arg) === '[object Object]'
    },

    /**
     * Whether the parameter is probably a "plain" object.
     *
     * Portions from:
     *
     * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
     * https://github.com/jonschlinkert/is-plain-object/blob/0a47f0f6/is-plain-object.js
     * Copyright (c) 2014-2017, Jon Schlinkert.
     * Released under the MIT License.
     *
     * Portions from:
     *
     * lodash <https://github.com/lodash/lodash>
     * https://github.com/lodash/lodash/blob/2da024c3/isPlainObject.js
     * Copyright JS Foundation and other contributors <https://js.foundation/>
     * Release under the MIT License.
     *
     * See file NOTICE.md for full license details.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    plainObject: function isPlainObject(o) {
        /* begin is-plain-object code: */
        let ctor
        let proto
        
        if (is.object(o) === false) {
            return false
        }
        // If has modified constructor
        ctor = o.constructor
        if (ctor === undefined) {
            return true
        }
        /* end is-plain-object code: */

        /* The is-plain-object code continues similarly:

            // If has modified prototype
            proto = ctor.prototype
            if (is.Object(prot) === false) {
                return false
            }
            // If constructor does not have an Object-specific method
            if (prot.hasOwnProperty('isPrototypeOf') === false) {
                return false
            }
            // Most likely a plain Object
            return true

        However, this returns false:

            var o = { constructor: function(){} }
            isPlainObject(o) // false!

        The lodash code does its initial object check, then proceeds as follows: */

        /* begin lodash code */
        proto = o
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto)
        }
        return Object.getPrototypeOf(o) === proto
        /* end lodash code */
    },

    promise: function isPromise(arg) {
        return arg instanceof Promise
    },

    /**
     * Whether the parameter is a readable stream.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    readableStream: function isReadableStream(arg) {
        return arg instanceof EventEmitter && is.function(arg.read)
    },

    /**
     * Whether the parameter is a RegExp.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    regex: function isRegex(arg) {
        return arg instanceof RegExp
    },

    /**
     * Whether the parameter is a stream.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    stream: function isStream(arg) {
        return is.readableStream(arg) || is.writeableStream(arg)
    },

    /**
     * Whether the parameter is a string. Returns false if it was constructed
     * with the `new` keyword.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    string: function isString(arg) {
        return typeof arg === 'string'
    },

    /**
     * Whether the parameter is a Symbol.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    symbol: function isSymbol(arg) {
        return typeof arg === 'symbol'
    },

    /**
     * Alias for `isWriteableStream()`.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    writableStream: function isWritableStream(arg) {
        return is.writeableStream(arg)
    },

    /**
     * Whether the parameter is a writable (writeable) stream.
     *
     * @param {*} The parameter to check
     * @return {boolean} The result
     */
    writeableStream: function isWriteableStream(arg) {
        return (
            arg instanceof EventEmitter &&
            is.function(arg.write) &&
            is.function(arg.end)
        )
    },
}

module.exports = {
    typeOf,
    cast,
    is,
    ...namedf(cast),
    ...namedf(is),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}