/**
 * @quale/core - object utils
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
const {isArray, isFunction, isObject, isSymbol} = require('./types.js')

const getOwnNames = Object.getOwnPropertyNames
const getOwnSymbols = Object.getOwnPropertySymbols
const isEnum = (obj, prop) => Object.propertyIsEnumerable.call(obj, prop)
const SymNoKey = Symbol('NoKey')

const objects = {

    /**
     * Get entries, including symbols.
     *
     * @see `objectKeys()`
     * @throws {TypeError}
     *
     * @param {object} The object
     * @param {boolean} (optional) Include non-enumerable keys, default `false`
     * @return {array} The entries
     */
    entries: function objectEntries(obj, isAll = false) {
        return objects.keys(obj, isAll).map(key => [key, obj[key]])
    },

    /**
     * Check whether the key path exists.
     *
     * @param {object} The object
     * @param {string|array|symbol} The key path
     * @return {boolean}
     */
    hasKey: function hasKey(obj, key) {
        return objects.lget(obj, key, SymNoKey) !== SymNoKey
    },

    /**
     * Check whether an object is empty. Returns `false` if the parameter is
     * not an object. All enumerable properties are checked, including symbols.
     *
     * @see `isNullOrEmpty()`
     *
     * @param {*} The input to check
     * @return {boolean}
     */
    isEmpty: function isEmptyObject(obj) {
        if (isObject(obj) === false) {
            return false
        }
        for (const k in obj) {
            return false
        }
        return !getOwnSymbols(obj).some(sym => isEnum(obj, sym))
    },

    /**
     * @param {object}
     * @return {boolean}
     */
    isNonEmpty: function isNonEmptyObject(obj) {
        return isObject(obj) && !objects.isEmpty(obj)
    },

    /**
     * @param {object}
     * @return {boolean}
     */
    isNullOrEmpty: function isNullOrEmptyObject(arg) {
        return arg === null || typeof arg === 'undefined' || objects.isEmpty(arg)
    },

    /**
     * @param {string|array|symbol}
     * @return {array}
     */
    keyPath: function getKeyPath(kpath) {
        if (isArray(kpath)) {
            return kpath
        }
        if (isSymbol(kpath)) {
            return [kpath]
        }
        return String(kpath).split('.')
    },

    /**
     * Get keys, including symbols.
     *
     * @throws {TypeError}
     *
     * @param {object} The object
     * @param {boolean} (optional) Include non-enumerable keys, default `false`
     * @return {array} The keys
     */
    keys: function objectKeys(obj, isAll = false) {
        const keys = []
        getOwnNames(obj).forEach(key => {
            if (isAll || isEnum(obj, key)) {
                keys.push(key)
            }
        })
        getOwnSymbols(obj).forEach(key => {
            if (isAll || isEnum(obj, key)) {
                keys.push(key)
            }
        })
        return keys
    },

    /**
     * @throws {TypeError}
     *
     * @param {object} The object to query.
     * @param {string|array|symbol} The key path.
     * @param {*} (optional) The value to return if not found.
     * @return {*} The value, default value, or undefined.
     */
    lget: function lget(obj, keyPath, dflt) {
        keyPath = objects.keyPath(keyPath)
        if (keyPath.length === 0) {
            return dflt
        }
        let base = obj
        for (let i = 0; i < keyPath.length; ++i) {
            if (!isObject(base) && !isFunction(base)) {
                return dflt
            }
            if (!(keyPath[i] in base)) {
                return dflt
            }
            base = base[keyPath[i]]
        }
        return base
    },

    /**
     * @throws {TypeError}
     *
     * @param {object} The object to set
     * @param {string|array|symbol} The key path
     * @param {*} The value
     * @param {object|null} (optional) Prototype for creating new objects,
              default is `Object.prototype`.
     * @return {object}
     */
    lset: function lset(obj, keyPath, value, proto = Object.prototype) {
        if (!isObject(obj)) {
            throw new TypeError(`Argument (obj) must be an object.`)
        }
        keyPath = objects.keyPath(keyPath)
        let base = obj
        for (let i = 0; i < keyPath.length - 1; ++i) {
            const key = keyPath[i]
            if (!isObject(base[key])) {
                base[key] = Object.create(proto)
            }
            base = base[key]
        }
        base[keyPath[keyPath.length - 1]] = value
        return obj
    },

    /**
     * Create a new object with the same values and different keys. All own and
     * enumerable properties will be iterated, including symbols.
     * 
     * @throws {TypeError}
     *
     * @param {object} Source object
     * @param {object|null} (optional) The prototype for the new object
     * @param {function} The callback, receives `key`, `index`
     * @return {object} The new object
     */
    rekey: function rekey(obj, ...args) {
        const cb = args.pop()
        const proto = args.length === 1 ? args[0] : Object.prototype
        const ret = Object.create(proto)
        objects.entries(obj).forEach(([key, value], i) =>
            ret[cb(key, i)] = value
        )
        return ret
    },

    /**
     * Create a new object with the same key and different values. All own and
     * enumerable properties will be iterated, including symbols.
     *
     * @throws {TypeError}
     *
     * @param {object} Source object
     * @param {object|null} (optional) The prototype for the new object
     * @param {function} The callback, receives `value`, `index`
     * @return {object} The new object
     */
    revalue: function revalue(obj, ...args) {
        const cb = args.pop()
        const proto = args.length === 1 ? args[0] : Object.prototype
        const ret = Object.create(proto)
        objects.entries(obj).forEach(([key, value], i) =>
            ret[key] = cb(value, i)
        )
        return ret
    },

    /**
     * Return a object with the input's values as key, with `true` as all values.
     * All own and enumerable properties will be iterated, including symbols.
     *
     * @throws {TypeError}
     *
     * @param {object|array} The input object
     * @param {object|null} (optional) The prototype of the hash object.
     *        Default is Object.prototype
     * @return {object} The result object
     */
    valueHash: function valueHash(obj, proto = Object.prototype) {
        const values = isArray(obj) ? obj : objects.values(obj)
        const ret = Object.create(proto)
        values.forEach(value => ret[value] = true)
        return ret
    },

    /**
     * Get values, including symbols.
     *
     * @see `objectKeys()`
     * @throws {TypeError}
     *
     * @param {object} The object
     * @param {boolean} (optional) Include non-enumerable keys, default `false`
     * @return {array} The values
     */
    values: function objectValues(obj, isAll = false) {
        return objects.keys(obj, isAll).map(key => obj[key])
    },

    /**
     * Update an object with new values. All own and enumerable properties
     * will be iterated, including symbols.
     *
     * @throws {TypeError}
     *
     * @param {object} The target object to update
     * @param {object} The source object with the new values
     * @return {object} The target object
     */
    update: function update(target, source) {
        target = target || {}
        source = source || {}
        // See test/notes/objects.md for comments about using keys vs entries.
        objects.entries(source).forEach(([key, value]) => {
            target[key] = value
        })
        return target
    },
}

module.exports = {
    ...objects,
    ...namedf(objects),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}