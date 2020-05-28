import { babelTransform } from './babelMaster';

export let codeTransform = async (code: string, file: string) => {
  let isMd = file.endsWith('.md');
  let isPy = file.endsWith('.py');
  let isVue = file.endsWith('.vue');
  if (isMd) return wrapMd(code);
  if (isPy) return wrapPy(code);
  if (isVue) return wrapVue(code);

  code = wrapJs(code);
  let hasJsx = file && ['.jsx', '.tsx'].some(ext => file.endsWith(ext));
  let hasTs = file && ['.ts', '.tsx'].some(ext => file.endsWith(ext));
  if (hasJsx || hasTs) code = await babelTransform(code, file);
  return code;
};

export let wrapVue = (code: string) => {
  // todo move into rendering
  let sandbox = document.createElement('div');
  sandbox.innerHTML = code; // safe, script won't be executed

  let vueTemplateEl = sandbox.querySelector('template');
  let vueTemplate = vueTemplateEl ? vueTemplateEl.innerHTML : '';
  let vueScript = '';
  sandbox.querySelectorAll('script').forEach(el => {
    vueScript += el.innerHTML + '\n\n;;';
  });
  let vueStyle = '';
  sandbox.querySelectorAll('style').forEach(el => {
    vueStyle += el.innerHTML + '\n\n';
  });

  return `
(async () => {
  let removeLoading = addLoading()
  {
    let a0 = assetsNode
    a0.id = 'assetsNodeOutdated'
    let a1 = document.createElement('div')
    a1.id = 'assetsNode'
    a0.parentNode.appendChild(a1)
  }

  ReactDOM.unmountComponentAtNode(mountNode)
  mountNode.innerHTML = '' // put behind, otherwise can cause error in react

  try {
    await loadJs('https://unpkg.com/vue@2.6.11/dist/vue.min.js')
    appendCss(${JSON.stringify(vueStyle)})

    let module = { exports: null }
    ;(() => {
      ;;${vueScript};;
    })()
    let App = module.exports
    App.template = ${JSON.stringify(vueTemplate)}

    if (!mountNode.children[0]) {
      let innerNode = document.createElement('div')
      mountNode.appendChild(innerNode)
    }
    let curr = mountNode.children[0]
    new Vue(App).$mount(curr)
    {
      let a0 = assetsNodeOutdated
      if (a0.parentNode) a0.parentNode.removeChild(a0)
    }
  } catch (err) {
    console.error(['displayError', err])
    displayError(err)
  } finally {
    removeLoading()
  }
})()
  `.trim();
};

export let wrapMd = (code: string) => {
  return `
(async () => {
  let removeLoading = addLoading()
  {
    let a0 = assetsNode
    a0.id = 'assetsNodeOutdated'
    let a1 = document.createElement('div')
    a1.id = 'assetsNode'
    a0.parentNode.appendChild(a1)
  }

  ReactDOM.unmountComponentAtNode(mountNode)
  mountNode.innerHTML = '' // put behind, otherwise can cause error in react

  try {
    await loadJs('https://unpkg.com/vditor@3.2.0/dist/method.min.js')
    await loadCss('https://unpkg.com/vditor@3.2.0/dist/index.css')

    appendCss(\`
    #mdPreview { padding: 16px 16px 32px }
    #mdPreview > *:first-child { margin-top: 0 !important }
    .vditor-speech { left: 2px !important }
    \`)

    appendHtml(\`
    <div id="mdPreview"></div>
    \`)

    // Code from https://markdown.lovejade.cn/
    // let onloadCallback = oEvent => {}

    // Code from https://github.com/Vanessa219/vditor/blob/master/demo/static-preview.html
    await Vditor.preview(mdPreview, ${JSON.stringify(code)}, {
      markdown: { toc: true },
      speech: { enable: true },
      anchor: true,
      // after () {
      //   Vditor.outlineRender(mdPreview, document.getElementById('outline'))
      // },
      lazyLoadImage: 'https://cdn.jsdelivr.net/npm/vditor/dist/images/img-loading.svg',
      renderers: {
        renderHeading: (node, entering) => {
          if (entering) {
            const id = Lute.GetHeadingID(node)
            return [
              \`<h\${node.__internal_object__.HeadingLevel} class="vditor__heading">
<a id="vditorAnchor-\${id}" class="vditor-anchor" href="javascript:void 0"></a>
<span class="prefix"></span><span>\`,
              Lute.WalkContinue]
          } else {
            return [\`</span></h\${
              node.__internal_object__.HeadingLevel
            }>\`, Lute.WalkContinue]
          }
        },
      },
    })

    {
      let a0 = assetsNodeOutdated
      if (a0.parentNode) a0.parentNode.removeChild(a0)
    }
  } catch (err) {
    console.error(['displayError', err])
    displayError(err)
  } finally {
    removeLoading()
  }
})()
  `.trim();
};

export let wrapPy = (code: string) => {
  return `
(async () => {
  let removeLoading = addLoading()
  {
    let a0 = assetsNode
    a0.id = 'assetsNodeOutdated'
    let a1 = document.createElement('div')
    a1.id = 'assetsNode'
    a0.parentNode.appendChild(a1)
  }

  ReactDOM.unmountComponentAtNode(mountNode)
  mountNode.innerHTML = '' // put behind, otherwise can cause error in react

  try {
    // await loadJs('http://www.skulpt.org/js/skulpt.min.js')
    // await loadJs('http://www.skulpt.org/js/skulpt-stdlib.js')
    await loadJs('./skulpt.min.js')
    await loadJs('./skulpt-stdlib.js')

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
    {
      let a0 = assetsNodeOutdated
      if (a0.parentNode) a0.parentNode.removeChild(a0)
    }
  } catch (err) {
    console.error(['displayError', err])
    displayError(err)
  } finally {
    removeLoading()
  }
})()
  `.trim();
};

export let wrapJs = (code: string) => {
  return `
(async () => {
  let removeLoading = addLoading()
  {
    let a0 = assetsNode
    a0.id = 'assetsNodeOutdated'
    let a1 = document.createElement('div')
    a1.id = 'assetsNode'
    a0.parentNode.appendChild(a1)
  }

  ReactDOM.unmountComponentAtNode(mountNode)
  mountNode.innerHTML = '' // put behind, otherwise can cause error in react

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
    {
      let a0 = assetsNodeOutdated
      if (a0.parentNode) a0.parentNode.removeChild(a0)
    }
  } catch (err) {
    console.error(['displayError', err])
    displayError(err)
  } finally {
    removeLoading()
  }
})()
  `.trim();
};
