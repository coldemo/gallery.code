let worker = new Worker('./babel-worker.js');

export let babelTransform = async (
  code: string,
  file: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    worker.onerror = e => {
      console.error(['worker onerror', e]);
      reject(new Error(`worker onerror - ${code.slice(0, 100)}`));
    };

    worker.onmessage = e => {
      let res = e.data;
      if (res.error) {
        reject(res.error as Error);
      } else {
        resolve(res.data as string);
      }
    };
    worker.postMessage({ code, file });
  });
};
