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
  let { data: code } = await Axios(url);
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
  return new Promise((resolve, reject) => {
    let el = document.createElement('script');
    el.innerHTML = code;
    el.onload = () => {
      resolve();
    };
    el.onerror = e => {
      reject(new Error(`appendJs onerror - ${code.slice(0, 100)}`));
    };
    window.mountNode.appendChild(el);
  });
};

export let appendCss = (code: string) => {
  return new Promise((resolve, reject) => {
    let el = document.createElement('style');
    el.innerHTML = code;
    el.onload = () => {
      resolve();
    };
    el.onerror = e => {
      reject(new Error(`appendCss onerror - ${code.slice(0, 100)}`));
    };
    window.mountNode.appendChild(el);
  });
};
