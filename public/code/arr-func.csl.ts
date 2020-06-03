/* eslint-disable no-extend-native */

// 1.
console.log('-------- 1. --------')
Array.prototype.myMap = function map<T, R>(this: T[], callback: (value: T, index: number, array: T[]) => R, thisArg: any) {
  let res: R[] = []
  let len = this.length
  for (let i = 0; i < len; i++) {
    if (i in this) { // 处理 [empty * m, n], 避免不必要的 callback执行
      let value = this[i]
      res[i] = callback.call(thisArg, value, i, this)
    }
  }
  return res
}
{
  let arr = [1, 2, 3]
  console.log(arr.map((v, i) => ({ v, i })))
  let called = 0
  arr = new Array(10)
  arr[6] = 1
  arr[7] = 2
  console.log(String(arr.map((v, i) => { called++; return `${v}-${i}` })))
  console.log(`callback called ${called} times`)
}

// 2.
console.log('-------- 2. --------')
Function.prototype.myBind = function bind(thisArg: any, ...bindArgs: any[]) {
  if (typeof this !== 'function') {
    throw new TypeError('Bind must be called on a function')
  }
  let self = this
  function Bound(...args) {
    let allArgs = [...bindArgs, ...args]
    let finalThis = this instanceof Bound ? this : thisArg // 处理 new F()
    return self.apply(finalThis, allArgs)
  }
  // -------- 1. --------
  // 手写bind源码
  // https://www.cnblogs.com/psxiao/p/11469427.html
  Bound.prototype = Object.create(this.prototype)
  // Bound.prototype.constructor = this // 这行可省略
  // -------- 2. --------
  // 前端面试之手写一个bind方法
  // https://blog.csdn.net/tzllxya/article/details/90702688
  // JavaScript中bind和new共同作用时this的指向问题
  // https://blog.csdn.net/qq_34629352/article/details/101384525
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // function Noop() {}
  // Noop.prototype = this.prototype
  // Bound.prototype = new Noop()
  // -------- end --------
  return Bound
}
{
  try {
    ({}).myBind(886, 1, 2)
  } catch (err) {
    console.log(String(err))
  }
  function Foo(name) {
    this.name = name;
  }
  let obj = {};
  let Bar = Foo.myBind(obj);
  Bar('Jack');
  console.log('obj.name', obj.name);  // Jack
  let alice = new Bar('Alice');
  console.log('obj.name', obj.name);  // Jack
  console.log('alice.name', alice.name);    // Alice
  console.log('alice instanceof Foo', alice instanceof Foo);    // true
  console.log('alice instanceof Bar', alice instanceof Bar);    // true
  console.log('alice.constructor === Foo', alice.constructor === Foo);    // true
  // console.log('alice.__proto__ === Foo.prototype', alice.__proto__ === Foo.prototype); // false 没法做到true
}

// 3.
console.log('-------- 3. --------')
// js手动实现new方法
// https://www.jianshu.com/p/9cee6a703e01
// 如何实现一个 new
// https://blog.csdn.net/qq_39985511/article/details/87692673
type Constructor = new (...a: any[]) => any
function myNew(Ctor: Constructor, ...args: any[]) {
  if (typeof Ctor !== 'function') { // 处理类型判断
    // sometimes TypeError: (intermediate value) is not a constructor
    throw new TypeError(`${String(Ctor)} is not a constructor`)
  }
  // let obj = new Object()
  let obj = {}
  obj.__proto__ = Ctor.prototype
  let res = Ctor.apply(obj, args)
  return typeof res === 'object' ? res : obj
}
{
  try {
    myNew(886, 1, 2)
  } catch (err) {
    console.log(String(err))
  }
  function Dog(name) {
    this.name = name
    this.say = function () {
      console.log('dog = ' + this.name)
    }
  }
  function Cat(name) {
    this.name = name
    this.say = function () {
      console.log('cat = ' + this.name)
    }
  }
  let dog = myNew(Dog, 'aaa')
  dog.say() // 'name = aaa'
  console.log('dog instanceof Dog', dog instanceof Dog) // true
  console.log('dog instanceof Cat', dog instanceof Cat) // false
  let cat = myNew(Cat, 'bbb');
  cat.say() // 'name = bbb'
  console.log('cat instanceof Cat', cat instanceof Cat) // true
}

// 4.
console.log('-------- 4. --------')
// 手动实现new 和 instanceof
// https://www.jianshu.com/p/0f1ebd388092
function myInstanceOf(obj: any, Ctor: Constructor) {
  if (!(Ctor instanceof Object)) { // 处理类型判断
    throw new TypeError('Right-hand side of \'instanceof\' is not an object')
  }
  if (typeof Ctor !== 'function') { // 处理类型判断
    throw new TypeError('Right-hand side of \'instanceof\' is not callable')
  }
  let p = obj == null ? null : obj.__proto__
  while (p) {
    if (p === Ctor.prototype) return true
    p = p.__proto__
  }
  return false
}
{
  try {
    myInstanceOf(0, null)
  } catch (err) {
    console.log(String(err))
  }
  try {
    myInstanceOf(0, {})
  } catch (err) {
    console.log(String(err))
  }
  console.log('0 of Number', myInstanceOf(0, Number))
  console.log('false of Number', myInstanceOf(false, Number))
  console.log('0 of Boolean', myInstanceOf(0, Boolean))
  console.log('false of Boolean', myInstanceOf(false, Boolean))
  console.log('false of String', myInstanceOf(0, String))
  console.log('\'\' of String', myInstanceOf('', String))
  console.log('undefined of Object', myInstanceOf(undefined, Object))
  console.log('null of Object', myInstanceOf(null, Object))
  console.log('{} of Object', myInstanceOf({}, Object))
  console.log('[] of Array', myInstanceOf([], Array))
  let dog = new Dog('aaa')
  console.log('dog instanceof Dog', myInstanceOf(dog, Dog)) // true
  console.log('dog instanceof Cat', myInstanceOf(dog, Cat)) // false
  let cat = new Cat('bbb');
  console.log('cat instanceof Cat', myInstanceOf(cat, Cat)) // true
}

// 5.
function strEnum<T extends string>(arr: Array<T>): { [K in T]: K } {
  let res = {} as { [K in T]: K }
  arr.forEach(val => {
    res[val] = val
  })
  return res
}
