const {Is} = require('./types')
const {ArgumentError} = require('../errors')

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
        if (Is.Object(obj) === false) {
            return false
        }
        for (const k in obj) {
            return false
        }
        return true
    },

    isNonEmpty: function isNonEmptyObject(obj) {
        if (Is.Object(obj) === false) {
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
        if (Is.Array(kpath)) {
            return kpath
        }
        if (Is.Symbol(kpath)) {
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
            if (!Is.Object(base) && !Is.Function(base)) {
                return dflt
            }
            if (!(keyPath[i] in base)) {
                return dflt
            }
            base = base[keyPath[i]]
        }
        return base
    },

    lset: function lset(obj, keyPath, value) {
        if (!Is.Object(obj)) {
            throw new ArgumentError(`Argument (obj) must be an object.`)
        }
        keyPath = objects.keyPath(keyPath)
        let base = obj
        for (let i = 0; i < keyPath.length - 1; ++i) {
            const key = keyPath[i]
            if (!Is.Object(base[key])) {
                base[key] = {}
            }
            base = base[key]
        }
        base[keyPath[keyPath.length - 1]] = value
        return obj
    },

    rekey: function rekey(obj, cb) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value], i) =>
                [cb(key, i), value]
            )
        )
    },

    revalue: function revalue(obj, cb) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value], i) =>
                [key, cb(value, i)]
            )
        )
    },

    valuesHash: function valuesHash(...args) {
        return Object.fromEntries(
            args.map(Object.values).flat().map(value =>
                [value, true]
            )
        )
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