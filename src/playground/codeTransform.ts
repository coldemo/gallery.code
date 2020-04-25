import { babelTransform } from './babelMaster';

export let codeTransform = async (code: string, file: string) => {
  let isPy = file.endsWith('.py');
  if (isPy) return wrapPy(code);

  code = wrapJs(code);
  let hasJsx = file && ['.jsx', '.tsx'].some(ext => file.endsWith(ext));
  let hasTs = file && ['.ts', '.tsx'].some(ext => file.endsWith(ext));
  if (hasJsx || hasTs) code = await babelTransform(code, file);
  return code;
};

export let wrapPy = (code: string) => {
  return `
(async () => {
  setRendering(true)

  let a0 = assetsNode
  a0.id = 'assetsNodeOutdated'
  let a1 = document.createElement('div')
  a1.id = 'assetsNode'
  a0.parentNode.appendChild(a1)

  // mountNode.innerHTML = '' // can cause error in react
  ReactDOM.unmountComponentAtNode(mountNode)

  try {
    await loadJs('https://www.skulpt.org/js/skulpt.min.js')
    await loadJs('https://www.skulpt.org/js/skulpt-stdlib.js')

    appendCss(\`
    #py-container { padding: 20px }
    #py-canvas { transform: scale(0.7); transform-origin: top center; }
    \`)

    let outf = (text) => {
      let mypre = document.getElementById("py-output");
      mypre.innerHTML = mypre.innerHTML + text;
    }
    let builtinRead = (x) => {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
      return Sk.builtinFiles["files"][x];
    }

    setTimeout(() => {
      let prog = ${JSON.stringify(code)};
      Sk.pre = "py-output";
      Sk.configure({ output: outf, read: builtinRead });

      (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'py-canvas';
      let myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
      });
      myPromise.then(function(mod) {
        console.log('success');
      }, function(err) {
        console.error(['displayError', err])
        displayError(String(err))
      });
    }, 0)

    let h = React.createElement
    ReactDOM.render(h('div', { id: 'py-container' }, [
      h('pre', { key: 1, id: 'py-output' }),
      h('div', { key: 2, id: 'py-canvas' }),
    ]), mountNode)
    a0.parentNode.removeChild(a0)
  } catch (err) {
    console.error(['displayError', err])
    displayError(err)
  } finally {
    setRendering(false)
  }
})()
  `.trim();
};

export let wrapJs = (code: string) => {
  return `
(async () => {
  setRendering(true)

  let a0 = assetsNode
  a0.id = 'assetsNodeOutdated'
  let a1 = document.createElement('div')
  a1.id = 'assetsNode'
  a0.parentNode.appendChild(a1)

  // mountNode.innerHTML = '' // can cause error in react
  ReactDOM.unmountComponentAtNode(mountNode)

  try {
    let { useRef, useMemo, useState, useEffect, useLayoutEffect, useReducer, useContext, useCallback, useImperativeHandle } = React

    ;;${code};;

    if (typeof App !== 'undefined') {
      let isVueLike = _.isPlainObject(App)
      if (isVueLike) {
        if (!mountNode.children[0]) {
          let innerNode = document.createElement('div')
          mountNode.appendChild(innerNode)
        }
        let curr = mountNode.children[0]
        new Vue(App).$mount(curr)
      } else {
        ReactDOM.render(React.createElement(App), mountNode)
      }
    }
    a0.parentNode.removeChild(a0)
  } catch (err) {
    console.error(['displayError', err])
    displayError(err)
  } finally {
    setRendering(false)
  }
})()
  `.trim();
};
