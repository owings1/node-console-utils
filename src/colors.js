const Chalk = require('./classes/chalk.js')
const {level: DefaultLevel} = require('chalk')
const chalkPipe = require('chalk-pipe')

const colors = {
    Chalk,
    chalk: new Chalk,
}

Object.defineProperty(colors, 'DefaultLevel', {
    value      : DefaultLevel,
    enumerable : true,
    writable   : false,
})
Object.defineProperty(colors, 'DefaultColorLevel', {
    get        : () => colors.DefaultLevel,
    enumerable : true,
})
module.exports = {
    ...colors,
    ...namedf(colors),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}