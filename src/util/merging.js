const deepmerge = require('deepmerge')
const {isPlainObject, isObject} = require('./types.js')

const merging = {
    plain: function mergePlain(...args) {
        return deepmerge.all(args.filter(isPlainObject), {
            isMergeableObject: isPlainObject,
        })
    },
    spread: function spreadMerge(...args) {
        return Object.fromEntries(
            args.filter(isObject).map(Object.entries).flat()
        )
    },
    get merge() {
        return merging.plain
    },
}

module.exports = {
    ...merging,
    ...namedf(merging),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}

/*
    static createMerger(opts) {
        const {arrayHash, checkArg, isPlainObject} = Util
        opts = {
            name: null,
            argFilter: Boolean,
            ignoreKeys: null,
            customMerge: null,
            isMergeableObject: isPlainObject,
            ...opts
        }
        if (opts.ignoreKeys && opts.customMerge) {
            throw new TypeError(`Cannot specify both ignoreKeys and customMerge`)
        }
        checkArg(
            opts.argFilter,         'argFilter',         'function|null',
            opts.ignoreKeys,        'ignoreKeys',        'array|null',
            opts.isMergeableObject, 'isMergeableObject', 'function|null',
            opts.customMerge,       'customMerge',       'function|null',
            opts.name,              'name',              'string|null',
        )

        function chooseb(a, b) {
            return b
        }
        function noFilter() {
            return true
        }
        const filter = opts.argFilter || noFilter

        const merger = function customMerger(...args) {
            return deepmerge.all(args.filter(filter), opts)
        }

        const {ignoreKeys} = opts
        if (ignoreKeys) {
            const keyHash = arrayHash(ignoreKeys)
            opts.customMerge = function checkKeyChooseb(key) {
                if (keyHash[key]) {
                    return chooseb
                }
            }
            Object.defineProperty(merger, 'getIgnoreKeysHashCopy', {
                value: function keyHashView () {
                    return arrayHash(ignoreKeys)
                }
            })
        } else if (opts.customMerge) {
            Object.defineProperties(merger, {
                isCustomMerge: {
                    value: true,
                },
                customMergeProxy: {
                    value: function customMergeProxy(key) {
                        return opts.customMerge(key)
                    },
                },
                customMergeName: {
                    value: opts.customMerge.name,
                },
            })
        }

        if (opts.name) {
            Object.defineProperty(merger, 'name', {value: opts.name})
        }

        return merger
    }
*/