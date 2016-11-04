const isSpecialProp = [
  'attrs',
  'props',
  'once',
  'on',
  'nativeOn',
  'class',
  'style',
  'hook'
]

const isNestedProp = [
  'on',
  'once',
  'nativeOn',
  'hook'
]

function mergeFn (a, b) {
  return function () {
    const args = []
    const n = arguments.length
    let i = 0

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
  let classList = []
  const jsxProps = objs.reduce(function (a, b) {
    let aa, bb, key, nestedKey
    for (key in b) {
      aa = a[key]
      bb = b[key]
      if (aa && isSpecialProp.indexOf(key) > -1) {
        // normalize class
        if (key === 'class') {
          classList = aa ? classList.concat(aa) : classList
          classList = bb ? classList.concat(bb) : classList
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

  jsxProps.class = classList
  return jsxProps
}
