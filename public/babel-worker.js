/* global Babel, importScripts */
// importScripts('./babel.min.js')
// importScripts('https://unpkg.com/@babel/standalone');
importScripts('https://unpkg.com/@babel/standalone@7.9.4/babel.js')

let Queue = {
  skipMiddle: true,
  tasks: [],
  async exec(code) {
    try {
      /* cpu-intensive start */
      let res = Babel.transform(code, {
        plugins: ['transform-react-jsx'],
      });
      /* cpu-intensive end */
      postMessage({ data: res.code });
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
