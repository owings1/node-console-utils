/**
 * @quale/core - Type checking/casting utils
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
import {EventEmitter} from 'events'
const getProto = Object.getPrototypeOf

/**
 * Cast a parameter to an array. If the parameter is an array, the parameter
 * is returned, otherwise a new array is created. If it is null or undefined,
 * an empty array is returned, otherwise a singleton array with the parameter
 * is return.
 *
 * @param {*} val The parameter to cast
 * @return {Array} The parameter if it is an array, or a new array
 */
export function castToArray(val) {
    if (isArray(val)) {
        return val
    }
    const arr = []
    if (val != null) {
        arr.push(val)
    }
    return arr
}


/**
 * Get class/prototype ancestors
 * 
 * @param {Function} cls
 * @return {Function[]}
 */
export function getSubclasses(cls) {
    const ancs = []
    if (!isFunction(cls)) {
        return ancs
    }
    for (let anc = getProto(cls); anc && anc.name; anc = getProto(anc)) {
        ancs.push(anc)
    }
    return ancs
}

/**
 * Whether the parameter is an array.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isArray(arg) {
    return Array.isArray(arg)
}

/**
 * Whether the parameter is a boolean. Returns false if it was constructed
 * with the `new` keyword.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isBoolean(arg) {
    return arg === true || arg === false
}

/**
 * Whether the parameter is a buffer.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isBuffer(arg) {
    return Buffer.isBuffer(arg)
}

/**
 * Whether the parameter is probably a class. This tries to determine
 * whether something *must* be constructed with the `new` keyword.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isClass(arg) {
    if (!isFunction(arg)) {
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
}

/**
 * Whether the parameter is an instance of Error.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isError(arg) {
    return arg instanceof Error
}

/**
 * Whether the parameter is a function.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isFunction(arg) {
    return typeof arg === 'function'
}

/**
 * Whether the parameter is iterable. NB: an object is not iterable.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isIterable(arg) {
    return arg != null && isFunction(arg[Symbol.iterator])
}

/**
 * Whether the parameter is a number.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isNumber(arg) {
    return typeof arg === 'number'
}

/**
 * Whether the parameter is an object.
 *
 * Returns false for: buffer, null, function, new String/Boolean
 * Returns true for: stream
 *
 * From:
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 * https://github.com/jonschlinkert/is-plain-object/blob/0a47f0f6/is-plain-object.js
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 * See file NOTICE.md for details and full license.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]'
}

/**
 * Whether the parameter is probably a "plain" object.
 *
 * Portions from:
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 * https://github.com/jonschlinkert/is-plain-object/blob/0a47f0f6/is-plain-object.js
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 *
 * Portions from:
 * lodash <https://github.com/lodash/lodash>
 * https://github.com/lodash/lodash/blob/2da024c3/isPlainObject.js
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Release under the MIT License.
 *
 * See file NOTICE.md for details and full licenses.
 *
 * @param {*} o The parameter to check
 * @return {Boolean} The result
 */
export function isPlainObject(o) {
    /* begin is-plain-object code: */
    let ctor
    let proto
    if (isObject(o) === false) {
        return false
    }
    // If has modified constructor
    ctor = o.constructor
    if (ctor === undefined) {
        return true
    }
    /* end is-plain-object code: */
    // See test/notes/types.md for additional comments.
    /* begin lodash code */
    proto = o
    while (getProto(proto) !== null) {
        proto = getProto(proto)
    }
    return getProto(o) === proto
    /* end lodash code */
}

/**
 * Whether the parameter is a Promise.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isPromise(arg) {
    return arg instanceof Promise
}

/**
 * Whether the parameter is a readable stream.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isReadableStream(arg) {
    return arg instanceof EventEmitter && isFunction(arg.read)
}

/**
 * Whether the parameter is a RegExp.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isRegex(arg) {
    return arg instanceof RegExp
}

/**
 * Whether the parameter is a stream.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isStream(arg) {
    return isReadableStream(arg) || isWriteableStream(arg)
}

/**
 * Whether the parameter is a string. Returns false if it was constructed
 * with the `new` keyword.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isString(arg) {
    return typeof arg === 'string'
}

/**
 * Check if a class is a subclass of another
 * 
 * @param {Function} cls
 * @param {Function} parent
 * @return {Boolean}
 */
export function isSubclass(cls, parent) {
    if (!isFunction(cls) || !isFunction(parent)) {
        return false
    }
    for (let anc = getProto(cls); anc && anc.name; anc = getProto(anc)) {
        if (anc === parent) {
            return true
        }
    }
    return false
}

/**
 * Whether the parameter is a Symbol.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isSymbol(arg) {
    return typeof arg === 'symbol'
}

/**
 * Whether the parameter is a writable (writeable) stream.
 *
 * @param {*} arg The parameter to check
 * @return {Boolean} The result
 */
export function isWriteableStream(arg) {
    return (
        arg instanceof EventEmitter &&
        isFunction(arg.write) &&
        isFunction(arg.end)
    )
}

/**
 * Returns a useful type value for the parameter. The default is to return the
 * value of `typeof arg`, else one of the following: 'array', 'buffer', 'class',
 * 'object', 'null', 'regex', 'promise', or 'stream'.
 *
 * @param {*} arg The parameter to check
 * @return {String} The type
 */
export function typeOf(arg) {
    if (arg === null) {
        return 'null'
    }
    const type = typeof arg
    if (type !== 'object') {
        if (type === 'function' && isClass(arg)) {
            return 'class'
        }
        return type
    }
    if (isArray(arg)) {
        return 'array'
    }
    if (isBuffer(arg)) {
        return 'buffer'
    }
    if (isStream(arg)) {
        return 'stream'
    }
    if (isRegex(arg)) {
        return 'regex'
    }
    if (isPromise(arg)) {
        return 'promise'
    }
    return type
}

export {isWriteableStream as isWritableStream}

/** @deprecated */
export const cast = {
    toArray: castToArray,
}
/** @deprecated */
export const is = {
    array: isArray,
    boolean: isBoolean,
    buffer: isBuffer,
    class: isClass,
    error: isError,
    function: isFunction,
    iterable: isIterable,
    number: isNumber,
    object: isObject,
    plainObject: isPlainObject,
    promise: isPromise,
    readableStream: isReadableStream,
    regex: isRegex,
    stream: isStream,
    string: isString,
    symbol: isSymbol,
    writableStream: isWriteableStream,
    writeableStream: isWriteableStream,
}