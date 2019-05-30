## this

this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式（在哪里被调用）。

### 绑定规则

#### 1. 默认绑定

独立函数调用

```js
function foo () {
    console.log(this.a);
}
var a = 2;
foo();		// 2
```

上面 foo() 函数是直接使用不带任何修饰的函数引用进行调用的，调用 foo() 时，this.a 被解析成了全局变量 a。

#### 2. 隐式绑定

调用位置是否有上下文对象

```js
function foo () {
    console.log(this.a);
}
var obj = {
    a: 2,
    foo: foo
}
obj.foo();		// 2
```

foo 函数被当做引用属性添加到 obj 中，所以它严格来说不属于 obj 对象。但是，obj.foo() 调用时，会使用 obj 上下文来引用函数，foo 的落脚点是 obj 对象。*隐式绑定*会把函数调用中的 this 绑定到 obj 对象。

对象属性引用链中只有最后一层会影响调用位置。

```js
function foo () {
    console.log(this.a);
}
var obj2 = {
    a: 42,
    foo: foo
}
var obj1 = {
    a: 2,
    obj2: obj2
}
obj1.obj2.foo();	// 42
```

传入回调函数时，隐式绑定的函数会丢失绑定对象

```js
function foo () {
    console.log(this.a);
}
function doFoo (fn) {
    fn();
}
var obj = {
    a: 2,
    foo: foo
}
var a = 'oops, global';
doFoo(obj.foo);		// 'oops, global'
```

参数传递也是一种**隐式赋值**，因此实际 fn() 执行时，也是 foo 的引用，所以和默认绑定是一样的。

#### 3. 显式绑定

