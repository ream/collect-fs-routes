const path = require('path')
const test = require('ava')
const { collectRoutes } = require('../')

test('main', async t => {
  const routes = await collectRoutes({
    pagesDir: path.join(__dirname, 'fixtures'),
    componentPrefix: '/some/path'
  })
  t.snapshot(routes)
})
