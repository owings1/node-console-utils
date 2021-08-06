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


module.exports = {arrayHash, arraySum, arrayUnique}