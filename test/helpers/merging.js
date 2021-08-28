const deepmerge = require('deepmerge')
const {
    types: {isPlainObject, isObject},
} = require('../../index.js')

const merging = module.exports = {
    merge: function mergePlain(...args) {
        return deepmerge.all(args.filter(isPlainObject), {
            isMergeableObject: isPlainObject,
        })
    },
    spread: function spreadMerge(...args) {
        return Object.fromEntries(
            args.filter(isObject).map(Object.entries).flat()
        )
    },
}