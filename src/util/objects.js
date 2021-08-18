const {
    isArray,
    isFunction,
    isObject,
    isSymbol,
} = require('./types')

const SymNoKey = Symbol('NoKey')

const objects = {

    hasKey: function hasKey(obj, key) {
        return objects.lget(obj, key, SymNoKey) !== SymNoKey
    },

    /**
     * Check whether an object is empty. Returns false if the parameter is not
     * an object.
     * @see {isNullOrEmpty}
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
        return true
    },

    isNonEmpty: function isNonEmptyObject(obj) {
        if (isObject(obj) === false) {
            return false
        }
        for (const k in obj) {
            return true
        }
        return false
    },

    isNullOrEmpty: function isNullOrEmptyObject(arg) {
        return arg === null || typeof arg === 'undefined' || objects.isEmpty(arg)
    },

    keyPath: function getKeyPath(kpath) {
        if (isArray(kpath)) {
            return kpath
        }
        if (isSymbol(kpath)) {
            return [kpath]
        }
        return String(kpath).split('.')
    },

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
        Object.entries(obj).forEach(([key, value], i) =>
            ret[cb(key, i)] = value
        )
        return ret
    },

    /**
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
        Object.entries(obj).forEach(([key, value], i) =>
            ret[key] = cb(value, i)
        )
        return ret
    },

    /**
     * Return a object with the input's values as key, with `true` as all values.
     *
     * @throws {TypeError}
     *
     * @param {object|array} The input object
     * @param {object|null} (optional) The prototype of the hash object.
     *        Default is Object.prototype
     * @return {object} The result object
     */
    valueHash: function valueHash(obj, proto = Object.prototype) {
        const values = isArray(obj) ? obj : Object.values(obj)
        const ret = Object.create(proto)
        values.forEach(value => ret[value] = true)
        return ret
    },

    /**
     * Update an object with new values.
     *
     * @param {object} The target object to update
     * @param {object} The source object with the new values
     * @return {object} The target object
     */
    update: function update(target, source) {
        target = target || {}
        source = source || {}
        /*

        Using Object.keys differs if there is a getter in the source
        that refers to the target.

            Object.keys(source).forEach(key => {
                target[key] = source[key]
            })

        For example:

            let target = {}
            let source = {a: 1, get x() { return target.a }}
            update(target, source)

        With keys: {a: 1, x: 1}
        With entries: {a: 1, x: undefined}

        But with keys the result could be surprising to some users:

            let target = {}
            let source = {a: 1, get [9]() { return target.a }}

        With keys: {'9': undefined, a: 1}
        */
        Object.entries(source).forEach(([key, value]) => {
            target[key] = value
        })
        return target
    },

   ///**
   // * Update the target object with the defaults if the key does not yet exist.
   // *
   // * @throws {TypeError}
   // *
   // * @param {object} The target object to update
   // * @param {object} The defaults to use
   // * @return {object} The target object
   // */
   //static ensure(target, defaults) {
   //    target = target || {}
   //    Object.entries(defaults).forEach(([name, method]) => {
   //        if (!(name in target)) {
   //            target[name] = method
   //        }
   //    })
   //    return target
   //}
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