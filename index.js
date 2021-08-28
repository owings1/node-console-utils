const pkg = module.exports = {
    // classes
    get Errors()    { return require('./src/classes/errors.js'     )},
    get HashProxy() { return require('./src/classes/hash-proxy.js' )},
    get Screen()    { return require('./src/classes/screen.js'     )},
    // utils
    get ansi()    { return require('./src/ansi.js'    )},
    get arrays()  { return require('./src/arrays.js'  )},
    get buffers() { return require('./src/buffers.js' )},
    get classes() { return require('./src/classes.js' )},
    get codes()   { return require('./src/codes.js'   )},
    get errors()  { return require('./src/errors.js'  )},
    get objects() { return require('./src/objects.js' )},
    get regexes() { return require('./src/regexes.js' )},
    get strings() { return require('./src/strings.js' )},
    get types()   { return require('./src/types.js'   )},
}