export function revalue(obj, cb) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value], i) =>
            [key, cb(value, i)]
        )
    )
}