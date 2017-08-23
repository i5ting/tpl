const express = require('express')
const router = express.Router()

module.exports = function (app) {
  app.use('/', router)
}

router.get('/', function (req, res, next) {
  log.info('首页')
  res.render('app/index/index', {title: '首页'})
})

router.get('/detail', function (req, res, next) {
  log.info('详情页')
  res.render('app/detail/index', {title: '详情页'})
})
