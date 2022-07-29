/**
 * @quale/core - functional operator abstractions
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
/**
 * Returns a + b
 */
export function add(a: number, b: number): number {
    return a + b
}

/**
 * Returns a - b
 */
export function sub(a: number, b: number): number {
    return a - b
}

/**
 * Returns a * b
 */
export function mul(a: number, b: number): number {
    return a * b
}

/**
 * Returns a / b
 */
export function div(a: number, b: number): number {
    return a / b
}

/**
 * Returns floor(a / b)
 */
export function floordiv(a: number, b: number): number {
    return Math.floor(a / b)
}

/**
 * Returns !a
 */
export function not(a: any): boolean {
    return !a
}
