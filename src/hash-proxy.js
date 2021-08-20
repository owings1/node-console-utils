/**
 * Copyright (C) 2021 Doug Owings
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const {KeyExistsError, ValueError} = require('./errors.js')
const {isObject, isFunction: isFunc} = require('./util/types.js')
const {hasKey, keyPath, lget, lset} = require('./util/objects.js')

const SrcKey = Symbol('source')
const IngKey = Symbol('ingress')
const CrtKey = Symbol('create')

class HashProxy {

    static create(source, opts) {
        checkArg(source, 'source', 'object', isObject)
        if (opts) {
            checkArg(opts, 'opts', 'object', isObject)
        } else {
            opts = {}
        }
        if (opts.transform) {
            checkArg(opts.transform, 'transform', 'function', isFunc)
        } else {
            opts.transform = passthru
        }
        if (opts.filter) {
            checkArg(opts.filter, 'filter', 'function', isFunc)
        } else {
            opts.filter = truth
        }
        if (opts.proto) {
            checkArg(opts.proto, 'proto', 'object', isObject)
        } else {
            opts.proto = (source.constructor && source.constructor.prototype) || null
        }
        const {ingress, target} = build(source, opts)
        Object.defineProperty(target, CrtKey, {value: true})
        return new HashProxy(source, target, ingress, opts)//{ingress, target}
    }

    constructor(source, target, ingress, opts) {
        if (target[CrtKey] !== true) {
            throw new TypeError(`Must use static ${this.constructor.name} create method`)
        }
        // todo defineprop
        this.source = source
        this.target = target
        this.ingress = ingress
        this.opts = opts
    }

    createEntry(kpath, value) {
        checkEntry(kpath, value)
        kpath = keyPath(kpath)
        if (hasKey(this.source, kpath)) {
            throw new KeyExistsError(`Key exists: ${kpath.join('.')}`)
        }
        const {opts} = this
        const leafKey = kpath.pop()
        let {source, target, ingress} = this
        for (let i = 0; i < kpath.length; ++i) {
            const key = kpath[i]
            if (!isObject(target[key])) {
                const tobj = Object.create(this.opts.proto)
                const tgtProp = getTargetNodeProp(tobj)
                Object.defineProperty(target, key, tgtProp)
            }
            if (!isObject(source[key])) {
                source[key] = Object.create(this.opts.proto)
            }
            if (!isObject(ingress[key])) {
                const iobj = Object.create(this.opts.proto)
                const inProp = getIngressNodeProp(source[key], iobj, opts)
                Object.defineProperty(ingress, key, inProp)
            }
            target = target[key]
            source = source[key]
            ingress = ingress[key]
        }
        const tgtProp = getTargetLeafProp(source, leafKey, opts)
        const inProp = getIngressLeafProp(source, target, leafKey, opts)
        Object.defineProperty(target, leafKey, tgtProp)
        Object.defineProperty(ingress, leafKey, inProp)
        ingress[leafKey] = value
    }

    upsertEntry(kpath, value) {
        checkEntry(kpath, value)
        kpath = keyPath(kpath)
        if (!hasKey(this.source, kpath)) {
            return this.createEntry(kpath, value)
        }
        if (isObject(lget(this.source, kpath))) {
            throw new ValueError(`Cannot overwrite an object value`)
        }
        lset(this.ingress, kpath, value)
    }
}

module.exports = HashProxy

function build(source, opts) {
    const ingress = Object.create(opts.proto)
    const target = Object.create(opts.proto)
    Object.keys(source).forEach(key => {
        let inProp, tgtProp
        if (isObject(source[key])) {
            const next = build(source[key], opts)
            tgtProp = getTargetNodeProp(next.target)
            inProp = getIngressNodeProp(source[key], next.ingress, opts)
        } else {
            tgtProp = getTargetLeafProp(source, key, opts)
            inProp = getIngressLeafProp(source, target, key, opts)
        }
        Object.defineProperty(target, key, tgtProp)
        Object.defineProperty(ingress, key, inProp)
    })
    return {ingress, target}
}

function getIngressNodeProp(srcNode, nextIn, opts) {
    const enumerable = Boolean(opts.enumerable)
    return {
        enumerable,
        get: () => nextIn,
        set: object => {
            if (!isObject(object)) {
                return
            }
            Object.keys(object).forEach(key => {
                if (key in srcNode) {
                    nextIn[key] = object[key]
                }
            })
        }
    }
}

function getTargetNodeProp(nextTarget) {
    return {
        value: nextTarget,
        enumerable: true,
    }
}

// src, tgt are already resolved to depth - 1
function getIngressLeafProp(srcLeaf, tgtLeaf, key, opts) {
    const enumerable = Boolean(opts.enumerable)
    const {filter, transform} = opts
    return {
        enumerable,
        get: () => srcLeaf[key],
        set: value => {
            if (!filter(value)) {
                return
            }
            srcLeaf[key] = value
            tgtLeaf[key] = transform(value)
        }
    }
}

function getTargetLeafProp(srcLeaf, key, opts) {
    const {transform} = opts
    return {
        value: transform(srcLeaf[key]),
        // some day this might get fixed.
        writable   : true,
        enumerable : true,
        writeable  : true,
    }
}

function passthru(value) {
    return value
}

function truth() {
    return true
}

function checkArg(value, name, desc, check) {
    if (!check(value)) {
        throw new TypeError(`Argument (${name}) must be a ${desc}`)
    }
}

function checkEntry(kpath, value) {
    kpath = keyPath(kpath)
    if (!kpath) {
        throw new TypeError(`Bad keypath ${kpath}`)
    }
    if (isObject(value)) {
        throw new TypeError('Value cannot be an object.')
    }
}