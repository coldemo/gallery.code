/* global Babel, importScripts */
// importScripts('https://unpkg.com/@babel/standalone');
// importScripts('https://unpkg.com/@babel/standalone@7.9.4/babel.js');
importScripts('./babel.min.js');

let Queue = {
  skipMiddle: true,
  tasks: [],
  async exec({ code, file }) {
    try {
      let plugins = [];
      let hasJsx = file && ['.jsx', '.tsx'].some(ext => file.endsWith(ext));
      let hasTs = file && ['.ts', '.tsx'].some(ext => file.endsWith(ext));
      if (hasJsx) {
        let isVueJsx = /render\s*\(\s*h\s*\)\s*\{/.test(code);
        if (isVueJsx) {
          plugins.push('syntax-jsx', 'transform-vue-jsx');
        } else {
          plugins.push('transform-react-jsx');
        }
      }
      if (hasTs) {
        if (hasJsx) {
          plugins.push(['transform-typescript', { isTSX: true }]);
        } else {
          plugins.push('transform-typescript');
        }
      }
      if (plugins.length) {
        /* cpu-intensive start */
        let res = Babel.transform(code, { plugins });
        /* cpu-intensive end */
        code = res.code;
      }
      postMessage({ data: code });
    } catch (err) {
      // postMessage({ error: err ? err.stack : String(err) })
      postMessage({ error: err });
    }
  },
  push(task) {
    if (this.skipMiddle) {
      if (this.tasks.length >= 2) {
        this.tasks.length = 1;
      }
    }
    this.tasks.push(task);
    this.tick();
  },
  async tick() {
    if (this.tasks.length === 1) {
      await this.exec(this.tasks[0]);
      this.tasks.shift();
      this.tick();
    }
  },
};

onmessage = e => {
  let code = e.data;
  Queue.push(code);
};
