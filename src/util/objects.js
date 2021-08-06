const {Is} = require('./types')
const {ArgumentError} = require('../errors')

function revalue(obj, cb) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value], i) =>
            [key, cb(value, i)]
        )
    )
}

function lget(obj, keyPath) {
    if (!keyPath) {
        return
    }
    const parts = Is.Array(keyPath)
        ? keyPath
        : String(keyPath).split('.')
    let base = obj
    for (let i = 0; i < parts.length; ++i) {
        if (!Util.isObject(base)) {
            return
        }
        base = base[parts[i]]
    }
    return base
}

function lset(obj, keyPath, value) {
    if (!Is.Object(obj)) {
        throw new ArgumentError(`Argument (obj) must be an object.`)
    }
    Util.checkArg(obj, 'obj', 'object')
    if (!keyPath) {
        return
    }
    const parts = Is.Array(keyPath)
        ? keyPath
        : String(keyPath).split('.')
    let base = obj
    for (let i = 0; i < parts.length - 1; ++i) {
        const key = parts[i]
        if (!base[key] || typeof base[key] != 'object') {
            base[key] = {}
        }
        base = base[key]
    }
    base[parts[parts.length - 1]] = value
    return obj
}

module.exports = {lget, lset, revalue}