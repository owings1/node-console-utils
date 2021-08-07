const {expect} = require('chai')
const {ger, TestError} = require('./errors.js')
const {Cast: {toArray}, Is, objects: {lget}} = require('../../index.js')

function makeCases(...args) {

    const cases = toArray(args.pop())
    let opt = args[0]

    if (Is.Function(opt)) {
        opt = {run: opt}
    }

    cases.forEach((opts_, i) => {
        const n = i + 1
        const opts = normOpts({...opt, ...opts_})
        if (!Is.Function(opts.run)) {
            console.error('case:', n, 'opts:', opts)
            throw new MakeCasesError('Must provide a run function.')
        }
        const desc = getDescription(opts)
        const {run, args, oper, exp, err, debug} = opts
        const that = it[['only', 'skip'].find(o => opts[o])] || it
        that.call(that, desc, function () {
            let result
            try {
                if (err) {
                    result = ger(() => run.apply(this, args))
                } else {
                    result = run.apply(this, args)
                }
            } finally {
                if (debug) {
                    console.log('case number:', n, 'of', cases.length)
                    console.log('opts (spec):', opts_)
                    console.log('opts (norm):', opts)
                    console.log({result})
                }
            }
            const should = expect(result)
            lget(should, oper).apply(should, exp)
        })
    })
}
module.exports = {makeCases, cases: makeCases}

function normOpts(opts) {
    opts = {...opts}
    opts.args = toArray(opts.args)
    if (opts.err) {
        if (!opts.exp) {
            opts.exp = opts.err
        }
    }
    opts.exp = toArray(opts.exp)
    if (!opts.oper) {
        if (opts.err) {
            opts.oper = 'erri'
        } else {
            opts.oper = 'equal'
        }
    }
    if (Is.String(opts.oper)) {
        opts.oper = opts.oper.split('.')
    }
    opts.oper = toArray(opts.oper)
    return opts
}

function getDescription(opts) {
    if (opts.desc) {
        return opts.desc
    }
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
    if (Is.Function(arg)) {
        return arg.name
    }
    let str = String(arg)
    return Is.String(arg) ? `'${str}'` : str
}

class MakeCasesError extends TestError {}