const {
    Logger,
    objects : {lset, revalue},
    strings : {endsWith},
    types   : {isFunction, isObject, isString, typeOf},
} = require('../../index.js')

const fs = require('fs')
const path = {resolve, relative, basename} = require('path')
const BaseDir = resolve(__dirname, '../..')
const abspath = (...args) => resolve(BaseDir, ...args)
const relpath = (...args) => relative(BaseDir, ...args)
const srcDir = abspath('src')
const specsDir = abspath('test/specs')
const templateFile = abspath('test/templates/spec.template')

const logger = new Logger

function render(template, vars) {
    Object.entries(vars).forEach(([name, value]) => {
        template = template.replace(new RegExp(`</${name}>`, 'g'), value)
    })
    return template
}

function specOpen (name, value) {
    let prefix = ''
    if (isString(value)) {
        if (value === 'function') {
            prefix = '#'
        }
    }
    return `describe('${prefix}${name}', () => {`
}

function createUtilsSpecs() {
    const template = fs.readFileSync(templateFile, 'utf-8')
    const bnames = fs.readdirSync(srcDir)
    bnames.forEach(bname => {
        if (!endsWith(bname, '.js')) {
            logger.info('Skipping', bname)
            return
        }
        const name = bname.split('.').slice(0, -1).join('-')
        const specFile = resolve(specsDir, name + '.test.js')
        const srcFile = resolve(srcDir, bname)
        const srcRel = relpath(srcFile)
        const specRel = relpath(specFile)
        if (fs.existsSync(specFile)) {
            logger.info('Spec exists for', logger.chalk.green(name), {file: specRel})
            return
        }
        logger.info('Creating spec for', logger.chalk.yellow(name), {file: specRel})
        const mod = require(srcFile)
        const rootOrder = revalue(mod, (v, i) => i)
        const nameHash = Object.create(null)
        let spec = {}
        let count = 0
        function addSpec(obj, keyPath = []) {
            Object.entries(obj)
                .sort((a, b) => a[0].length - b[0].length)
                .forEach(([key, value]) => {
                const thisPath = keyPath.concat([key])
                if (isObject(value)) {
                    addSpec(value, thisPath)
                    return
                }
                const name = isFunction(value) ? value.name : key
                const type = typeOf(value)
                if (nameHash[name]) {
                    logger.info('Skipping duplicate', {type, name})
                    return
                }
                nameHash[name] = type
                lset(spec, thisPath, type)
                count += 1
            })
        }
        addSpec(mod)
        spec = Object.fromEntries(
            Object.entries(spec).sort((a, b) => rootOrder[a[0]] - rootOrder[b[0]])
        )
        const lines = []
        const tab = 4
        const spaces = indent => ''.padEnd(indent * tab, ' ')
        function addContent(obj, namePath) {
            let indent = namePath.length
            Object.entries(obj).forEach(([name, value], i) => {
                if (i > 0) {
                    lines.push('')
                }
                const thisPath = namePath.concat([name])
                lines.push(spaces(indent) + specOpen(name, value))
                lines.push('')
                if (isString(value)) {
                    let tstr
                    if (value === 'function') {
                        const pstr = thisPath.join('.')
                        tstr = `defs(${pstr}, {}).build[{skip: true, desc: 'TODO...'}])`
                    } else {
                        tstr = `it('TODO...')`
                    }
                    lines.push(spaces(indent + 1) + tstr)
                } else if (isObject(value)) {
                    addContent(value, thisPath)
                } else {
                    logger.warn('Cannot render spec for', {name, type: typeOf(value)})
                }
                lines.push(spaces(indent) + '})')
            })
        }
        addContent(spec, [name])
        const specContent = lines.join('\n')
        const content = render(template, {name, specContent})
        fs.writeFileSync(specFile, content)
        logger.info('Wrote file with', count, 'specs')
    })
}

function main() {
    createUtilsSpecs()
}

if (require.main === module) {
    main()
}