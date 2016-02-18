# jspath-cli
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

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
