var nestRE = [
  'attrs',
  'props',
  'once',
  'on',
  'nativeOn',
  'class',
  'style',
  'hook'
]

var isNested = [
  'on',
  'once',
  'nativeOn',
  'hook'
]

function mergeFn (a, b) {
  return function () {
    var args = []
    var i = 0
    var n = arguments.length

    // Optimization for V8
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
    for (; i < n; i++) {
      args[i] = arguments[i]
    }

    a.apply(this, args)
    b.apply(this, args)
  }
}

module.exports = function mergeJSXProps (objs) {
  return objs.reduce(function (a, b) {
    var aa, bb, key, nestedKey, temp
    for (key in b) {
      aa = a[key]
      bb = b[key]
      if (aa && nestRE.indexOf(key) > -1) {
        // normalize class
        if (key === 'class') {
          if (typeof aa === 'string') {
            temp = aa
            a[key] = aa = {}
            aa[temp] = true
          }
          if (typeof bb === 'string') {
            temp = bb
            b[key] = bb = {}
            bb[temp] = true
          }
        }
        if (isNested.indexOf(key) > -1) {
          // merge functions
          for (nestedKey in bb) {
            aa[nestedKey] = mergeFn(aa[nestedKey], bb[nestedKey])
          }
        } else if (Array.isArray(aa)) {
          a[key] = aa.concat(bb)
        } else if (Array.isArray(bb)) {
          a[key] = [aa].concat(bb)
        } else {
          for (nestedKey in bb) {
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
