/**
 * Copyright (C) 2021 Doug Owings
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
 * Contains code copied and modified from mochajs
 *
 * - https://mochajs.org/
 * - https://github.com/mochajs/mocha/blob/e044ef02/lib/reporters/base.js
 *
 * Methods parseStack() and getRawMessage()
 *
 * The mochajs license is as follows:
 * ----------------------------------
 *
 * (The MIT License)
 * 
 * Copyright (c) 2011-2021 OpenJS Foundation and contributors, https://openjsf.org
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const {Is} = require('./types.js')

/**
 * Adapted from:
 *
 *   https://github.com/mochajs/mocha/blob/e044ef02/lib/reporters/base.js#L223
 *
 * Get normalized message and stack info for an error.
 *
 * @param {Error} The error to parse
 * @return {object} Strings {stack, message, rawMessage}
 */
function parseStack(err) {

    // Normalize raw error message.
    const rawMessage = getRawMessage(err)

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
}

/**
 * Adapted from:
 *
 *   https://github.com/mochajs/mocha/blob/e044ef02/lib/reporters/base.js#L245
 *
 * Normalize raw error message.
 *
 * @param {Error} The error to examine
 * @return {string} The normalized message
 */
function getRawMessage(err) {
    let raw = ''
    if (Is.Function(err.inspect)) {
        raw += err.inspect()
    } else if (err.message && Is.Function(err.message.toString)) {
        raw += err.message
    }
    return raw
}

module.exports = {getRawMessage, parseStack}