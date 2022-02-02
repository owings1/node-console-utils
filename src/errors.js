/**
 * Copyright (C) 2021-2022 Doug Owings
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Contains code copied and modified from *mochajs*:
 * - https://mochajs.org/
 * - https://github.com/mochajs/mocha/blob/e044ef02/lib/reporters/base.js
 * Methods `parseStack()` and `getRawMessage()`
 * --------------------------------------------
 * MIT License
 * Copyright (c) 2011-2021 OpenJS Foundation and contributors, https://openjsf.org
 * -------------------------------------------------------------------------------
 * See file NOTICE.md for details and full license.
 * ------------------------------------------------
 */
const {isFunction} = require('./types.js')

const errors = {

    /**
     * Normalize raw error message. Adapted from:
     * https://github.com/mochajs/mocha/blob/e044ef02/lib/reporters/base.js#L245
     *
     * @throws {TypeError}
     *
     * @param {Error} err The error to examine
     * @return {string} The normalized message
     */
    getRawMessage: function getRawErrorMessage(err) {
        if (isFunction(err.inspect)) {
            return err.inspect()
        }
        if (err.message && isFunction(err.message.toString)) {
            return err.message.toString()
        }
        return ''
    },

    /**
     * Get normalized message and stack info for an error. Adapted from:
     * https://github.com/mochajs/mocha/blob/e044ef02/lib/reporters/base.js#L223
     *
     * @throws {TypeError}
     *
     * @param {Error} The error to parse
     * @return {object} Strings {stack, message, rawMessage}
     */
    parseStack: function parseStack(err) {
        // Normalize raw error message.
        const rawMessage = errors.getRawMessage(err)
        let message = ''
        let stack = err.stack || rawMessage
        if (rawMessage) {
            // Check if the stack contains the rawMessage.
            const rawStart = stack.indexOf(rawMessage)
            if (rawStart > -1) {
                // Add everything from the start of the stack until the end
                // of the the raw message to errMessage, which will
                // typically include the error name at the beginning.
                const rawEnd = rawStart + rawMessage.length
                message += stack.slice(0, rawEnd)
                // Remove everything up to the raw message, and the following
                // newline character from the stack.
                stack = stack.slice(rawEnd + 1)
            }
        }
        return {stack, message, rawMessage}
    },
}

module.exports = {
    ...errors,
    ...namedf(errors),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}