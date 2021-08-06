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
import {ArgumentError} from './errors.js'
import {Is} from './util/types.js'

export default function HashProxy(source, opts) {
    checkArg(source, 'source', 'object', Is.Object)
    if (opts) {
        checkArg(opts, 'opts', 'object', Is.Object)
    } else {
        opts = {}
    }
    if (opts.transform) {
        checkArg(opts.transform, 'transform', 'function', Is.Function)
    } else {
        opts.transform = passthru
    }
    if (opts.filter) {
        checkArg(opts.filter, 'filter', 'function', Is.Function)
    } else {
        opts.filter = truth
    }
    return build(source, opts)
}

function build(source, opts) {
    const ingress = {}, target = {}
    const enumerable = Boolean(opts.enumerable)
    const {filter, transform} = opts
    Object.keys(source).forEach(key => {
        const prop = {enumerable}
        if (Is.Object(source[key])) {
            const next = build(source[key], opts)
            Object.defineProperty(target, key, {value: next.target})
            prop.get = () => next.ingress
            prop.set = object => {
                if (!Is.Object(object)) {
                    return
                }
                Object.keys(object).forEach(key =>
                    next.ingress[key] = object[key]
                )
            }
        } else {
            target[key] = transform(source[key])
            prop.get = () => source[key]
            prop.set = value => {
                if (!filter(value)) {
                    return
                }
                source[key] = value
                target[key] = transform(value)
            }
        }
        Object.defineProperty(ingress, key, prop)
    })
    return {ingress, target}
}

function passthru(value) {
    return value
}

function truth() {
    return true
}

function checkArg(value, name, desc, check) {
    if (!check(value)) {
        throw new ArgumentError(`Argument (${name}) a ${desc}`)
    }
}