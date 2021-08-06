const {Is} = require('./types.js')
const deepmerge = require('deepmerge')
function mergeDefault(...args) {
    return deepmerge.all(args.filter(Boolean), {
        isMergeableObject: Is.PlainObject,
    })
}
module.exports = {mergeDefault, merge: mergeDefault}