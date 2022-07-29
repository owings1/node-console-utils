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
import {add} from './operators.js'

/**
 * Append all values to an array
 *
 * @param {Array} arr The array to push to
 * @param {Array} values The values to push
 * @return {Array} The input array
 */
export function extend(arr, values) {
    values.forEach(value => arr.push(value))
    return arr
}

/**
 * Bisect an array into two arrays according to a filter(value, index, arr)
 * If filter returns falsy, the value is placed in the first array.
 * 
 * If no filter is specified, the array is split in the middle, left-biased
 * for odd-lengthed arrays.
 * 
 * @param {Array} arr The array to bisect
 * @param {Function} filter The filter function
 * @return {array[]} An array of two arrays
 */
export function bisect(arr, filter) {
    filter = filter || defaultBisectFilter
    const result = [[], []]
    arr.forEach((value, i, arr) => {
        // @ts-ignore
        result[Number(Boolean(filter(value, i, arr)))].push(value)
    })
    return result
}

/**
 * Get the last element of an array
 *
 * @param {Array} arr The array
 * @return {*} The last element or undefined
 */
export function last(arr) {
    return arr[arr.length - 1]
}

/**
 * Normalize negative index to positive
 * 
 * @param {Array} arr The array
 * @param {Number} index The relative or absolute index
 * @return {Number} Normalized index
 */
export function absindex(arr, index) {
    if (index < 0) {
        return index + arr.length
    }
    return index
}

/**
 * Get at index, supports negative index
 * 
 * @param {Array} arr The array
 * @param {Number} index The index
 * @return {*}
 */
export function at(arr, index) {
    return arr[absindex(arr, index)]
}

/**
 * Sum all numbers in the array
 *
 * @param {Number[]} arr The input array
 * @return {Number} The result sum
 */
export function sum(arr) {
    return arr.reduce(add, 0)
}

/**
 * Find the closest value to `target` in a sorted array
 * 
 * @param {Number} target The search value
 * @param {Number[]} arr The array to search
 * @return {Number|undefined} The closest value or undefined if array is empty
 */
export function closest(target, arr) {
    const index = closestIndex(target, arr)
    if (index !== undefined) {
        return arr[index]
    }
}

/**
 * Find the index of the closest value to `target` in a sorted array
 * 
 * @param {Number} target The search value
 * @param {Number[]} arr The array to search
 * @return {Number|undefined} The closest index or undefined if array is empty
 */
export function closestIndex(target, arr) {
    const {length} = arr
    if (length === 0) {
        return
    }
    if (length === 1) {
        return 0
    }
    target = Number(target)
    let min = Infinity
    let low = 0
    let high = length - 1
    let index
    while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        if (mid + 1 < length) {
            let diff = Math.abs(arr[mid + 1] - target)
            if (diff < min) {
                min = diff
                index = mid + 1
            }
        }
        if (mid > 0) {
            let diff = Math.abs(arr[mid - 1] - target)
            if (diff < min) {
                min = diff
                index = mid - 1
            }
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
    return index
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

/**
 * @param {*} value
 * @param {Number} index
 * @param {Array} arr
 * @return {Boolean}
 */
function defaultBisectFilter(value, index, arr) {
    // bias left
    return index >= Math.ceil(arr.length / 2)
}