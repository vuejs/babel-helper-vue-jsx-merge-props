const specialProps = [
  'attrs',
  'props',
  'once',
  'on',
  'nativeOn',
  'class',
  'style',
  'hook'
]

const nestedProps = [
  'on',
  'once',
  'nativeOn',
  'hook'
]

function mergeFn (a, b) {
  return function () {
    const args = new Array(arguments.length)

    // Optimization for V8
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    for (let i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }

    a && a.apply(this, args)
    b && b.apply(this, args)
  }
}

module.exports = function mergeJSXProps (objs) {
  let classList = []
  const jsxProps = objs.reduce(function (a, b) {
    let aa, bb, key, nestedKey
    for (key in b) {
      aa = a[key]
      bb = b[key]

      if (aa && specialProps.indexOf(key) > -1) {
        // normalize class
        if (key === 'class') {
          classList = aa ? classList.concat(aa) : classList
          classList = bb ? classList.concat(bb) : classList
        }

        if (nestedProps.indexOf(key) > -1) {
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

  jsxProps.class = classList
  return jsxProps
}
