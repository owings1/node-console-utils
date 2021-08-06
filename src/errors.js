class BaseError extends Error {
    constructor(...args) {
        super(...args)
        this.name = this.constructor.name
    }
}

class ArgumentError extends BaseError {}

module.exports = {
    ArgumentError,
    BaseError,
}