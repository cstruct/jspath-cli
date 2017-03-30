/* eslint-env mocha */

'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const run = require('./process-runner')

const packageJson = require('./../package.json')
const mockData = require('./../mock.json')

const expect = chai.expect

chai.use(chaiAsPromised)

const helpOutput = `Usage:
  jspath <options> <jspath> (file | [-])

  Options:
  -h --help   Show this message.
  --version   Show version.
  -p --pretty Enable pretty printing.
  -s --strict Enable strict mode, always conform to the JSON spec.
`

const mockJson = JSON.stringify(mockData)

const versionOutput = `Version: ${packageJson.version}\n`

const noJsPathError = 'No JSPath specified.\n'
const noFileOrStdinError = 'File or stdin needs to be specified.\n'
const fileError = `ENOENT: no such file or directory, open 'someNoneExistentFile.json'\n`
const jsonError = 'JSON parse error: Unexpected token a\n'
const jsPathError = 'JSPath error: Unexpected token "€"\n'

describe('JSPath CLI', () => {
  describe('Options', () => {
    it('shows help for `-h`', () => {
      return expect(run`jspath -h`).to.eventually.have.property('stdout').equal(helpOutput)
    })
    it('shows help for `--help`', () => {
      return expect(run`jspath --help`).to.eventually.have.property('stdout').equal(helpOutput)
    })
    it('shows version for --version', () => {
      return expect(run`jspath --version`).to.eventually.have.property('stdout').equal(versionOutput)
    })
    it('prints matched array pretty-printed if the pretty option is set with `-p`', () => {
      return expect(run`jspath -p '.c' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.c, null, 4)}\n`)
    })
    it('prints matched array pretty-printed if the pretty option is set with `--pretty`', () => {
      return expect(run`jspath --pretty '.c' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.c, null, 4)}\n`)
    })
    it('defaults to printing array minified if the pretty option is not set', () => {
      return expect(run`jspath '.c' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.c)}\n`)
    })
    it('prints matched object pretty-printed if the pretty option is set with `-p`', () => {
      return expect(run`jspath -p '.a' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.a, null, 4)}\n`)
    })
    it('prints matched object pretty-printed if the pretty option is set with `--pretty`', () => {
      return expect(run`jspath --pretty '.a' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.a, null, 4)}\n`)
    })
    it('defaults to printing object minified if the pretty option is not set', () => {
      return expect(run`jspath '.a' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.a)}\n`)
    })
    it('prints matched string quoted if the strict option is set with `-s`', () => {
      return expect(run`jspath -s '.c[1]' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([mockData.c[ 1 ]])}\n`)
    })
    it('prints matched string quoted if the strict option is set with `--strict`', () => {
      return expect(run`jspath --strict '.c[1]' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([mockData.c[ 1 ]])}\n`)
    })
    it('defaults to printing the string unquoted if the strict option is not set', () => {
      return expect(run`jspath '.c[1]' mock.json`).to.eventually.have.property('stdout').equal(`${mockData.c[ 1 ]}\n`)
    })
  })
  describe('Input', () => {
    it('accepts valid JSPath and valid file', () => {
      return expect(run`jspath '.b' mock.json`).to.eventually.have.property('stdout').equal('2\n')
    })
    it('accepts valid JSPath and valid stdin', () => {
      return expect(run`cat ${mockJson} | jspath '.b'`).to.eventually.have.property('stdout').equal('2\n')
    })
  })
  describe('Output', () => {
    it('contains error and help on no JSPath', () => {
      return expect(run`jspath`).to.eventually.deep.equal({
        stderr: noJsPathError,
        stdout: helpOutput
      })
    })
    it('contains error and help on no file or stdin', () => {
      return expect(run`jspath '.b'`).to.eventually.deep.equal({
        stderr: noFileOrStdinError,
        stdout: helpOutput
      })
    })
    it('contains error and help on file read error', () => {
      return expect(run`jspath '.b' someNoneExistentFile.json`).to.eventually.deep.equal({
        stderr: fileError,
        stdout: helpOutput
      })
    })
    it('contains error and help on invalid JSON', () => {
      return expect(run`echo ${'abc123'} | jspath '.b'`).to.eventually.deep.equal({
        stderr: jsonError,
        stdout: helpOutput
      })
    })
    it('contains error and help on invalid JSPath', () => {
      return expect(run`jspath '€€' mock.json`).to.eventually.deep.equal({
        stderr: jsPathError,
        stdout: helpOutput
      })
    })
    it('print a newline for unmatched JSPath', () => {
      return expect(run`jspath '.z' mock.json`).to.eventually.have.property('stdout').equal('\n')
    })
  })

  describe('Normal', () => {
    it('prints singly matched array', () => {
      return expect(run`jspath '.c' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.c)}\n`)
    })
    it('prints array of matched all arrays content', () => {
      return expect(run`jspath '.c|.d' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.c.concat(mockData.d))}\n`)
    })
    it('prints singly matched object', () => {
      return expect(run`jspath '.a' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.a)}\n`)
    })
    it('prints array of multiple matched objects', () => {
      return expect(run`jspath '.a|.e' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.a, mockData.e ])}\n`)
    })
    it('prints singly matched boolean', () => {
      return expect(run`jspath '.c[2]' mock.json`).to.eventually.have.property('stdout').equal(`${mockData.c[2]}\n`)
    })
    it('prints array of multiple matched booleans', () => {
      return expect(run`jspath '.c[2:4]' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.c[2], mockData.c[3] ])}\n`)
    })
    it('prints singly matched number', () => {
      return expect(run`jspath '.b' mock.json`).to.eventually.have.property('stdout').equal(`${mockData.b}\n`)
    })
    it('prints array of multiple matched numbers', () => {
      return expect(run`jspath '.a.a1|.b' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.a.a1, mockData.b ])}\n`)
    })
    it('prints singly matched string unquoted', () => {
      return expect(run`jspath '.e.a' mock.json`).to.eventually.have.property('stdout').equal(`${mockData.e.a}\n`)
    })
    it('prints array of multiple matched strings', () => {
      return expect(run`jspath '.e.*' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.e.a, mockData.e.b ])}\n`)
    })
    it('prints array of multiple matches of mixed types', () => {
      return expect(run`jspath '.f.*' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.f.a, mockData.f.b ])}\n`)
    })
  })
  describe('Strict', () => {
    it('prints matched array', () => {
      return expect(run`jspath -s '.c' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.c)}\n`)
    })
    it('prints array of matched all arrays content', () => {
      return expect(run`jspath -s '.c|.d' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify(mockData.c.concat(mockData.d))}\n`)
    })
    it('prints array of matched object', () => {
      return expect(run`jspath -s '.a' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([mockData.a])}\n`)
    })
    it('prints array of multiple matched objects', () => {
      return expect(run`jspath -s '.a|.e' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.a, mockData.e ])}\n`)
    })
    it('prints array of matched boolean', () => {
      return expect(run`jspath -s '.c[2]' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([mockData.c[2]])}\n`)
    })
    it('prints array of multiple matched booleans', () => {
      return expect(run`jspath -s '.c[2:4]' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.c[2], mockData.c[3] ])}\n`)
    })
    it('prints array of matched number', () => {
      return expect(run`jspath -s '.b' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([mockData.b])}\n`)
    })
    it('prints array of multiple matched numbers', () => {
      return expect(run`jspath -s '.a.a1|.b' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.a.a1, mockData.b ])}\n`)
    })
    it('prints array of string quoted', () => {
      return expect(run`jspath -s '.e.a' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([mockData.e.a])}\n`)
    })
    it('prints array of multiple matched strings', () => {
      return expect(run`jspath -s '.e.*' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.e.a, mockData.e.b ])}\n`)
    })
    it('prints array of multiple matches of mixed types', () => {
      return expect(run`jspath -s '.f.*' mock.json`).to.eventually.have.property('stdout').equal(`${JSON.stringify([ mockData.f.a, mockData.f.b ])}\n`)
    })
  })
})
