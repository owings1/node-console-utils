const {Is} = require('./types.js')

const buffers = {
    /**
     * @throws {TypeError}
     * @param {buffer}
     * @param {buffer}
     * @return {boolean}
     */
    equal: function buffersEqual(a, b) {
        if (Is.Function(a.equals)) {
            return a.equals(b)
        }
        if (Is.Function(a.compare)) {
            return a.compare(b) == 0
        }
        const len = a.length
        if (len !== b.length) {
            return false
        }
        for (let i = 0; i < len; ++i) {
            if (a.readUInt8(i) !== b.readUInt8(i)) {
                return false
            }
        }
        return true
    },
}

module.exports = {
    ...buffers,
    ...namedf(buffers),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}