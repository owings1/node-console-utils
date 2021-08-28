
## regexes

Base ANSI regex (global) from: https://github.com/chalk/ansi-regex/blob/c1b5e45f/index.js

```javascript
// Used for stripAnsi()
/[\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g
```

Other potentially useful versions derived from the above, currently not in use:

```javascript
// non-global, or "plain"
/[\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/


// Matches all consecutive sequences from the start of the string.
/^([\x1B\x9B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\x07)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~])))+/
```

Some other varietals for matching background sequences:

```javascript
// Matches all background open sequences.
/\x1B\[4[0-8]([0-9;]*m)?/g

// Matches all background close sequences.
/\x1B\[49m?/g

// Test whether a string is a background close sequence.
/^\x1B\[49m?/
```

Another ANSI regex:

```javascript
/^(\x1B([[0-9;]*m)?)+/
```