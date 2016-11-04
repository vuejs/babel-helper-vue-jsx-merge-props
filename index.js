var isSpecialProp = [
  'attrs',
  'props',
  'once',
  'on',
  'nativeOn',
  'class',
  'style',
  'hook'
]

var isNestedProp = [
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

function pushClass (classList, className) {
  // Prevent duplicate class names
  if (typeof className === 'string') {
    className.split(' ').forEach(function (xx) {
      // Protect against extra spaces
      if (xx.length) {
        classList.push(xx)
      }
    })
  }
}

module.exports = function mergeJSXProps (objs) {
  var classList = []
  var jsxProps = objs.reduce(function (a, b) {
    var aa, bb, key, nestedKey
    for (key in b) {
      aa = a[key]
      bb = b[key]
      if (aa && isSpecialProp.indexOf(key) > -1) {
        // normalize class
        if (key === 'class') {
          pushClass(classList, aa)
          pushClass(classList, bb)
        }
        if (isNestedProp.indexOf(key) > -1) {
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
  })

  jsxProps.class = classList.join(' ')
  return jsxProps
}
