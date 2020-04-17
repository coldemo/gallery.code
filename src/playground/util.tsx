import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorInfo } from './styled';

export let displayError = (err: Error) => {
  let mountNode = document.querySelector('#mountNode');
  ReactDOM.render(<ErrorInfo>{err.stack}</ErrorInfo>, mountNode);
};

export let loadJs = (url: string) => {
  return new Promise((resolve, reject) => {
    let el = document.createElement('script');
    el.src = url;
    el.onload = () => {
      document.body.removeChild(el);
      resolve();
    };
    el.onerror = e => {
      document.body.removeChild(el);
      reject(e);
    };
    document.body.appendChild(el);
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
      reject(e);
    };
    document.body.appendChild(el);
  });
};

export let appendJs = (code: string) => {
  return new Promise((resolve, reject) => {
    let el = document.createElement('script');
    el.innerHTML = code;
    el.onload = () => {
      document.body.removeChild(el);
      resolve();
    };
    el.onerror = e => {
      document.body.removeChild(el);
      reject(e);
    };
    document.body.appendChild(el);
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
      reject(e);
    };
    document.body.appendChild(el);
  });
};
