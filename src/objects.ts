/**
 * @quale/core - object utils
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
import {isFunction, isObject, isSymbol} from './types.js'

const getOwnNames = Object.getOwnPropertyNames
const getOwnSymbols = Object.getOwnPropertySymbols
const enumable = (obj:object, prop:any):boolean => Object.propertyIsEnumerable.call(obj, prop)
const SymNoKey = Symbol('NoKey')

export {isObject}

/**
 * Get entries, including symbols.
 *
 * @see objectKeys()
 * @throws {TypeError}
 *
 * @param {object} obj The object
 * @param {Boolean} isAll Include non-enumerable keys, default `false`
 * @return {array} The entries
 */
export function entries(obj:object, isAll:boolean = false): any[] {
    return keys(obj, isAll).map(key => [key, obj[key]])
}

/**
 * Check whether the key path exists.
 *
 * @param {object} obj The object
 * @param {string|string[]|symbol} key The key path
 * @return {Boolean}
 */
export function hasKey(obj:object, key:string|symbol|Array<string|symbol>): boolean {
    return lget(obj, key, SymNoKey) !== SymNoKey
}

/**
 * Check whether an object is empty. Returns `false` if the parameter is
 * not an object. All enumerable properties are checked, including symbols.
 *
 * @see isNullOrEmpty()
 *
 * @param {*} obj The input to check
 * @return {Boolean}
 */
export function isEmpty(obj:any): boolean {
    if (isObject(obj) === false) {
        return false
    }
    for (const k in obj) {
        return false
    }
    return !getOwnSymbols(obj).some(sym => enumable(obj, sym))
}

/**
 * @param {object} obj
 * @return {Boolean}
 */
export function isNonEmpty(obj:object): boolean {
    return isObject(obj) && !isEmpty(obj)
}

/**
 * @param {object} arg
 * @return {Boolean}
 */
export function isNullOrEmpty(arg:any):boolean {
    return arg === null || typeof arg === 'undefined' || isEmpty(arg)
}

/**
 * @param {String|String[]|Symbol} kpath
 * @return {String[]}
 */
export function keyPath(kpath:string|symbol|Array<string|symbol>): Array<string|symbol> {
    if (Array.isArray(kpath)) {
        return kpath
    }
    if (isSymbol(kpath)) {
        return [kpath]
    }
    return String(kpath).split('.')
}

/**
 * Get keys, including symbols.
 *
 * @throws {TypeError}
 *
 * @param {object} obj The object
 * @param {Boolean} isAll Include non-enumerable keys, default `false`
 * @return {String[]} The keys
 */
export function keys(obj:object, isAll: boolean = false): Array<string|symbol> {
    const keys: Array<string|symbol> = []
    getOwnNames(obj).forEach(key => {
        if (isAll || enumable(obj, key)) {
            keys.push(key)
        }
    })
    getOwnSymbols(obj).forEach(key => {
        if (isAll || enumable(obj, key)) {
            keys.push(key)
        }
    })
    return keys
}

/**
 * @throws {TypeError}
 *
 * @param {object} obj The object to query.
 * @param {String|String[]|Symbol} path The key path.
 * @param {*} defaultValue The value to return if not found.
 * @return {*} The value, default value, or undefined.
 */
export function lget(obj:object, path:string|symbol|Array<string|symbol>, defaultValue:any = undefined):any {
    path = keyPath(path)
    if (path.length === 0) {
        return defaultValue
    }
    let base = obj
    for (let i = 0; i < path.length; ++i) {
        if (!isObject(base) && !isFunction(base)) {
            return defaultValue
        }
        if (!(path[i] in base)) {
            return defaultValue
        }
        base = base[path[i]]
    }
    return base
}

/**
 * @throws {TypeError}
 *
 * @param {object} obj The object to set
 * @param {String|String[]|Symbol} path The key path.
 * @param {*} value The value
 * @param {object|null} proto Prototype for creating new objects, default is `Object.prototype`.
 * @return {object} The obj parameter
 */
export function lset(obj:object, path:string|symbol|Array<string|symbol>, value:any, proto:object = Object.prototype):object {
    if (!isObject(obj)) {
        throw new TypeError(`Argument (obj) must be an object.`)
    }
    path = keyPath(path)
    let base = obj
    for (let i = 0; i < path.length - 1; ++i) {
        const key = path[i]
        if (!isObject(base[key])) {
            base[key] = Object.create(proto)
        }
        base = base[key]
    }
    base[path[path.length - 1]] = value
    return obj
}

/**
 * Create a new object with the same values and different keys. All own and
 * enumerable properties will be iterated, including symbols.
 * 
 * @throws {TypeError}
 * 
 * @param {object} obj Source object
 * @param {object|Function} proto The prototype for the new object, default is `Object.prototype`
 * @param {Function|undefined} cb The callback, receives `key`, `index`
 * @return {object} The new object
 */
export function rekey(obj:object, proto:object|Function|undefined, cb:Function|undefined): object {
    if (proto === undefined) {
        throw new TypeError('Missing second argument')
    }
    if (cb === undefined) {
        // @ts-ignore
        cb = proto
        proto = Object.prototype
    }
    const ret = Object.create(proto)
    entries(obj).forEach(([key, value], i) =>
        // @ts-ignore
        ret[cb(key, i)] = value
    )
    return ret
}

/**
 * Create a new object with the same key and different values. All own and
 * enumerable properties will be iterated, including symbols.
 *
 * @throws {TypeError}
 *
 * @param {object} obj Source object
 * @param {object|Function} proto The prototype for the new object, default is `Object.prototype`
 * @param {Function|undefined} cb The callback, receives `value`, `index`
 * @return {object} The new object
 */
export function revalue(obj:object, proto:object|Function|undefined, cb:Function|undefined): object {
    if (proto === undefined) {
        throw new TypeError('Missing second argument')
    }
    if (cb === undefined) {
        // @ts-ignore
        cb = proto
        proto = Object.prototype
    }
    const ret = Object.create(proto)
    entries(obj).forEach(([key, value], i) =>
        // @ts-ignore
        ret[key] = cb(value, i)
    )
    return ret
}

/**
 * Return a object with the input's values as key, with `true` as all values.
 * All own and enumerable properties will be iterated, including symbols.
 *
 * @throws {TypeError}
 *
 * @param {object|array} obj The input object
 * @param {object|null} proto The prototype of the hash object, default is Object.prototype
 * @return {object} The result object
 */
export function valueHash(obj: object|any[], proto:object|null = Object.prototype): object {
    const vals = Array.isArray(obj) ? obj : values(obj)
    const ret = Object.create(proto)
    vals.forEach((value: any) => ret[value] = true)
    return ret
}

/**
 * Get values, including symbols.
 *
 * @see objectKeys()
 * @throws {TypeError}
 *
 * @param {object} obj The object
 * @param {Boolean} isAll Include non-enumerable keys, default `false`
 * @return {Array} The values
 */
export function values(obj:object, isAll:boolean = false): any[] {
    return keys(obj, isAll).map(key => obj[key])
}

/**
 * Update an object with new values. All own and enumerable properties
 * will be iterated, including symbols.
 *
 * @throws {TypeError}
 *
 * @param {object} target The target object to update
 * @param {object} source The source object with the new values
 * @return {object} The target object
 */
export function update(target:any, source:any): object {
    target = target || {}
    source = source || {}
    // See test/notes/objects.md for comments about using keys vs entries.
    entries(source).forEach(([key, value]) => {
        target[key] = value
    })
    return target
}
