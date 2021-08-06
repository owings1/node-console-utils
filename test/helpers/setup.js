import chai from 'chai'

// see https://www.chaijs.com/guide/helpers/ 
chai.Assertion.addMethod('erri', function (type) {
    var obj = this._obj
    // preconditon, whether positive or negative assertion
    new chai.Assertion(this._obj).to.be.instanceof(Error)

    var name = type + 'Error'
    var isprop = 'is' + name

    this.assert(
        obj.name === name || obj[isprop] === true,
        "expected #{this} to be a #{exp} but got #{act}",
        "expected #{this} to not be a #{act}",
        name,        // expected,
        obj.name,  // actual,
    )
})