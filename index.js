const pkg = module.exports = {
    // classes
    get Errors()    { return require('./src/classes/errors.js'     )},
    get HashProxy() { return require('./src/classes/hash-proxy.js' )},
    get Logger()    { return require('./src/classes/logger.js'     )},
    get Screen()    { return require('./src/classes/screen.js'     )},
    // utils
    get ansi()    { return require('./src/ansi.js'    )},
    get arrays()  { return require('./src/arrays.js'  )},
    get buffers() { return require('./src/buffers.js' )},
    get chars()   { return require('./src/chars.js'   )},
    get classes() { return require('./src/classes.js' )},
    get codes()   { return require('./src/codes.js'   )},
    get colors()  { return require('./src/colors.js'  )},
    get errors()  { return require('./src/errors.js'  )},
    get merging() { return require('./src/merging.js' )},
    get objects() { return require('./src/objects.js' )},
    get regexes() { return require('./src/regexes.js' )},
    get strings() { return require('./src/strings.js' )},
    get types()   { return require('./src/types.js'   )},
    // shortcuts
    get Cast()   { return pkg.types.Cast    },
    get Is()     { return pkg.types.Is      },
    get typeOf() { return pkg.types.typeOf  },
    get merge()  { return pkg.merging.merge },
}