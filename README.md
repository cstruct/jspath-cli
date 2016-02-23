# jspath-cli
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/BoyCook/SpaceUI.png?branch=master)](https://travis-ci.org/cstruct/jspath-cli.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/cstruct/jspath-cli/badge.svg?branch=master)](https://coveralls.io/github/cstruct/jspath-cli?branch=master)

[![NPM](https://nodei.co/npm/jspath-cli.png)](https://nodei.co/npm/jspath-cli)

A small CLI wrapper around jspath. Support for working with `stdin` and file paths

## Installation

```sh
npm install -g jspath-cli
```

## Usage

With a file path:
```sh
jspath '.some.path' some-file.json
```
With `stdin`:
```sh
cat some-file.json | jspath '.some.path'
```

## Examples (Temporarily auto-generated)
### Options
 Options shows help for `-h`

```javascript
return expect(run `jspath -h`).to.eventually.deep.equal({
  stderr: '',
  stdout: helpOutput
})
```


 Options shows help for `--help`

```javascript
return expect(run `jspath --help`).to.eventually.deep.equal({
  stderr: '',
  stdout: helpOutput
})
```


 Options shows version for --version

```javascript
return expect(run `jspath --version`).to.eventually.deep.equal({
  stderr: '',
  stdout: versionOutput
})
```


 Options prints matched array pretty-printed if the pretty option is set with `-p`

```javascript
return expect(run `jspath -p '.c' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${JSON.stringify(mockData.c, null, 4)}\n`
})
```


 Options prints matched array pretty-printed if the pretty option is set with `--pretty`

```javascript
return expect(run `jspath --pretty '.c' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${JSON.stringify(mockData.c, null, 4)}\n`
})
```


 Options defaults to printing array minified if the pretty option is not set

```javascript
return expect(run `jspath '.c' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${JSON.stringify(mockData.c)}\n`
})
```


 Options prints matched object pretty-printed if the pretty option is set with `-p`

```javascript
return expect(run `jspath -p '.a' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${JSON.stringify(mockData.a, null, 4)}\n`
})
```


 Options prints matched object pretty-printed if the pretty option is set with `--pretty`

```javascript
return expect(run `jspath --pretty '.a' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${JSON.stringify(mockData.a, null, 4)}\n`
})
```


 Options defaults to printing object minified if the pretty option is not set

```javascript
return expect(run `jspath '.a' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${JSON.stringify(mockData.a)}\n`
})
```


 Options prints matched string quoted if the strict option is set with `-s`

```javascript
return expect(run `jspath -s '.c[1]' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${JSON.stringify(mockData.c[1])}\n`
})
```


 Options prints matched string quoted if the strict option is set with `-s`

```javascript
return expect(run `jspath --strict '.c[1]' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${JSON.stringify(mockData.c[1])}\n`
})
```


 Options defaults to printing the string unquoted if the strict option is not set

```javascript
return expect(run `jspath '.c[1]' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${mockData.c[1]}\n`
})
```


### Input
 Input accepts valid JSPath and valid file

```javascript
return expect(run `jspath '.b' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `2\n`
})
```


 Input accepts valid JSPath and valid stdin

```javascript
return expect(run `cat ${mockJson} | jspath '.b'`).to.eventually.deep.equal({
  stderr: '',
  stdout: `2\n`
})
```


### Output
 Output contains error and help on no JSPath

```javascript
return expect(run `jspath`).to.eventually.deep.equal({
  stderr: noJsPathError,
  stdout: helpOutput
})
```


 Output contains error and help on no file or stdin

```javascript
return expect(run `jspath '.b'`).to.eventually.deep.equal({
  stderr: noFileOrStdinError,
  stdout: helpOutput
})
```


 Output contains error and help on file read error

```javascript
return expect(run `jspath '.b' someNoneExistentFile.json`).to.eventually.deep.equal({
  stderr: fileError,
  stdout: helpOutput
})
```


 Output contains error and help on invalid JSON

```javascript
return expect(run `echo ${'abc123'} | jspath '.b'`).to.eventually.deep.equal({
  stderr: jsonError,
  stdout: helpOutput
})
```


 Output contains error and help on invalid JSPath

```javascript
return expect(run `jspath '€€' mock.json`).to.eventually.deep.equal({
  stderr: jsPathError,
  stdout: helpOutput
})
```


 Output is a newline for unmatched JSPath

```javascript
return expect(run `jspath '.z' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: '\n'
})
```


 Output is the matched number unquoted

```javascript
return expect(run `jspath '.b' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${mockData.b}\n`
})
```


 Output is the matched boolean unquoted

```javascript
return expect(run `jspath '.c[2]' mock.json`).to.eventually.deep.equal({
  stderr: '',
  stdout: `${mockData.c[ 2 ]}\n`
})
```

## Support

Please [open an issue](https://github.com/cstruct/jspath-cli/issues/new) for support.

## Contributing

Please contribute by [opening a pull request](https://github.com/cstruct/jspath-cli/compare/).
