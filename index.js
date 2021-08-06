const {Cast, Is, typeOf} = require('./src/util/types.js')
const {merge} = require('./src/util/merge.js')
module.exports = {
    get Logger() { return require('./src/logger.js') },
    get HashProxy() { return require('./src/hash-proxy.js') },
    get strings() { return require('./src/util/strings.js')},
    get arrays() { return require('./src/util/arrays.js')},
    get errors() { return require('./src/util/errors.js')},
    get objects() { return require('./src/util/objects.js')},
    merge,
    Cast,
    Is,
    typeOf,
}