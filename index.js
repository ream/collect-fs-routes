const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const sortBy = require('lodash.sortby')

const pathExists = fp =>
  new Promise(resolve => {
    fs.access(fp, err => {
      resolve(!err)
    })
  })

const readDir = promisify(fs.readdir)
const readStat = promisify(fs.stat)

const filenamify = str => str.replace(/[^a-z0-9\-_]/g, '-').replace(/^-+/, '')

function renderRoutes(routes) {
  return `
  [
    ${routes
      .map(
        route => `
    {
      path: ${JSON.stringify(route.path)},
      component: () => import(/* webpackChunkName: "pages--${filenamify(route.component)}" */ ${JSON.stringify(route.component)}),
      ${route.children ? `children: ${renderRoutes(route.children)}` : ``}
    }`
      )
      .join(',')}
  ]`
}

// index.vue -> /
// about.vue -> /about
// user.vue -> /user
// user/index.vue -> /user, child ''
// user/friends.vue -> /user, child 'friends'
// catalog/index.vue -> /catalog
// catalog/specials.vue -> /catalog/specials
// [path].vue -> /:path

class FileCollector {
  constructor() {
    this.records = []
    this.lookup = {}
  }

  add(path, props) {
    if (!this.lookup[path]) {
      this.lookup[path] = {
        path: filePathToRoutePath(path)
      }
      this.records.push(this.lookup[path])
    }
    Object.assign(this.lookup[path], props)
  }

  sortedRecords() {
    return sortBy(this.records, record => [
      record.path.indexOf(':') >= 0, // Dynamic routes go last
      record.path
    ])
  }
}

function filePathToRoutePath(path) {
  if (path.toLowerCase() === 'index') {
    return ''
  }
  return path.replace(/\[(.*?)\]/g, ':$1')
}

async function collectRoutes({
  pagesDir = 'pages',
  componentPrefix = '',
  basePath = '/',
  match = /\.(vue|js)$/i,
  statCache
} = {}) {
  if (!(await pathExists(pagesDir))) {
    return []
  }

  const collector = new FileCollector()

  for (const name of await readDir(pagesDir)) {
    if (name.match(/^[._]/)) {
      continue
    }
    const stats = await readStat(path.join(pagesDir, name)) // eslint-disable-line no-await-in-loop
    if (stats.isDirectory()) {
      collector.add(name, { dir: name })
    } else if (stats.isFile()) {
      if (name.match(match)) {
        if (statCache) {
          statCache[name] = stats
        }
        collector.add(path.basename(name, path.extname(name)), { file: name })
      }
    }
  }

  const routes = []

  for (const record of collector.sortedRecords()) {
    const routePath = basePath ? path.join(basePath, record.path) : record.path
    if (record.file) {
      const route = {
        path: routePath,
        component: path.join(componentPrefix, record.file)
      }
      if (record.dir) {
        // eslint-disable-next-line no-await-in-loop
        route.children = await collectRoutes({
          pagesDir: path.join(pagesDir, record.dir),
          componentPrefix: path.join(componentPrefix, record.dir),
          basePath: '',
          match
        })
      }
      routes.push(route)
    } else if (record.dir) {
      routes.push(
        // eslint-disable-next-line no-await-in-loop
        ...(await collectRoutes({
          pagesDir: path.join(pagesDir, record.dir),
          componentPrefix: path.join(componentPrefix, record.dir),
          basePath: routePath,
          match
        }))
      )
    }
  }

  return routes
}

exports.collectRoutes = collectRoutes
exports.renderRoutes = renderRoutes
