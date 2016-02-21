'use strict'

const fs = require('fs')
const jsPath = require('jspath')
const packageJson = require('./package.json')
const minimist = require('minimist')

module.exports = (process) => {
  var argv = minimist(process.argv.slice(2), {
    boolean: ['p', 's'],
    alias: {
      h: 'help',
      p: 'pretty',
      s: 'strict'
    }
  })
  process.printUsage = printUsage.bind(process)
  process.makeError = makeError.bind(process)
  process.readStdin = readStdin.bind(process)
  process.dataRead = dataRead.bind(process)
  process.exitCode = 0
  process.flags = {
    pretty: argv.pretty,
    strict: argv.strict
  }

  if (argv.help) return process.printUsage()
  else if (argv.version) return process.stdout.write(`Version: ${packageJson.version}\n`) && process.exit()

  if (argv._.length === 0) return process.makeError('No JSPath specified.')
  else process.readStdin(argv._[0], argv._[1])
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
    if (res.length === 0) this.stdout.write('\n')
    else if (res.length === 1 && !this.flags.strict && typeof res[0] === 'string') this.stdout.write(`${res[0]}\n`)
    else if (res.length === 1) this.stdout.write(`${JSON.stringify(res[0], null, this.flags.pretty ? 4 : 0)}\n`)
    else this.stdout.write(`${JSON.stringify(res, null, this.flags.pretty ? 4 : 0)}\n`)
  } catch (e) {
    return this.makeError(`JSPath error: ${e.message}`)
  }

  this.exit()
}

function makeError (error) {
  this.stderr.write(`${error}\n`)
  this.exitCode = 1
  this.printUsage()
}

function printUsage () {
  this.stdout.write(`Usage:
  jspath <options> <jspath> (file | [-])

  Options:
  -h --help   Show this message.
  --version   Show version.
  -p --pretty Enable pretty printing.
  -s --strict Enable strict mode, always conform to the JSON spec.
`)

  this.exit()
}
