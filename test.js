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
  jspath <options> <jspath> (file | [-])

  Options:
  -h --help   Show this message.
  --version   Show version.
  -p --pretty Enable pretty printing.
  -s --strict Enable strict mode, always conform to the JSON spec.
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
  it('Prints a newline for unmatched JSPath', (done) => {
    assertOutput(['.z'], JSON.stringify(mockData), '', '\n', done)
  })
  it('Prints matched string unquoted if the strict flag is not set', (done) => {
    assertOutput(['.c[1]'], JSON.stringify(mockData), '', `${mockData.c[1]}\n`, done)
  })
  it('Prints matched string quoted if the strict flag is set', (done) => {
    assertOutput(['-s', '.c[1]'], JSON.stringify(mockData), '', `${JSON.stringify(mockData.c[1])}\n`, done)
  })
  it('Prints matched number unquoted in all cases', (done) => {
    assertOutput(['.b'], JSON.stringify(mockData), '', `${mockData.b}\n`, done)
  })
  it('Prints matched boolean unquoted in all cases', (done) => {
    assertOutput(['.c[2]'], JSON.stringify(mockData), '', `${mockData.c[2]}\n`, done)
  })
  it('Prints matched array minified if the pretty flag is not set', (done) => {
    assertOutput(['.c'], JSON.stringify(mockData), '', `${JSON.stringify(mockData.c)}\n`, done)
  })
  it('Prints matched object minified if the pretty flag is not set', (done) => {
    assertOutput(['.a'], JSON.stringify(mockData), '', `${JSON.stringify(mockData.a)}\n`, done)
  })
  it('Prints matched array pretty-printed if the pretty flag is set', (done) => {
    assertOutput(['-p', '.c'], JSON.stringify(mockData), '', `${JSON.stringify(mockData.c, null, 4)}\n`, done)
  })
  it('Prints matched object pretty-printed if the pretty flag is set', (done) => {
    assertOutput(['-p', '.a'], JSON.stringify(mockData), '', `${JSON.stringify(mockData.a, null, 4)}\n`, done)
  })
})
