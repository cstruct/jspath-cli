'use strict'

const cli = require('../index.js')
const stream = require('stream')

module.exports = function jspath (strings, values) {
  const params = [].concat.apply([], strings.map(x => x.replace(/'/g, '').split(' ')))

  if (!~params.indexOf('jspath')) throw new Error('Needs to emulate a call to jspath.')

  const filter = ['|', 'jspath', 'cat', 'echo']
  const argv = params.filter(x => x && !~filter.indexOf(x))

  let stdoutContent = ''
  let stderrContent = ''

  const stdin = new stream.Readable()
  stdin.readable = true
  stdin.destroy = () => {}
  values && stdin.push(values)
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

  return new Promise((resolve) => {
    const process = {
      argv: [ '', '' ].concat(argv),
      stdin,
      stdout,
      stderr,
      exit: () => {
        resolve({
          stderr: stderrContent,
          stdout: stdoutContent
        })
      }
    }

    cli(process)
  })
}
