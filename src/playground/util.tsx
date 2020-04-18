import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorInfo } from './styled';
import Axios from 'axios';

export let displayError = (err: Error) => {
  let mountNode = document.querySelector('#mountNode');
  ReactDOM.render(<ErrorInfo>{err.stack}</ErrorInfo>, mountNode);
};

export let loadJsForceUmd = async ({
  url,
  name,
  deps = {},
}: {
  url: string;
  name: string;
  deps: { [key: string]: string };
}) => {
  let code = '';
  try {
    let { data } = await Axios(url);
    code = data;
  } catch (err) {
    throw new Error(`loadJsForceUmd - ${err.message} - ${url}`);
  }
  code = `
    (() => {
      let module = { exports: {} }
      let require = k => {
        ${Object.keys(deps)
          .map(k => `if (k === ${k}) return ${deps[k]}`)
          .join('\n')}
        throw new Error(\`module '\${k}' not found\`)
      }
      ;;${code};;
      window[${JSON.stringify(name)}] = module.exports
    })()
  `;
  appendJs(code);
};

export let loadJs = (url: string) => {
  return new Promise((resolve, reject) => {
    let el = document.createElement('script');
    el.src = url;
    el.onload = () => {
      resolve();
    };
    el.onerror = e => {
      reject(new Error(`loadJs onerror - ${url}`));
    };
    window.mountNode.appendChild(el);
  });
};

export let loadCss = (url: string) => {
  return new Promise((resolve, reject) => {
    let el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = url;
    el.onload = () => {
      resolve();
    };
    el.onerror = e => {
      reject(new Error(`loadCss onerror - ${url}`));
    };
    window.mountNode.appendChild(el);
  });
};

export let appendJs = (code: string) => {
  let el = document.createElement('script');
  el.innerHTML = code;
  window.mountNode.appendChild(el);
};

export let appendCss = (code: string) => {
  let el = document.createElement('style');
  el.innerHTML = code;
  window.mountNode.appendChild(el);
};

export let wrapCode = (code: string) => {
  return `
(async () => {
  setRendering(true)
  // mountNode.innerHTML = '' // can cause error in react
  ReactDOM.unmountComponentAtNode(mountNode)
  try {
    let { useRef, useMemo, useState, useEffect, useLayoutEffect, useReducer, useContext, useCallback, useImperativeHandle } = React
    ;;${code};;

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
  } catch (err) {
    console.error(['displayError', err])
    displayError(err)
  } finally {
    setRendering(false)
  }
})()
  `.trim();
};
