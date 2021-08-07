const {Is} = require('./types')
const {ArgumentError} = require('../errors')

const objects = module.exports = {

    isNullOrEmpty: function isNullOrEmptyObject(arg) {
        return !Is.Iterable(arg) || objects.isEmpty(arg)
    },

    /**
     * Check whether an object is empty. Returns false if the parameter is not
     * iterable.
     * @see {isNullOrEmpty}
     * @param {*} The input to check
     * @return {boolean}
     */
    isEmpty: function isEmptyObject(obj) {
        if (!Is.Iterable(obj)) {
            return false
        }
        for (const k in obj) {
            return false
        }
        return true
    },

    lget: function lget(obj, keyPath) {
        if (!keyPath) {
            return
        }
        const parts = Is.Array(keyPath) ? keyPath : String(keyPath).split('.')
        let base = obj
        for (let i = 0; i < parts.length; ++i) {
            if (!Is.Object(base)) {
                return
            }
            base = base[parts[i]]
        }
        return base
    },
    lset: function lset(obj, keyPath, value) {
        if (!Is.Object(obj)) {
            throw new ArgumentError(`Argument (obj) must be an object.`)
        }
        if (!keyPath) {
            return
        }
        const parts = Is.Array(keyPath) ? keyPath : String(keyPath).split('.')
        let base = obj
        for (let i = 0; i < parts.length - 1; ++i) {
            const key = parts[i]
            if (!Is.Object(base[key])) {
                base[key] = {}
            }
            base = base[key]
        }
        base[parts[parts.length - 1]] = value
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
        Object.entries(source).forEach(([key, value]) => {
            target[key] = value
        })
        return target
    },
}