# jspath-cli
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/BoyCook/SpaceUI.png?branch=master)](https://travis-ci.org/cstruct/jspath-cli.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/cstruct/jspath-cli/badge.svg?branch=master)](https://coveralls.io/github/cstruct/jspath-cli?branch=master)

[![NPM](https://nodei.co/npm/jspath-cli.png)](https://nodei.co/npm/jspath-cli)

A small CLI wrapper around [JSPath](https://npmjs.com/jspath). Support for working with `stdin` and file paths

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

### Options
- Use `-h` or `--help` to show help output.
- Use `--version` to display program version.
- Use `-p` or `--pretty` to enable pretty printing of output.
- Use `-s` or `--strict` to enable strict mode

### Normal mode
To simplify usage in pipes results always try to be returned in it's most simplified form.
This is done by not wrapping in unnecessary data structures and having singely matched strings printed unquoted.

|matched type|output of single|output of multiple|
|---|---|---|
|Array|Array|Array of arrays' values|
|Object|Object|Array of objects|
|Boolean|Boolean|Array of booleans|
|Number|Number|Array of numbers|
|String|String unquoted|Array of strings|
|Mixed|N/A|Array of mixed|

### Strict mode
By enabling strict mode all results are returned as a valid JSON array of matches.

|matched type|output of single|output of multiple|
|---|---|---|
|Array|Array|Array of arrays' values|
|Object|Array of one object|Array of objects|
|Boolean|Array of one boolean|Array of booleans|
|Number|Array of one number|Array of numbers|
|String|Array of one string unquoted|Array of strings|
|Mixed|N/A|Array of mixed|

## Examples

### Simple
The example from [JSPath](https://npmjs.com/jspath):
```sh
$ echo '
    {
        "automobiles" : [
            { "maker" : "Nissan", "model" : "Teana", "year" : 2011 },
            { "maker" : "Honda", "model" : "Jazz", "year" : 2010 },
            { "maker" : "Honda", "model" : "Civic", "year" : 2007 },
            { "maker" : "Toyota", "model" : "Yaris", "year" : 2008 },
            { "maker" : "Honda", "model" : "Accord", "year" : 2011 }
        ],
        "motorcycles" : [{ "maker" : "Honda", "model" : "ST1300", "year" : 2012 }]
    }' | jspath '.automobiles{.maker === "Honda" && .year > 2009}.model'

['Jazz', 'Accord']
```

### Realworld

JSPath can be used to quickly work with the AWS CLI:
```sh
aws ec2 describe-instances | jspath '
    .Reservations.Instances{
        .Tags.Key === "service" && .Tags.Value === "someservice"
    }.PublicIpAddress{
        . !== "1.2.3.4"
    }'
```

## Support

Please [open an issue](https://github.com/cstruct/jspath-cli/issues/new) for support.

## Contributing

Please contribute by [opening a pull request](https://github.com/cstruct/jspath-cli/compare/).
