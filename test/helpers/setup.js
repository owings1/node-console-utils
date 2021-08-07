const {Assertion} = require('chai')
const idx = require('../../index.js')
// ensure all index exports are loaded
Object.values(idx)
// see https://www.chaijs.com/guide/helpers/ 
Assertion.addMethod('erri', function (type) {
    var obj = this._obj
    // preconditon, whether positive or negative assertion
    new Assertion(this._obj).to.be.instanceof(Error)

    var name = type
    // ends with
    if (name.length - name.lastIndexOf('Error') !== 'Error'.length) {
        name += 'Error'
    }
    var isprop = 'is' + name

    this.assert(
        obj.name === name || obj[isprop] === true,
        "expected #{this} to be a #{exp} but got #{act}",
        "expected #{this} to not be a #{act}",
        name,        // expected,
        obj.name,  // actual,
    )
})
