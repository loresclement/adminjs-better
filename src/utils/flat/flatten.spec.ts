import { expect } from 'chai'

import { flatten, unflatten } from './flatten.js'

describe('module:flat', () => {
  describe('flatten', () => {
    it('flattens nested objects and arrays while preserving empty values and dates', () => {
      const date = new Date('2024-01-01T00:00:00.000Z')

      expect(flatten({
        user: { name: 'Ada' },
        items: ['one', { name: 'two' }],
        emptyObject: {},
        emptyArray: [],
        date,
      })).to.deep.equal({
        'user.name': 'Ada',
        'items.0': 'one',
        'items.1.name': 'two',
        emptyObject: {},
        emptyArray: [],
        date,
      })
    })

    it('supports safe arrays, custom delimiters, and maximum depth', () => {
      expect(flatten({ items: ['one', 'two'] }, { safe: true })).to.deep.equal({
        items: ['one', 'two'],
      })
      expect(flatten({ user: { name: 'Ada' } }, { delimiter: '~~' })).to.deep.equal({
        'user~~name': 'Ada',
      })
      expect(flatten({ user: { address: { city: 'London' } } }, { maxDepth: 1 })).to.deep.equal({
        user: { address: { city: 'London' } },
      })
    })
  })

  describe('unflatten', () => {
    it('rebuilds nested objects and arrays', () => {
      expect(unflatten({
        'user.name': 'Ada',
        'items.0': 'one',
        'items.1.name': 'two',
        emptyObject: {},
        emptyArray: [],
      })).to.deep.equal({
        user: { name: 'Ada' },
        items: ['one', { name: 'two' }],
        emptyObject: {},
        emptyArray: [],
      })
    })

    it('supports custom delimiters, object keys, and non-overwriting conflicts', () => {
      expect(unflatten({ 'user~~name': 'Ada' }, { delimiter: '~~' })).to.deep.equal({
        user: { name: 'Ada' },
      })
      expect(unflatten({ 'items.0': 'one' }, { object: true })).to.deep.equal({
        items: { 0: 'one' },
      })
      expect(unflatten({ user: 'Ada', 'user.name': 'Grace' })).to.deep.equal({ user: 'Ada' })
    })

    it('does not create prototype properties', () => {
      const result = unflatten({ '__proto__.polluted': true })

      expect(({} as { polluted?: boolean }).polluted).to.be.undefined
      expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).to.be.false
    })
  })
})
