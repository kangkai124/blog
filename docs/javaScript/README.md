## 作用域

**作用域**是一套规则，用于确定在何处以及如何查找变量（标识符）。

LSH 查询（左），赋值操作

RSH 查询（右），获取变量的值

= 操作符和调用函数传参操作都会导致关联作用域的赋值操作。

LHS 和 RHS 查询都从当前作用域开始，没有的话向上级作用域查找，直到最顶层全局作用域，无论找没找到都停止。

失败的 LHS 导致隐式地创建一个全局变量（非严格模式，严格模式抛出 ReferenceError 错误）。

失败的 RHS 直接抛出 ReferenceError 错误。



 JavaScript 引擎首先会在代码执行前对其进行编译，例如 var a = 2

1. var a ，在其作用域中声明新变量，代码执行前进行。
2. a = 2 ，LSH 查询变量 a 并对其赋值。



### 函数作用域

外部作用域无法访问到函数内部的任何内容。

```js
 foo1 () {
   var a = 3;
   console.log(a);
 }
 foo1()
```

声明具名函数两个缺点：函数名污染所在作用域、需显式通过函数名调用。

但是 JavaScript 提供了解决方法：IIFE，立即执行函数表达式（Immediately Invoked Function Expression）如下：

```js
(function foo2 () {
    var a = 2;
    console.log(a);
})()
```

foo2 函数会被当做函数表达式来处理，而不是标准的函数声明。

如何区分函数声明和函数表达式：

看 function 关键字出现在声明中的位置（整个声明中的位置），如果 function 是第一个词，就是函数声明，否则就是函数表达式。

函数声明和函数表达式之间最重要的区别是**名称标识符将会绑定在何处**：

foo1 被绑定在所在作用域中，foo2 被绑定在函数表达式自身的函数中。

>  始终给函数表达式命名是一个最佳实践。

IIFE进阶用法，传参

```js
(function IIFE (global) {
  var a = 3;
  console.log(global.a);
})(window);
```



### 块作用域

let 关键字可以将变量绑定在任意的作用域中（通常是 { ... } 中）。

let 为其声明的变量隐式地创建了块作用域。

>  推荐显式地创建块作用域。

```js
{
  let a = 2;
  cosnole.log(a);   // 2
}
console.log(a);     // ReferenceError: a is not defined
```

块作用域有用的一点和 闭包和垃圾回收机制有关（见下面）。



### 提升

考虑一下两段代码

```js
// 代码1
 a = 2;
 var a;
 console.log(a);

// 代码2
 console.log(a);
 var a = 2;
```

答案：2、undefined

包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理，函数优先提升。

第一个代码片段其实会被这样处理：

```js
var a;
a = 2;
console.log(2);
```

第二个代码片段：

```js
var a;
console.log(a);
a = 2;

```

函数声明会被提升，函数表达式不会被提升。

```js
foo();    // TypeError!!!
var foo = function () {
  //
}
```

变量标识符 foo 被提升，但是执行 foo() 时 foo = undefined，因此对undefined 进行函数调用而导致非法操作，抛出 TypeError 异常。

```js
foo();    // TypeError
bar();    // ReferenceError
var foo = function bar () { }
```

即使是具名的函数表达式，名称标识符在赋值之前也不能使用。



## 闭包

关于闭包的一些定义：

> 1. 当函数可以**记住**并**访问**所在的词法作用域时，就产生了闭包（不一定是完整的闭包）。即使函数是在当前词法作用域之外执行的。
> 2. example 2 中 bar 依然持有对 foo 函数内部作用域的引用，这个引用就叫做闭包。闭包使得函数可以继续访问定义时的词法作用域。
> 3. 无论通过何种手段将内部函数**传递**到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。

```js
function foo () {
    var a = 2;
    function bar () {
        console.log(a);
    }
    bar();
}
foo();
```

函数 bar( ) 具有一个涵盖 foo ( ) 作用域的闭包，但不是完整的闭包，向下面把 bar return 出来的才算是完整的闭包。也就是**在自己定义的词法作用域外执行**。 



```js
// example 2
function foo () {
    var a = 2;
    function bar () {
        console.log(a);
    }
    return bar;
}
var baz = foo();
baz();			// 2 这就是闭包
```

下面这两个也是闭包。

```js
function foo () {
    var a = 2;
    function baz () {
        console.log(a);
    }
    bar(baz);
}
function bar (fn) {
    fn();		// 这也是闭包
}

var fn;
function foo () {
    var a = 2;
    function baz () {
        console.log(a);
    }
    fn = baz;	// 将 baz 赋值给全局变量
}
function bar () {
    fn();		// 这也是闭包
}
foo();
bar();			// 2
```

在定时器、事件监听、ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步任务中，只要使用了**回调函数**，实际上就是在使用闭包！

这里是 [一道闭包网红面试题](https://segmentfault.com/a/1190000009711065)。

### 循环和闭包

来看一段代码：

```js
for (var i = 1; i <= 5; i++) {
    setTimeout(function timer () {
        console.log(i);
    }, i * 1000)
}
```

没错，结果是以每秒一次的频率输出5次6。

分析一下，以上代码试图在循环中的每隔迭代都捕获一个 i 的副本，尽管循环中5个函数是在各自的迭代中分别定义的，但是它们都被封闭在一个共享的全局作用域中，因此实际上只有一个 i 。

所以，我们需要再循环的每次迭代中使用一个闭包作用域。

```js
for (var i = 1; i <= 5; i++) {
    (function () {
        var j = i;
        setTimeout(function timer () {
            console.log(j);
        }, j * 1000)
    })()
}
```

改进一下：

```js
for (var i = 1; i <= 5; i++) {
    (function (j) {
        setTimeout(function timer () {
            console.log(j);
        }, j * 1000)
    })(i)
}
```

使用 IIFE 在每次迭代的时候都创建了一个新的作用域，其实就是每次迭代只需要一个块作用域。因此，可以通过 let 实现。

```js
for (var i = 1; i <= 5; i++) {
    let j = i;		// 块作用域
    setTimeout(function timer () {
        console.log(j);
    }, j * 1000)
}
// var i 只声明了一次，后面是给 i 赋值
```

for 循环头部的 let 声明还会有一个特殊的行为：变量（i）在循环中每次迭代都会被声明，使用上一个迭代的结果来初始化这个变量。

```js
for (let i = 1; i <= 5; i++) {
    setTimeout(function timer () {
        console.log(i);
    }, i * 1000)
}
/**
 * 相当于
 * let i = 1;
 * let i = 2;
 * let i = 3;
 * let i = 4;
 * let i = 5;
 */
```



### 模块

闭包的另一个用法就是**模块**。

```js
function Module () {
    var a = 'cool';
    var b = 'awesome';
    function bar () {
        console.log(a);
    }
    function foo () {
        console.log(b);
    }
    return { bar, foo }
}
```

模块总结为两点：

1. 外部封闭函数，该函数必须至少被调用一次
2. 封闭函数返回至少一个内部函数，形成闭包，且内部函数可以访问和修改私有变量

模块另一个简单但是强大的用法，命名**返回的对象**。

```js
var foo = (function Module (id) {
    function change () {
        // 修改公共的 API
        publicAPI.identify = identify2;
    } 
    function identify1 () {
        console.log(id);
    }
    function identify2 () {
        console.log(id.toUpperCase());
    }
    var publicAPI = {
        change,
        identify: identify1
    }
})('foo');
foo.identify();			// 'foo'
foo.change();			
foo.identify();			// 'FOO'
```

将要返回的对象（publicAPI）赋值给一个变量，在模块实例内部就可以保留对 publicAPI 的引用，就可以从内部对模块实例进行修改。

简单的介绍一个[模块实现](../js/concepts/模块.js)。



### 词法作用域和动态作用域

最后关于词法作用域和动态作用域的一点讨论：

它们的主要区别是，**词法作用域**是在写代码时（或者说定义时）定义的，而**动态作用域**是在运行时确定的。词法作用域关注函数在何处声明，动态作用域关注函数从何处调用。

JavaScript是词法作用域，因此下面代码输出的结果2而不是3！

```js
function foo () {
    console.log(a);			// 2
}
function bar () {
    var a = 3;
    foo ();
}
var a = 2;
bar ();
```

因为 foo 定义时，作用域是全局的。