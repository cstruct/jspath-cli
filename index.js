'use strict'

const fs = require('fs')
const jsPath = require('jspath')
const packageJson = require('./package.json')

module.exports = (process) => {
  process.printUsage = printUsage.bind(process)
  process.makeError = makeError.bind(process)
  process.readStdin = readStdin.bind(process)
  process.dataRead = dataRead.bind(process)
  process.code = 0

  const firstArg = process.argv.length > 2 ? process.argv[ 2 ] : null
  const filePathArg = process.argv.length > 3 ? process.argv[ 3 ] : null

  if (firstArg === '-h' || firstArg === '--help') return process.printUsage()
  else if (firstArg === '--version') return process.stdout.write(`Version: ${packageJson.version}\n`) && process.exit(process.code)

  if (typeof firstArg !== 'string') return process.makeError('No JSPath specified.')
  else process.readStdin(firstArg, filePathArg)
}

function readStdin (jsPathQuery, filePathArg) {
  let data = []
  this.stdin.setEncoding('utf8')
  this.stdin.on('readable', () => {
    const chunk = this.stdin.read()
    if (chunk === null && data.length === 0) {
      this.stdin.destroy()
      if (typeof filePathArg !== 'string') return this.makeError('File or stdin needs to be specified.')
      fs.readFile(filePathArg, 'utf8', (err, data) => {
        if (err) return this.makeError(err.message)
        this.dataRead(jsPathQuery, data)
      })
    } else data.push(chunk)
  })

  this.stdin.on('end', () => data.length > 0 && this.dataRead(jsPathQuery, data.join('')))
}

function dataRead (jsPathQuery, data) {
  let parsedData
  try {
    parsedData = JSON.parse(data)
  } catch (e) {
    return this.makeError(`JSON parse error: ${e.message}`)
  }
  try {
    const res = jsPath.apply(jsPathQuery, parsedData)
    this.stdout.write(`${res}\n`)
    this.exit(this.code)
  } catch (e) {
    return this.makeError(`JSPath error: ${e.message}`)
  }
}

function makeError (error) {
  this.stderr.write(`${error}\n`)
  this.code = 1
  this.printUsage()
}

function printUsage () {
  this.stdout.write(`Usage:
  \tjspath <jspath> (file | [-])
  \tjspath -h | --help
  \tjspath --version

  Options:
  \t-h --help\tShow this message.
  \t--version\tShow version.\n`)

  this.exit(this.code)
}
