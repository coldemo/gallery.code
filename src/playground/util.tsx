import Axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorInfo } from './styled';

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
          .map(k => `if (k === ${JSON.stringify(k)}) return ${deps[k]}`)
          .join('\n')}
        throw new Error(\`module '\${k}' not found\`)
      }
      ;;${code};;
      window[${JSON.stringify(name)}] = module.exports
    })()
  `;
  appendJs(code);
};

export let loadJs = (url: string | string[]): Promise<void> => {
  if (Array.isArray(url)) {
    return Promise.all(url.map(loadJs)).then(() => undefined);
  }
  return new Promise((resolve, reject) => {
    let el = document.createElement('script');
    el.src = url;
    el.onload = () => {
      resolve();
    };
    el.onerror = e => {
      reject(new Error(`loadJs onerror - ${url}`));
    };
    window.assetsNode.appendChild(el);
  });
};

export let loadCss = (url: string | string[]): Promise<void> => {
  if (Array.isArray(url)) {
    return Promise.all(url.map(loadCss)).then(() => undefined);
  }
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
    window.assetsNode.appendChild(el);
  });
};

// todo error-handling
export let appendJs = (code: string) => {
  let el = document.createElement('script');
  el.innerHTML = code;
  window.assetsNode.appendChild(el);
};

export let appendCss = (code: string) => {
  let el = document.createElement('style');
  el.innerHTML = code;
  window.assetsNode.appendChild(el);
};

export let appendHtml = (code: string) => {
  window.mountNode.innerHTML += code;
};
