const path = require('path')
const test = require('ava')
const { collectRoutes } = require('../')

test('main', async t => {
  const statCache = {}
  const routes = await collectRoutes({
    pagesDir: path.join(__dirname, 'fixtures'),
    componentPrefix: '/some/path',
    statCache
  })
  t.snapshot(routes, 'routes')
  t.snapshot(statCache, 'stat cache')
})
