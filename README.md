# dora-plugin-weinre

[![NPM version](https://img.shields.io/npm/v/dora-plugin-weinre.svg?style=flat)](https://npmjs.org/package/dora-plugin-weinre)
[![Build Status](https://img.shields.io/travis/dora-js/dora-plugin-weinre.svg?style=flat)](https://travis-ci.org/dora-js/dora-plugin-weinre)
[![Coverage Status](https://img.shields.io/coveralls/dora-js/dora-plugin-weinre.svg?style=flat)](https://coveralls.io/r/dora-js/dora-plugin-weinre)
[![NPM downloads](http://img.shields.io/npm/dm/dora-plugin-weinre.svg?style=flat)](https://npmjs.org/package/dora-plugin-weinre)

dora plugin for weinre.

---

## Usage

```bash
$ npm i dora dora-plugin-weinre -SD
$ ./node_modules/.bin/dora --plugins weinre?{httpPort: 8888}
```

## Param

```javascript
defaultOptions = {
  httpPort: 8990,
  boundHost: 'yourIP',
  verbose: false,
  debug: false,
  readTimeout: 5,
  deathTimeout: 15,
  help: false,
};
```

## Test

```bash
$ npm test
```

## LICENSE

MIT
