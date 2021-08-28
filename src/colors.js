const Chalk = require('./classes/chalk.js')
const {level: DefaultLevel} = require('chalk')
const chalkPipe = require('chalk-pipe')

const colors = {
    Chalk,
    chalk: new Chalk,
}

Object.defineProperties(colors, {
    DefaultLevel: {
        enumerable : true,
        value: DefaultLevel,
    },
    DefaultColorLevel: {
        enumerable : true,
        get: () => colors.DefaultLevel,
    },
})

module.exports = colors