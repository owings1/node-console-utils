const {expect} = require('chai')
const assert = require('assert')
const util = require('util')
const {ger, TestError} = require('./errors.js')
const {
    Cast: {toArray},
    types: {isFunction: isFunc, isString, isArray, isObject},
    objects: {lget, lset, update},
    merging: {spread, merge},
    arrays: {last},
} = require('../../index.js')

const {log, error: logerr, warn} = console

const DefaultUnaryOperator = 'equal'
const DefaultUnaryErrorOperator = 'erri'

const s_ = Symbol('self')

function def(...args) {
    const cb = isFunc(last(args)) ? args.pop() : false
    const title = isString(args[0]) ? args.shift() : (isFunc(args[0]) ? '#' + args[0].name : false)
    const opts = spread(isFunc(args[0]) ? {run: args.shift()} : {}, ...args)
    const isNew = !this[s_]
    const self = isNew ? lset({}, s_, true) : this
    if (isNew) {
        update(self, {
            def: def.bind(self),
            opts: merge(opts),
            track: [],
        })
        update(self.def, {
            test : test.bind(self),
            set: set.bind(self),
        })
    }
    if (cb) {
        const save = self.track.slice(0)
        self.track.push(opts)
        const desc = title ? () => describe(title, cb) : cb
        try {
            desc()
        } finally {
            self.track = save
        }
    }
    return self.def
}

function set(...args) {
    const opts = spread(
        isFunc(args[0]) ? {run: args.shift()} : {},
        ...args,
    )
    this.track.push(opts)
    return this.def
}

function test(...args) {
    const opts = isFunc(args[0]) ? {run: args.shift()} : {}
    create(args.flat().map(test => spread(this.opts, ...this.track, opts, test)))
    return this.def
}

module.exports = def()

const create = tests => tests.forEach((opts, i) => {
    const n = i + 1
    const test = createCase(opts)
    if (!isFunc(test.run)) {
        warn(['case:', n, 'test:', test])
        const msg = 'Must provide a run function.'
        if (!test.skip) {
            throw new MakeCasesError(msg)
        }
        warn(msg, {skipped: true})
    }
    function testCase() {
        const call = test.run.bind(this, ...test.args)
        const run = test.err ? ger.bind(null, call) : call
        try {
            test.result = run()
            if (test.cb) {
                test.cb.call(this, test)
            }
            if (test.resg) {
                test.result = test.resg.call(this, test)
            }
        } finally {
            if (test.debug) {
                log(`test (${n} of ${tests.length})`, test)
            }
        }
        if (test.expg) {
            test.exp = test.expg.call(this, test)
        }
        const should = expect(test.result)
        lget(should, test.oper).call(should, test.exp)
    }
    const that = getit(it, opts)
    that.call(that, test.desc, testCase)
})

const getit = (it, opts) => opts.skip ? it.skip : (opts.only ? it.only : it)

function createCase(opts) {
    opts = {...opts}
    opts.args = toArray(opts.args)
    if (opts.err) {
        if (opts.err !== true) {
            opts.exp = opts.err
        }
    }
    if (opts.err && opts.eoper && opts.oper) {
        opts.oper = opts.eoper
    }
    if (!opts.oper) {
        if (opts.err && opts.eoper) {
            opts.oper = opts.eoper
        } else {
            opts.oper = getUnaryOperator(opts, opts.exp)
        }
    }
    if (isString(opts.oper)) {
        opts.oper = opts.oper.split('.')
    }
    opts.oper = toArray(opts.oper)
    if (!opts.desc) {
        opts.desc = buildDesciption(opts)
    }
    if (opts.desca) {
        opts.desc += `, and ${opts.desca}`
    }
    return opts
}

function getUnaryOperator(opts, val) {
    if (opts.err) {
        if (isFunc(val)) {
            return 'instanceof'
        }
        return DefaultUnaryErrorOperator
    }
    return DefaultUnaryOperator
}

function buildDesciption(opts) {
    const {exp, args, json} = opts
    const [expstr, argstr] = ['exp', 'args'].map(key => {
        const strkey = key + 'str'
        if (opts[strkey]) {
            return opts[strkey]
        }
        const stringer = [true, key].includes(json)
            ? tojson
            : stringly
        const val = key === 'exp' ? [opts[key]] : opts[key]
        const str = val.map(stringer)
        return val.length === 1 ? str : `(${str})`
    })
    const {err, oper} = opts
    let {retstr} = opts
    if (!retstr) {
        if (err) {
            retstr = 'throw'
        } else {
            retstr = oper.join(' ')
        }
    }
    return `should ${retstr} ${expstr} for ${argstr}`
}

function stringly(arg) {
    if (isFunc(arg)) {
        return arg.name
    }
    let str = String(arg)
    return isString(arg) ? `'${str}'` : str
}
/*
From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify:
If you return a Number, String, Boolean, or null, the stringified version of that value is used as the property's value.
If you return a Function, Symbol, or undefined, the property is not included in the output.
If you return any other object, the object is recursively stringified, calling the replacer function on each property.
*/
function tojson(arg) {
    return JSON.stringify(arg, (key, value) => {
        if (isFunc(value)) {
            return value.name ?? '(function)'
        }
        return value
    })
}

class MakeCasesError extends TestError {}