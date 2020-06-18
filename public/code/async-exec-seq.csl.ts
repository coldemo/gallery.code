// 浏览器与Node的事件循环(Event Loop)有何区别?
// https://blog.csdn.net/Fundebug/article/details/86487117
// 关于async/await、promise和setTimeout执行顺序
// https://blog.csdn.net/yun_hou/article/details/88697954

// 1.
console.log('---------- 1. ----------')
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}

console.log("script start");
async1();
console.log("script end");

// 2.
await sleep(1000)
console.log('---------- 2. ----------')
console.log("script start");
let promise1 = new Promise(function (resolve) {
  console.log("promise1");
  resolve();
  console.log("promise1 end");
}).then(function () {
  console.log("promise2");
});
setTimeout(function () {
  console.log("settimeout 1");
}, 2);
setTimeout(function () {
  console.log("settimeout 2");
});
console.log("script end");

// 3.
await sleep(1000)
console.log('---------- 3. ----------')
const dateFrom = Date.now()
let i = 1;

const timer = setInterval(() => {
  console.log(i++, Date.now() - dateFrom);
  const s = Date.now();
  while (Date.now() - s < 300) {}
}, 200);

setTimeout(() => {
  clearInterval(timer);
}, 700);

// 4.
await sleep(1000)
console.log('---------- 4. ----------')
let p = [];
(function() {
  setTimeout(() => {
    console.log('timeout 0');
  }, 0);
  let i = 0;
  for (; i < 3; i++) {
    p[i] = function() {
      return new Promise(function(resolve) {
        console.log(`promise ${i}`);
        resolve(`promise ${i * i}`);
      })
    }
  }
})();
async function b() {
  console.log('async -1');
}
function a() {
  console.log(`async ${p.length}`);
  return async function() {
    console.log(`async ${p.length}`);
    await b();
    console.log('async -2')
  };
}
p.push(a());
p[1]().then(console.log);
p[3]();
