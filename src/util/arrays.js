/**
 * Append all values to an array.
 *
 * @throws {TypeError}
 * @param {array} The array to push to
 * @param {array} The values to push
 * @return {array} The input array
 */
function append(arr, values) {
    values.forEach(value => arr.push(value))
    return arr
}

function arrayHash(...args) {
    return Object.fromEntries(
        args.map(Object.values).flat().map(value =>
            [value, true]
        )
    )
}

/**
 * Sum all numbers in the array.
 *
 * @throws {TypeError}
 *
 * @param {array} The input array
 * @return {integer} The result sum
 */
function arraySum(arr) {
    return arr.reduce((acc, cur) => acc + cur, 0)
}

function arrayUnique(...arrs) {
    return Object.keys(arrayHash(...arrs))
}


module.exports = {append, arrayHash, arraySum, arrayUnique}