/**
 * @quale/util - code point utils
 *
 * Copyright (C) 2021 Doug Owings
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
 * isFullwidthCodePoint copied from is-fullwidth-code-point:
 * - https://www.npmjs.com/package/is-fullwidth-code-point
 * - https://github.com/sindresorhus/is-fullwidth-code-point/blob/27f57288/index.js
 * ----------------------
 * isCombiningCodePoint, isControlCodePoint, and isSurrogateCodePoint extracted
 * from string-width:
 * - https://www.npmjs.com/package/string-width
 * - https://github.com/sindresorhus/string-width
 * ----------------------
 * MIT License
 * 
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * ----------------------
 * See file NOTICE.md for full license details.
 * ----------------------
 */
const codes = {

    /**
     * See: https://www.fileformat.info/info/unicode/category/Zs/list.htm
     */
    isBreakingSpace: function isBreakingSpaceCodePoint(cp) {
        return Number.isInteger(cp) && (
            // space
            cp === 0x20 ||
            // ogham space mark
            cp === 0x1680 ||
            // 0x2000: en quad
            // 0x2001: em quad
            // 0x2002: en space
            // 0x2003: em space
            // 0x2004: three-per-em space
            // 0x2005: four-per-em space
            // 0x2006: fix-per-em space
            // 0x2007: figure space
            // 0x2008: punctuation space
            // 0x2009: thin space
            // 0x200A: hair space
            (0x2000 <= cp && cp <= 0x200A) ||
            // medium mathematical space
            cp === 0x205F ||
            // ideographic space (full-width)
            cp === 0x3000
        )
    },

    /**
     * Diacritics are always added after the main character.
     * Code extracted from string-width, (C) Sindre Sorhus, MIT License.
     */
    isCombining: function isCombiningCodePoint(cp) {
        return Number.isInteger(cp) && cp >= 0x300 && cp <= 0x36F
    },

    /**
     * Control codes are not visually represented.
     * Code extracted from string-width, (C) Sindre Sorhus, MIT License.
     */
    isControl: function isControlCodePoint(cp) {
        return Number.isInteger(cp) && (cp <= 0x1F || (cp >= 0x7F && cp <= 0x9F))
    },

    /**
     * See: https://www.fileformat.info/info/unicode/category/Zs/list.htm
     */
    isNonBreakingSpace: function isNonBreakingSpaceCodePoint(cp) {
        return Number.isInteger(cp) && (
            // no-break space
            cp === 0xA0 ||
            // narrow no-break space
            cp === 0x202F
        )
    },

    /**
     * See: https://www.fileformat.info/info/unicode/category/Zs/list.htm
     */
    isSpace: function isSpaceCodePoint(cp) {
        return codes.isNonBreakingSpace(cp) || codes.isBreakingSpace(cp)
    },

    /**
     * Surrogates come in pairs, e.g. emojis.
     * Code extracted from string-width, (C) Sindre Sorhus, MIT License.
     */
    isSurrogate: function isSurrogateCodePoint(cp) {
        return Number.isInteger(cp) && cp > 0xFFFF
    },

    /**
     * from is-fullwidth-code-point:
     * - https://www.npmjs.com/package/is-fullwidth-code-point
     * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
     * MIT License
     * ------------
     * Code points are derived from:
     * https://unicode.org/Public/UNIDATA/EastAsianWidth.txt
     */
    isFullwidth: function isFullwidthCodePoint(cp) {
        return Number.isInteger(cp) && cp >= 0x1100 && (
            cp <= 0x115F || // Hangul Jamo
            cp === 0x2329 || // LEFT-POINTING ANGLE BRACKET
            cp === 0x232A || // RIGHT-POINTING ANGLE BRACKET
            // CJK Radicals Supplement .. Enclosed CJK Letters and Months
            (0x2E80 <= cp && cp <= 0x3247 && cp !== 0x303F) ||
            // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
            (0x3250 <= cp && cp <= 0x4DBF) ||
            // CJK Unified Ideographs .. Yi Radicals
            (0x4E00 <= cp && cp <= 0xA4C6) ||
            // Hangul Jamo Extended-A
            (0xA960 <= cp && cp <= 0xA97C) ||
            // Hangul Syllables
            (0xAC00 <= cp && cp <= 0xD7A3) ||
            // CJK Compatibility Ideographs
            (0xF900 <= cp && cp <= 0xFAFF) ||
            // Vertical Forms
            (0xFE10 <= cp && cp <= 0xFE19) ||
            // CJK Compatibility Forms .. Small Form Variants
            (0xFE30 <= cp && cp <= 0xFE6B) ||
            // Halfwidth and Fullwidth Forms
            (0xFF01 <= cp && cp <= 0xFF60) ||
            (0xFFE0 <= cp && cp <= 0xFFE6) ||
            // Kana Supplement
            (0x1B000 <= cp && cp <= 0x1B001) ||
            // Enclosed Ideographic Supplement
            (0x1F200 <= cp && cp <= 0x1F251) ||
            // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
            (0x20000 <= cp && cp <= 0x3FFFD)
        )
    },

    /**
     * See: https://unicode.org/reports/tr29/
     */
    isWordBreaking: function isWordBreakingCodePoint(cp) {
        return (
            codes.isBreakingSpace(cp) ||
            codes.isBreakingDash(cp)
        )
    },

    /**
     * See: https://www.compart.com/en/unicode/category/Pd
     */
    isBreakingDash: function isBreakingDashCodePoint(cp) {
        return Number.isInteger(cp) && (
            // hyphen-minus
            cp === 0x2D ||
            // Argumenian hyphen
            cp === 0x58A ||
            // Hebrew punctuation maqaf
            cp === 0x5BE ||
            // Canadian syllabics hyphen
            cp === 0x1400 ||
            // Mongolian todo soft hyphen
            cp === 0x1806 ||
            (0x2010 <= cp && cp <= 0x30A0 && (
                // hyphen
                cp === 0x2010 ||
                // 0x2012: figure dash
                // 0x2013: en dash
                // 0x2014: em dash
                // 0x2015: horizontal bar
                (0x2012 <= cp && cp <= 0x2015) ||
                // double oblique hyphen
                cp === 0x2E17 ||
                // hyphen with diaeresis
                cp === 0x2E1A ||
                // two-em dash
                cp === 0x2E3A ||
                // three-em dash
                cp === 0x2E3B ||
                // double hyphen
                cp === 0x2E40 ||
                // wave dash
                cp === 0x301C ||
                // wavy dash
                cp === 0x3030 ||
                // Katakana-Hiragana double hyphen
                cp === 0x30A0
            )) ||
            (0xFE31 <= cp && cp <= 0xFF0D && (
                // presentation form for vertical em dash
                cp === 0xFE31 ||
                // presentation form for vertical en dash
                cp === 0xFE32 ||
                // small em dash
                cp === 0xFE58 ||
                // small hyphen-minus
                cp === 0xFE63 ||
                // fullwidth hyphen-minus
                cp === 0xFF0D
            )) ||
            // Yezidi hyphenation mark
            cp === 0x10EAD
        )
    },
}

module.exports = {
    ...codes,
    ...namedf(codes),
}

function namedf(obj) {
    return Object.fromEntries(
        Object.values(obj).map(f => [f.name, f])
    )
}