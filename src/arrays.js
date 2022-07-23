/**
 * @quale/core - array utils
 *
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
 * @param {*} arg
 * @param {String} name
 * @return {Array}
 */
function checkArray(arg, name = 'arr') {
    if (!Array.isArray(arg)) {
        throw new TypeError(`Argument (${name}) not an array`)
    }
    return arg
}

/**
 * Append all values to an array.
 *
 * @throws {TypeError}
 *
 * @param {Array} arr The array to push to
 * @param {Array} values The values to push
 * @return {Array} The input array
 */
export function append(arr, values) {
    checkArray(arr)
    values.forEach(value => arr.push(value))
    return arr
}

/**
 * Bisect an array into two arrays. If `filter(value, key, arr)` returns 
 * falsy, the value is placed in the first array.
 * 
 * @throws {TypeError}
 * 
 * @param {Array} arr The array to bisect
 * @param {filter} function The filter function.
 * @return {array[]} An array of two arrays
 */
export function bisect(arr, filter) {
    const result = [[], []]
    checkArray(arr).forEach((value, ...eargs) => {
        result[Number(Boolean(filter(value, ...eargs)))].push(value)
    })
    return result
}

/**
 * Get the last element of an array.
 *
 * @throws {TypeError}
 *
 * @param {Array} arr The array
 * @return {*} The last element or undefined.
 */
export function last(arr) {
    return checkArray(arr)[arr.length - 1]
}

/**
 * Sum all numbers in the array.
 *
 * @throws {TypeError}
 *
 * @param {number[]} arr The input array
 * @return {number} The result sum
 */
export function sum(arr) {
    return checkArray(arr).reduce((acc, cur) => acc + cur, 0)
}

/**
 * Find the closest index and value of `target` in `arr`.
 * 
 * @param {Number} target The search value.
 * @param {Number[]} arr The array to search.
 * @return {object|undefined} Object with `index` and `value` properties, or
 *  undefined if array is empty.
 */
export function closest(target, arr) {
    const {length} = arr
    if (length === 0) {
        return
    }
    if (length === 1) {
        return {index: 0, value: arr[0]}
    }
    target = Number(target)
    let minDiff = Infinity
    let low = 0
    let high = length - 1
    let index
    while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        let diffLeft
        let diffRight
        if (mid + 1 < length) {
            diffRight = Math.abs(arr[mid + 1] - target)
        }
        if (mid > 0) {
            diffLeft = Math.abs(arr[mid - 1] - target)
        }
        if (diffLeft !== undefined && diffLeft < minDiff) {
            minDiff = diffLeft
            index = mid - 1
        }
        if (diffRight !== undefined && diffRight < minDiff) {
            minDiff = diffRight
            index = mid + 1
        }
        if (arr[mid] < target) {
            low = mid + 1
        } else if (arr[mid] > target) {
            high = mid - 1
        } else {
            index = mid
            break
        }
    }
    return {index, value: arr[index]}
}

/**
 * Shuffle an array.
 * 
 * @param {Array} arr The array.
 * @return {Array} The array.
 */
export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    return arr
}