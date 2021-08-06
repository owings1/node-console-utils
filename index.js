const {Cast, Is} = require('./src/util/types.js')
const {merge} = require('./src/util/merge.js')
module.exports = {
    get Logger() { return require('./src/logger.js') },
    get HashProxy() { return require('./src/hash-proxy.js') },
    get Strings() { return require('./src/util/strings.js')},
    merge,
    Cast,
    Is,
}