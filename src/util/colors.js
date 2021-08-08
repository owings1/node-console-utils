const {Instance: Chalk, level: DefaultColor} = require('chalk')
const chalkPipe = require('chalk-pipe')

const colors = {
    Chalk,
    chalk: new Chalk,
}

module.exports = {
    ...colors,
    ...namedf(colors),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}