const fs = require('fs')
const path = require('path')
const test = require('ava')
const { collectRoutes, renderRoutes } = require('../')

test('main', async t => {
  const statCache = {}
  const routes = await collectRoutes({
    pagesDir: path.join(__dirname, 'fixtures'),
    componentPrefix: '/some/path',
    statCache
  })
  t.snapshot(routes, 'routes')
  t.snapshot(renderRoutes(routes), 'render routes')
  for (const name of Object.keys(statCache)) {
    t.true(statCache[name] instanceof fs.Stats)
  }
})
