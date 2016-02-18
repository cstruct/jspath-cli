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

With file paths:
```sh
jspath '.some.path' some-file.json
```
With `stdin`:
```sh
cat some-file.json | jspath '.some.path'
```
