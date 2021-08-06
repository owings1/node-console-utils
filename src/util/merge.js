import {Is} from './types.js'
import deepmerge from 'deepmerge'

export default function mergeDefault(...args) {
    return deepmerge.all(args.filter(Boolean), {
        isMergeableObject: Is.PlainObject,
    })
}