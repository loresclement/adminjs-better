/* eslint-disable func-names */
/* eslint-disable mocha/no-top-level-hooks */
import { URLSearchParams } from 'url'

import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import jsdom from 'jsdom-global'

process.env.NODE_ENV = 'test'

use(sinonChai)

global.expect = expect
global.URLSearchParams = URLSearchParams

beforeEach(function () {
  this.sinon = sinon.createSandbox()
  this.jsdom = jsdom()
})

afterEach(function () {
  this.sinon.restore()
})
