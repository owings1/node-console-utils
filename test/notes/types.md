## types

Some observations about different approaches to `isPlainObject` from 

```javascript
/**
 * Portions from:
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 * https://github.com/jonschlinkert/is-plain-object/blob/0a47f0f6/is-plain-object.js
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 *
 * Portions from:
 * lodash <https://github.com/lodash/lodash>
 * https://github.com/lodash/lodash/blob/2da024c3/isPlainObject.js
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Release under the MIT License.
 *
 * See file NOTICE.md for details and full licenses.
 */
function isPlainObject(o) {
    /* begin is-plain-object code: */
    let ctor
    let proto
    if (is.object(o) === false) {
        return false
    }
    // If has modified constructor
    ctor = o.constructor
    if (ctor === undefined) {
        return true
    }
    /* end is-plain-object code: */

    /* The is-plain-object code continues similarly:

        // If has modified prototype
        proto = ctor.prototype
        if (is.Object(prot) === false) {
            return false
        }
        // If constructor does not have an Object-specific method
        if (prot.hasOwnProperty('isPrototypeOf') === false) {
            return false
        }
        // Most likely a plain Object
        return true

    However, this returns false:

        var o = { constructor: function(){} }
        isPlainObject(o) // false!

    The lodash code does its initial object check, then proceeds as follows: */

    /* begin lodash code */
    proto = o
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }
    return Object.getPrototypeOf(o) === proto
    /* end lodash code */
}
```

------------------

Some functions copied from another project, to be possibly implemented, if needed:

```javascript
/**
 * Induce a boolean value.
 *
 * @param {*} The value to examine
 * @param {boolean} (optional) The default value
 * @return {boolean} The induced value
 */
function induceBool(value, def = false) {
    if (typeof value === 'boolean') {
        return value
    }
    if (value != null) {
        value = String(value).toLowerCase()
        if (def) {
            // Default is true, so check for explicit false.
            return ['0', 'false', 'no', 'n', 'off'].includes(value)
        }
        // Default is false, so check for explicit true.
        return ['1', 'true', 'yes', 'y', 'on'].includes(value)
    }
    return Boolean(def)
}

/**
 * Induce an integer value.
 *
 * @param {*} The value to examine
 * @param {integer} (optional) The default value
 * @return {integer} The induced value
 */
function induceInt(value, def = 0) {
    if (Number.isInteger(value)) {
        return value
    }
    if (!Number.isInteger(def)) {
        def = 0
    }
    if (value != null) {
        return parseInt(value) || def
    }
    return def
}
```