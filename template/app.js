const CURRENT_PATH = '.'

const debug = require('debug')('luojilab')
const express = require('express')
const renderConf = require(CURRENT_PATH + '/config/renderConfig')
const glob = require('glob')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const compress = require('compression')
const nunjucks = require('nunjucks')
const logger = require('luojilab-log4js').use
const port = require('luojilab-port')

global.log = require('luojilab-log4js').logger

const WEBPACK_HASH_MAP = require(CURRENT_PATH + '/config/webpack-hash-map')

// console.log(WEBPACK_HASH_MAP)

const render = require(CURRENT_PATH + '/server/middleware/render')
const app = express()
const env = process.env.SERVER_CONFIG || 'testing'

app.locals.ENV = env
app.locals.ENV_DEVELOPMENT = env === 'development'
app.locals.WEBPACK_HASH_MAP = WEBPACK_HASH_MAP
app.set('views', renderConf.root + '/server/views')
app.set('view engine', 'html')

const nunjuck = nunjucks.configure(renderConf.root + '/server/views', {
  autoescape: true,
  watch: true, // 依赖 chokidar
  express: app,
  tags: {
    variableStart: '##',
    variableEnd: '##'
  }
})
debug(7)
nunjuck.addGlobal('staticBaseUrl', renderConf.staticBaseUrl)
logger(app)
app.use(favicon(renderConf.root + '/public/favicon.ico'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(compress())
app.use(express.static(renderConf.root + '/public'))
app.use(render)

app.startServer = function() {
  glob.sync(renderConf.root + '/server/routes/*.js').forEach(function (router) {
    require(router)(app)
  })

  var uri = 'http://127.0.0.1:' + port
  console.log('> Starting dev server...')

  app.listen(port, function () {
    console.log('> App (production) is now Listening at ' + uri + '\n')
  })

  this.use(function (req, res, next) {
      var err = new Error('Not Found')
      err.status = 404
      next(err)
  })

  this.use(function (err, req, res, next) {
      res.status(err.status || 500)
      res.render('app/error/error', {
          message: err.message,
          error: err,
          title: 'error'
      })
  })
}

app.startServer()

module.exports = app
