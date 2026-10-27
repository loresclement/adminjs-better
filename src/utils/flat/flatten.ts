/*
 * Derived from flat (https://github.com/hughsk/flat), Copyright (c) 2014 Hugh Kennedy.
 * Licensed under the BSD 3-Clause license:
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of
 *    conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to
 *    endorse or promote products derived from this software without specific prior written
 *    permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 * WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

export interface FlattenOptions {
  delimiter?: string;
  maxDepth?: number;
  safe?: boolean;
  transformKey?: (key: string) => string;
}

export interface UnflattenOptions {
  delimiter?: string;
  object?: boolean;
  overwrite?: boolean;
  transformKey?: (key: string) => string;
}

const isBuffer = (value: any): boolean => (
  value
  && value.constructor
  && typeof value.constructor.isBuffer === 'function'
  && value.constructor.isBuffer(value)
)

const identity = (key: string): string => key

export function flatten<T = any, R = any>(target: T, options?: FlattenOptions): R {
  const opts = options || {}
  const delimiter = opts.delimiter || '.'
  const transformKey = opts.transformKey || identity
  const output: Record<string, any> = {}

  const step = (object: any, previousKey = '', currentDepth = 1): void => {
    Object.keys(object).forEach((key) => {
      const value = object[key]
      const isArray = opts.safe && Array.isArray(value)
      const type = Object.prototype.toString.call(value)
      const isObject = type === '[object Object]' || type === '[object Array]'
      const newKey = previousKey
        ? `${previousKey}${delimiter}${transformKey(key)}`
        : transformKey(key)

      if (!isArray
        && !isBuffer(value)
        && isObject
        && Object.keys(value).length
        && (!opts.maxDepth || currentDepth < opts.maxDepth)) {
        step(value, newKey, currentDepth + 1)
      } else {
        output[newKey] = value
      }
    })
  }

  step(target)
  return output as R
}

export function unflatten<T = any, R = any>(target: T, options?: UnflattenOptions): R {
  const opts = options || {}
  const delimiter = opts.delimiter || '.'
  const overwrite = opts.overwrite || false
  const transformKey = opts.transformKey || identity
  const result: Record<string, any> = {}
  const input: any = target

  if (isBuffer(input) || Object.prototype.toString.call(input) !== '[object Object]') {
    return input
  }

  const getKey = (key: string): string | number => {
    const parsedKey = Number(key)
    return Number.isNaN(parsedKey) || key.includes('.') || opts.object ? key : parsedKey
  }

  const addKeys = (
    keyPrefix: string,
    recipient: Record<string, any>,
    object: Record<string, any>,
  ): Record<string, any> => Object.keys(object).reduce((memo, key) => {
    memo[`${keyPrefix}${delimiter}${key}`] = object[key]
    return memo
  }, recipient)

  const isEmpty = (value: any): boolean => {
    const type = Object.prototype.toString.call(value)
    if (!value) return true
    if (type === '[object Array]') return !value.length
    if (type === '[object Object]') return !Object.keys(value).length
    return false
  }

  const flattenedTarget = Object.keys(input).reduce((memo, key) => {
    const value = input[key]
    const type = Object.prototype.toString.call(value)
    const isObject = type === '[object Object]' || type === '[object Array]'
    if (!isObject || isEmpty(value)) {
      memo[key] = value
      return memo
    }
    return addKeys(key, memo, flatten(value, opts))
  }, {} as Record<string, any>)

  Object.keys(flattenedTarget).forEach((key) => {
    const split = key.split(delimiter).map(transformKey)
    let key1 = getKey(split.shift() as string)
    let key2 = getKey(split[0])
    let recipient = result

    while (key2 !== undefined) {
      if (key1 === '__proto__') return

      const type = Object.prototype.toString.call(recipient[key1])
      const isObject = type === '[object Object]' || type === '[object Array]'

      if (!overwrite && !isObject && typeof recipient[key1] !== 'undefined') return

      if ((overwrite && !isObject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = typeof key2 === 'number' && !opts.object ? [] : {}
      }

      recipient = recipient[key1]
      if (split.length > 0) {
        key1 = getKey(split.shift() as string)
        key2 = getKey(split[0])
      }
    }

    recipient[key1] = unflatten(flattenedTarget[key], opts)
  })

  return result as R
}
