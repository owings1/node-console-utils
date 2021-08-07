const {Cast, Is, typeOf} = require('./src/util/types.js')
const {merge} = require('./src/util/merge.js')
module.exports = {
    get arrays() { return require('./src/util/arrays.js')},
    get buffers() { return require('./src/util/buffers.js')},
    get chars() { return require('./src/util/chars.js')},
    get diffs() { return require('./src/util/diffs.js')},
    get errors() { return require('./src/util/errors.js')},
    get objects() { return require('./src/util/objects.js')},
    get strings() { return require('./src/util/strings.js')},
    get Logger() { return require('./src/logger.js')},
    get HashProxy() { return require('./src/hash-proxy.js')},
    merge,
    Cast,
    Is,
    typeOf,
}