const assert = require('assert')
const chproc = require('child_process')
const path = {resolve} = require('path')
const fs = require('fs')
const vm = require('vm')

const baseDir = resolve(__dirname, '../..')
const targetfile = resolve(baseDir, 'src/lib/emoji-regex.js')
const targetdir = path.dirname(targetfile)
const noticefile = resolve(baseDir, 'NOTICE.md')
const template = fs.readFileSync(resolve(baseDir, 'test/templates/emoji-regex.template'), 'utf-8')
const pkgname = 'emoji-regex'

const log = console

log.info('getting package info')
const {
    'dist-tags': {latest: version},
    main: mainfile,
    repository: {url: pkgrepo}
} = JSON.parse(exec('npm', ['info', pkgname, '--json']))

const repo = pkgrepo.replace(/^git\+/, '').replace(/\.git$/, '')
const blobs = repo.replace('://github.com', '://raw.githubusercontent.com')

log.info('getting sha from git')
const sha = getSha(repo, version)
log.info({sha})

const srcurl = [repo, 'blob', sha.substr(0, 8), mainfile].join('/')
const bloburl = [blobs, sha, mainfile].join('/')

log.info('retrieving blob', {url: bloburl})
const blob = exec('curl', [bloburl])

log.info('extracting regex')
const {source, flags} = gexport(blob)()

log.info('generating regex')
const res = greturn("'" + source + "'")
const exp = new RegExp(res, flags)
const arr = []
for (let i = 0, j = 80; i < res.length; i += j) {
    arr.push(res.substr(i, j))
}

log.info('checking regex')
assert(arr.join('') === res)

log.info('rendering source content')
const rendered = template
    .replace('<version/>', version)
    .replace('<srcurl/>', srcurl)
    .replace('<flags/>', JSON.stringify(flags))
    .replace('<arr/>', JSON.stringify(arr, null, 4))

log.info('verifying source')
const actual = gexport(rendered)
assert(actual.source === exp.source)
assert(actual.flags === exp.flags)

log.info('sanity check')
assert(actual.test('\u{1F1FA}\u{1F1F8}'))

if (!fs.existsSync(targetdir)) {
    log.info('Creating dir', path.relative(baseDir, targetdir))
    fs.mkdirSync(targetdir, {recursive: true})
}
log.info('writing', {file: path.relative(baseDir, targetfile)})
fs.writeFileSync(targetfile, rendered)

log.info('updating notice', {url: srcurl})
const noticecont = fs.readFileSync(noticefile, 'utf-8').replace(
    /(<!--ersrc.*)\(http.*\)(.*endersrc-->)/,
    `$1(${srcurl})$2`,
)
fs.writeFileSync(noticefile, noticecont)

log.info('done')

function getSha(repoUrl, version) {
    const args = ['ls-remote', '-t', repoUrl, 'v' + version + '^{}']
    const out = exec('git', args)
    const [sha] = out.trim().split(/\s/)
    if (sha.length !== 40) {
        logger.warn({sha}, 'stdout:\n' + stdout)
        throw new Error('cannot parse sha')
    }
    return sha
}

function gexport(content) {
    const c = {module: {}}
    new vm.Script(content).runInContext(vm.createContext(c))
    return c.module.exports
}

function greturn(content) {
    return new vm.Script(content).runInContext(vm.createContext({}))
}

function exec(cmd, args, opts = {}) {
    log.info(cmd, ...args)
    const {stdout, stderr, error, status} = chproc.spawnSync(cmd, args)
    if (error) {
        throw error
    }
    if (status !== 0) {
        console.error('stderr:\n' + stderr.toString('utf-8'))
        throw new Error(`${cmd} exit: ${status}`)
    }
    return stdout.toString('utf-8')
}