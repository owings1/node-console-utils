const arrays = {
    /**
     * Append all values to an array.
     *
     * @throws {TypeError}
     * @param {array} The array to push to
     * @param {array} The values to push
     * @return {array} The input array
     */
    append: function arrayAppend(arr, values) {
        values.forEach(value => arr.push(value))
        return arr
    },

   /**
    * Sum all numbers in the array.
    *
    * @throws {TypeError}
    *
    * @param {array} The input array
    * @return {integer} The result sum
    */
   sum: function arraySum(arr) {
       return arr.reduce((acc, cur) => acc + cur, 0)
   },

   unique: function arrayUnique(...arrs) {
       return Object.keys(
           Object.fromEntries(
               args.map(Object.values).flat().map(value =>
                   [value, true]
               )
           )
       )
   },
}

module.exports = {
    ...arrays,
    ...namedf(arrays),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(arrays).map(f => [f.name, f])
    )
}