
const render = function (req, res, next) {
  const _render = res.render
  let renderArguments = []
  res.render = function () { // view, options, fn
    renderArguments = renderArguments.concat(arguments[0], arguments[1], arguments[2])
    // 给webpack构建添加bundle
    renderArguments[1].bundle = arguments[0].split('/')[1]
    // 处理模板中的错误
    renderArguments[2] = function (err, html) {
      if (err) {
        log.error(err)
        next(new Error(err))
      } else {
        res.send(html)
      }
    }
    return _render.apply(res, renderArguments)
  }
  next()
}

module.exports = render
