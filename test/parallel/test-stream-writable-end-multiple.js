'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const assert = require('assert')

const stream = require('../../lib/ours/index')

const writable = new stream.Writable()

writable._write = (chunk, encoding, cb) => {
  setTimeout(() => cb(), 10)
}

writable.end('testing ended state', common.mustCall())
writable.end(common.mustCall())
writable.on(
  'finish',
  common.mustCall(() => {
    let ticked = false
    writable.end(
      common.mustCall((err) => {
        assert.strictEqual(ticked, true)
        assert.strictEqual(err.code, 'ERR_STREAM_ALREADY_FINISHED')
      })
    )
    ticked = true
  })
)
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
