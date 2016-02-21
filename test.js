/* eslint-env mocha */

'use strict'

const assert = require('assert')
const stream = require('stream')
const packageJson = require('./package.json')
const mockData = require('./mock.json')
const cli = require('./index.js')
const it = require('mocha/lib/mocha.js').it
const describe = require('mocha/lib/mocha.js').describe

const helpOutput = `Usage:
  \tjspath <jspath> (file | [-])
  \tjspath -h | --help
  \tjspath --version

  Options:
  \t-h --help\tShow this message.
  \t--version\tShow version.
`

const versionOutput = `Version: ${packageJson.version}\n`

const validFile = 'mock.json'
const invalidFile = `someNoneExistentFile${Math.random()}.json`

const noJsPathError = 'No JSPath specified.\n'
const noFileOrStdinError = 'File or stdin needs to be specified.\n'
const fileError = `ENOENT: no such file or directory, open '${invalidFile}'\n`
const jsonError = 'JSON parse error: Unexpected token a\n'
const jsPathError = 'JSPath error: Unexpected token "€"\n'

function assertOutput (args, stdinContent, expectedStderr, expectedStdout, done) {
  let stdoutContent = ''
  let stderrContent = ''

  const stdin = new stream.Readable()
  stdin.readable = true
  stdin.destroy = () => {}
  stdinContent && stdin.push(stdinContent)
  stdin.push(null)
  const stdout = new stream.Writable({
    write: (chunk, encoding, next) => {
      stdoutContent += chunk.toString()
      next()
    }
  })
  const stderr = new stream.Writable({
    write: (chunk, encoding, next) => {
      stderrContent += chunk.toString()
      next()
    }
  })

  const process = {
    argv: ['', ''].concat(args),
    stdin,
    stdout,
    stderr,
    exit: () => {
      assert.equal(stderrContent, expectedStderr)
      assert.equal(stdoutContent, expectedStdout)

      done()
    }
  }

  cli(process)
}

describe('JSPath CLI', () => {
  it('Show help for -h', (done) => {
    assertOutput(['-h'], null, '', helpOutput, done)
  })
  it('Show help for --help', (done) => {
    assertOutput(['--help'], null, '', helpOutput, done)
  })
  it('Show version for --version', (done) => {
    assertOutput(['--version'], null, '', versionOutput, done)
  })
  it('Accept valid JSPath and valid file', (done) => {
    assertOutput(['.b', validFile], null, '', '2\n', done)
  })
  it('Accept valid JSPath and valid stdin', (done) => {
    assertOutput(['.b'], JSON.stringify(mockData), '', '2\n', done)
  })
  it('Print error and help on no JSPath', (done) => {
    assertOutput([], null, noJsPathError, helpOutput, done)
  })
  it('Print error and help on no file or stdin', (done) => {
    assertOutput(['.b'], null, noFileOrStdinError, helpOutput, done)
  })
  it('Print error and help on file read error', (done) => {
    assertOutput(['.b', invalidFile], null, fileError, helpOutput, done)
  })
  it('Print error and help on invalid JSON', (done) => {
    assertOutput(['.b'], 'abc123', jsonError, helpOutput, done)
  })
  it('Print error and help on invalid JSPath', (done) => {
    assertOutput(['€€'], JSON.stringify(mockData), jsPathError, helpOutput, done)
  })
})

describe('JSPath CLI output', () => {
  it('Print newline for unmatched JSPath', (done) => {
    assertOutput(['.z'], JSON.stringify(mockData), '', '\n', done)
  })
  it('Print matched string', (done) => {
    assertOutput(['.c[1]'], JSON.stringify(mockData), '', '"a"\n', done)
  })
  it('Print matched number', (done) => {
    assertOutput(['.b'], JSON.stringify(mockData), '', '2\n', done)
  })
  it('Print matched boolean', (done) => {
    assertOutput(['.c[2]'], JSON.stringify(mockData), '', 'false\n', done)
  })
  it('Print matched array', (done) => {
    assertOutput(['.c'], JSON.stringify(mockData), '', '[1,"a",false]\n', done)
  })
  it('Print matched object', (done) => {
    assertOutput(['.a'], JSON.stringify(mockData), '', '{"a1":1}\n', done)
  })
})
