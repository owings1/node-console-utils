
```javascript
function update(target, source) {
    target = target || {}
    source = source || {}
    /*

    Using Object.keys differs if there is a getter in the source
    that refers to the target.

        Object.keys(source).forEach(key => {
            target[key] = source[key]
        })

    For example:

        let target = {}
        let source = {a: 1, get x() { return target.a }}
        update(target, source)

    With keys: {a: 1, x: 1}
    With entries: {a: 1, x: undefined}

    But with keys the result could be surprising to some users:

        let target = {}
        let source = {a: 1, get [9]() { return target.a }}

    With keys: {'9': undefined, a: 1}
    */
    objects.entries(source).forEach(([key, value]) => {
        target[key] = value
    })
    return target
}
````