let worker = new Worker('./babel-worker.js');

let wrapCode = (code: string) => {
  return `
(async () => {
  setRendering(true)
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
      ReactDOM.render(<App />, mountNode)
    }
  } catch (err) {
    displayError(err)
  } finally {
    setRendering(false)
  }
})()
  `.trim();
};

export let babelTransform = async (code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let fullCode = wrapCode(code);

    worker.onerror = e => {
      console.log(['worker error', e]);
      reject(e);
    };

    worker.onmessage = e => {
      let res = e.data;
      if (res.error) {
        reject(res.error as Error);
      } else {
        resolve(res.data as string);
      }
    };
    worker.postMessage(fullCode);
  });
};
