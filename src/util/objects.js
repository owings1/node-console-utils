const {Is} = require('./types')
const {ArgumentError} = require('../errors')

/* ... find a home buddy
static buffersEqual(a, b) {
    if (Util.isFunction(a.equals)) {
        return a.equals(b)
    }
    if (Util.isFunction(a.compare)) {
        return a.compare(b) == 0
    }
    const len = a.length
    if (len != b.length) {
        return false
    }
    for (let i = 0; i < len; ++i) {
        if (a.readUInt8(i) !== b.readUInt8(i)) {
            return false
        }
    }
    return true
}
*/
function lget(obj, keyPath) {
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
}

function lset(obj, keyPath, value) {
    if (!Is.Object(obj)) {
        throw new ArgumentError(`Argument (obj) must be an object.`)
    }
    if (!keyPath) {
        return
    }
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
}

function rekey(obj, cb) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value], i) =>
            [cb(key, i), value]
        )
    )
}

function revalue(obj, cb) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value], i) =>
            [key, cb(value, i)]
        )
    )
}

/**
 * Update an object with new values.
 *
 * @param {object} The target object to update
 * @param {object} The source object with the new values
 * @return {object} The target object
 */
function update(target, source) {
    target = target || {}
    source = source || {}
    Object.entries(source).forEach(([key, value]) => {
        target[key] = value
    })
    return target
}

module.exports = {lget, lset, rekey, revalue, update}