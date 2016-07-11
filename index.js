module.exports = require('babel-template')(`
  function _mergeJSXProps (objs) {
    var nestRE = /^(attrs|props|on|class|style|staticAttrs)$/
    return objs.reduce(function (a, b) {
      for (var key in b) {
        if (a[key] && nestRE.test(key)) {
          var aa = a[key]
          var bb = b[key]
          if (Array.isArray(aa)) {
            a[key] = aa.concat(bb)
          } else if (Array.isArray(bb)) {
            a[key] = [aa].concat(bb)
          } else {
            for (var nestedKey in bb) {
              aa[nestedKey] = bb[nestedKey]
            }
          }
        } else {
          a[key] = b[key]
        }
      }
      return a
    }, {})
  }
`)()
