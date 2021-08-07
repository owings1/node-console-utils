const {expect} = require('chai')
const assert = require('assert')
const util = require('util')
const {ger, TestError} = require('./errors.js')
const {
    Cast: {toArray},
    types: {isFunction: isFunc, isString, isArray, isObject},
    objects: {lget, lset, update},
    merging: {spread},
} = require('../../index.js')

const {log, error: logerr, warn} = console

const DefaultUnaryOperator = 'equal'
const DefaultUnaryErrorOperator = 'erri'

const Opt = Symbol('opt')

function build(...args) {
    const tests = toArray(args.pop())
    const opts = spread(
        this[Opt],
        isFunc(args[0]) ? {run: args.shift()} : {},
        ...args,
    )
    create(tests.map(test => spread(opts, test)))
    return this.build
}

function defaults(...args) {
    const opts = isFunc(args[0]) ? {run: args.shift()} : {}
    const self = lset({}, Opt, spread(this[Opt], opts, ...args))
    self.build = build.bind(self)
    update(self.build, {
        // chain
        build    : self.build,
        defaults : defaults.bind(self),
    })
    return self.build
}

module.exports = defaults({})

const create = tests => tests.forEach((opts, i) => {
    const n = i + 1
    const test = createCase(opts)
    if (!isFunc(test.run)) {
        warn(['case:', n, 'opts:', opts])
        const msg = 'Must provide a run function.'
        if (!test.skip) {
            throw new MakeCasesError(msg)
        }
        warn(msg, {skipped: true})
    }
    function testCase() {
        const call = test.run.bind(this, ...test.args)
        const run = test.err ? ger.bind(null, call) : call
        let result
        try {
            result = run()
        } finally {
            if (test.debug) {
                log('case number:', n, 'of', tests.length)
                log('opts (test):', test)
                log('opts (norm):', opts)
                log({result})
            }
        }
        const should = expect(result)
        lget(should, test.oper).apply(should, test.exp)
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
    opts.exp = toArray(opts.exp)
    if (opts.err && opts.eoper && opts.oper) {
        opts.oper = opts.eoper
    }
    if (!opts.oper) {
        if (opts.err && opts.eoper) {
            opts.oper = opts.eoper
        } else if (opts.exp.length === 1) {
            opts.oper = getUnaryOperator(opts, opts.exp[0])
        }
    }
    if (isString(opts.oper)) {
        opts.oper = opts.oper.split('.')
    }
    opts.oper = toArray(opts.oper)
    if (!opts.desc) {
        opts.desc = buildDesciption(opts)
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
            ? JSON.stringify
            : stringly
        const val = opts[key]
        const str = val.map(stringer)
        return val.length === 1 ? str : `(${str})`
    })
    const {err, oper} = opts
    let {retstr} = opts
    if (!retstr) {
        if (err) {
            retstr = 'throw'
        } else if (oper.join('') === 'equal') {
            retstr = 'return'
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

class MakeCasesError extends TestError {}