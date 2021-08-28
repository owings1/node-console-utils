const {expect} = require('chai')
const assert = require('assert')
const {formatWithOptions: formato} = require('util')
const {ger, TestError} = require('./errors.js')
const {spread, merge} = require('./merging.js')
const {
    arrays: {last},
    classes: {inherits},
    objects: {lget, lset, update},
    types: {
        castToArray,
        isArray,
        isBoolean,
        isClass,
        isFunction,
        isNumber,
        isObject,
        isPlainObject,
        isString,
        isSymbol,
        typeOf,
    },
} = require('../../index.js')

const {log, error: logerr, warn} = console

const DefaultUnaryOperator = 'equal'
const DefaultUnaryErrorOperator = 'erri'
const MaxArgDescLength = 40
const MaxDescLength = 120

const s_ = Symbol('self')

/**
 * allowed:
 *   with cb (new ok):
 *     1. def([title,] [run,] [...opts,] cb)
 *
 *   without cb:
 *     4. new def()
 *     5. new def([run,] ...opts)
 *
 * not allowed (thinks run is cb):
 *   a. def(run)
 *   b. new def(run)
 *
 * noop (won't affect opts, use new instead):
 *   c. def([title,] [...opts])
 */
function def(...args) {

    let title, opts, cb
    if (isFunction(last(args))) {
        cb = args.pop()
    }
    if (isString(args[0])) {
        title = args.shift()
        opts = {}
    } else if (isFunction(args[0])) {
        title = '#' + args[0].name
        opts = {run: args.shift()}
    }
    opts = spread(opts, ...args)

    const isNew = !this[s_]
    const self = isNew ? lset({}, s_, true) : this

    if (isNew) {
        update(self, {
            def   : def.bind(self),
            opts  : merge(opts),
            track : [],
        })
        update(self.def, {
            test: test.bind(self),
            set : set.bind(self),
        })
        const mkeys = ['debug', 'only', 'skip']
        for (const key of mkeys) {
            const ins = lset({}, key, true)
            const dmod = defmod.bind(self, ins)
            const tmod = testmod.bind(self, ins)
            self.def[key] = dmod
            self.def.test[key] = tmod
            for (const keyr of mkeys) {
                const insr = spread(ins, lset({}, keyr, true))
                if (keyr !== key) {
                    self.def[key][keyr] = defmod.bind(self, insr)
                    self.def.test[key][keyr] = testmod.bind(self, insr)
                }
            }
        }
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

function defmod(ins, ...args) {
    args.splice(args.length - isFunction(last(args)), 0, ins)
    return def.apply(this, args)
}

function test(...args) {
    let opts = isFunction(args[0]) ? {run: args.shift()} : {}
    opts = spread(this.opts, ...this.track, opts)
    if (!args.length) {
        const todo = {skip: true, descb: 'TODO:'}
        if (opts.descb) {
            todo.descb += ' ' + opts.descb
        }
        if (!opts.args) {
            todo.args = ['...']
        }
        if (opts.exp === undefined) {
            todo.exp = '...'
        }
        args.push(todo)
    }
    const tests = args.flat().map(test => spread(opts, test))
    createTests(tests)
    return this.def
}

function testmod(ins, ...args) {
    return test.apply(this, args.flat().map(arg =>
        isObject(arg) ? spread(arg, ins) : arg
    ))
}

function set(...args) {
    const opts = spread(
        isFunction(args[0]) ? {run: args.shift()} : {},
        ...args,
    )
    this.track.push(opts)
    return this.def
}

module.exports = def()

const createTests = tests => tests.forEach((opts, i) => {
    const n = i + 1
    const test = createCase(opts)
    if (!isFunction(test.run)) {
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
    let {desc} = test
    if (desc.length > MaxDescLength) {
        desc = desc.substring(0, MaxDescLength - 3) + '...'
    }
    const that = getit(it, opts)
    that.call(that, desc, testCase)
})

const getit = (it, opts) => opts.skip ? it.skip : (opts.only ? it.only : it)

function createCase(opts) {
    opts = {...opts}
    opts.args = castToArray(opts.args)
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
    opts.oper = castToArray(opts.oper)
    if (!opts.desc) {
        if (opts.skip) {
            if (opts.args.length === 1 && opts.args[0] === '...' && opts.argsstr == null) {
                opts.argsstr = opts.args[0]
            }
            if (opts.exp === '...' && opts.expstr == null) {
                opts.expstr = opts.exp
            }
        }
        opts.desc = buildDesciption(opts)
    }
    if (opts.desca) {
        opts.desc += `, and ${opts.desca}`
    }
    if (opts.descb) {
        opts.desc = opts.descb + ' ' + opts.desc
    }
    return opts
}

function getUnaryOperator(opts, val) {
    if (opts.err) {
        if (isFunction(val)) {
            return 'instanceof'
        }
        return DefaultUnaryErrorOperator
    }
    return DefaultUnaryOperator
}

function buildDesciption(opts) {
    const {exp, args, err, json} = opts
    const [expstr, argstr] = ['exp', 'args'].map(key => {
        const strkey = key + 'str'
        if (opts[strkey]) {
            return opts[strkey]
        }
        if (err && key === 'exp') {
            if (exp === Error || inherits(exp, Error)) {
                return exp.name
            }
            if (isString(exp)) {
                return exp
            }
        }
        if (key === 'args' && args.length === 0) {
            return 'no arguments'
        }
        const stringer = [true, key].includes(json)
            ? tojson
            : stringly
        const vals = key === 'exp' ? [opts[key]] : opts[key]
        const str = vals.map(stringer)
        return vals.length === 1 ? str : `(${str})`
    })
    const {oper} = opts
    let {retstr} = opts
    if (!retstr) {
        if (err) {
            retstr = 'throw'
        } else {
            retstr = oper.join(' ')
        }
    }
    const prep = args.length === 0 ? 'with' : 'for'
    return `should ${retstr} ${expstr} ${prep} ${argstr}`
}

function stringly(arg) {
    let str
    let type = typeOf(arg)
    if (isBoolean(arg) || isNumber(arg) || isSymbol(arg)) {
        // booleans, numbers, and strings have a constructor
        str = String(arg)
    } else if (isString(arg)) {
        str = "'" + String(arg) + "'"
    } else if (isFunction(arg)) {
        str = `<${type} ${arg.name || 'anon'}>`
    } else if (isPlainObject(arg) || isArray(arg)) {
        str = formato({colors: false}, arg)
    } else if (type === 'buffer') {
        str = `${type}(${arg.length})`
    } else if (arg && arg.constructor && arg.constructor.name) {
        if (isClass(arg.constructor)) {
            str = `<<class ${arg.constructor.name}>()>`
        } else {
            str = `<${arg.constructor.name}()>`
        }
    } else if (isObject(arg)) {
        str = `<${type}()>`
    } else if (isString(arg)) {
        str = "'" + String(arg) + "'"
    } else {
        str = String(arg)
    }
    if (str.length > MaxArgDescLength) {
        str = str.substring(0, MaxArgDescLength - 3) + '...'
    }
    return str
}

function tojson(arg) {
    return JSON.stringify(arg, (key, value) => {
        if (isFunction(value)) {
            return value.name || '(function)'
        }
        if (isSymbol(value)) {
            return value.toString()
        }
        return value
    })
}

class MakeCasesError extends TestError {}