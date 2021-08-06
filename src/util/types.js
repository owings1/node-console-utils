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

const Cast = {
   /**
    * 
    * @param {...*}
    * @return {array}
    */
    toArray(val) {
        if (Array.isArray(val)) {
            return val
        }
        const arr = []
        if (val != null) {
            arr.push(val)
        }
        return arr
    }
}

const Is = {

    Error: function(arg) {
        return arg instanceof Error
    },

    Function: function(arg) {
        return typeof arg === 'function'
    },

    /**
     * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
     *
     * Copyright (c) 2014-2017, Jon Schlinkert.
     * Released under the MIT License.
     */
    Object: function(arg) {
        return Object.prototype.toString.call(arg) === '[object Object]'
    },

    /**
     * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
     *
     * Copyright (c) 2014-2017, Jon Schlinkert.
     * Released under the MIT License.
     */
    PlainObject: function(o) {
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

    ReadableStream: function(arg) {
        return arg instanceof EventEmitter && Is.Function(arg.read)
    },

    Stream: function(arg) {
        return Is.ReadableStream(arg) || Is.WriteableStream(arg)
    },

    String: function(arg) {
        return typeof arg === 'string'
    },

    WriteableStream: function(arg) {
        return (
            arg instanceof EventEmitter &&
            Is.Function(arg.write) &&
            Is.Function(arg.end)
        )
    },
}

Is.WritableStream = Is.WriteableStream

module.exports = {Cast, Is}