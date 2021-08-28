
### Spaces

See: https://www.fileformat.info/info/unicode/category/Zs/list.htm

These are counted in `isBreakingSpace()`:

```javascript
0x20 // space
0x1680 // ogham space mark
0x2000 // en quad
0x2001 // em quad
0x2002 // en space
0x2003 // em space
0x2004 // three-per-em space
0x2005 // four-per-em space
0x2006 // fix-per-em space
0x2007 // figure space
0x2008 // punctuation space
0x2009 // thin space
0x200A // hair space
0x205F // medium mathematical space
0x3000 // ideographic space (full-width)
```

These are counted in `isNonBreakingSpace()`:

```javascript
0xA0 // no-break space
0x202F // narrow no-break space
```