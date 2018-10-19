
# collect-fs-routes

[![NPM version](https://badgen.net/npm/v/@ream/collect-fs-routes)](https://npmjs.com/package/@ream/collect-fs-routes) [![NPM downloads](https://badgen.net/npm/dm/@ream/collect-fs-routes)](https://npmjs.com/package/collect-fs-routes) [![CircleCI](https://badgen.net/circleci/github/ream/collect-fs-routes/master)](https://circleci.com/gh/ream/collect-fs-routes/tree/master)

> This is used by Ream and similar Vue SSR / static site generator.

## Install

```bash
yarn add @ream/collect-fs-routes
```

## Usage

```js
const { collectRoutes } = require('@ream/collect-fs-routes')

const routes = collectRoutes(options)
const routesString = renderRoutes(routes)
```

## API

### collectRoutes([options])

#### options.pagesDir

- Type: `string`
- Default: `'pages'`

The directory to page components.

#### options.componentPrefix

- Type: `string`
- Default: `''`

The path prefix for `component` property in vue-router route records.

#### options.basePath

- Type: `string`
- Default: `'/'`

The base path for `path` property in vue-roouter route records.

#### options.match

- Type: `RegExp`
- Default: `/\.(vue|js)$/`

The regular expression that is used to match page components.

#### options.statCache

- Type: `Object`
- Default: `undefined`

Cache of `fs.stat` results.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**collect-fs-routes** © [EGOIST](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/ream/collect-fs-routes/contributors)).

> [github.com/EGOIST](https://github.com/egoist) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
