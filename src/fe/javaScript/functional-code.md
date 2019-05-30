# 谈谈我对函数式编程的思考

今天在公司内部听月影讲[《如何写“好” JavaScript》](https://ppt.baomitu.com/d/760c9ae7)，其中重点提到了函数式编程，听完之后很有感想，于是写一篇文章来谈谈我对函数式编程的理解

对前面的例子不感兴趣的同学可以直接拉到最后看结论。

聊函数式编程前，先看几个高阶函数的例子，月影的PPT中也是从高阶函数讲起的

## 高阶函数

### 执行一次

```js
block.onclick = function (evt) {
  block.onclick = null;
  evt.target.className = 'hide';
  setTimeout(function () {
    document.body.removeChild(block);
  }, 2000);
};
```

这样这个 `block` 的点击事件只能生效一次，有些同学可能还会写出下面的代码实现同样的功能

```js
let clicked = false;
block.onclick = function (evt) {
  if (clicked === false) {
    clicked = true
    evt.target.className = 'hide';
    setTimeout(function () {
      document.body.removeChild(block);
    }, 2000);
  }
};
```

月影说写出这样代码的同学是要被开除的。😂😂😂

使用高阶函数实现：

```js
function once (fn) {
  return function (...args) {
    if (fn) {
      let ret = fn.apply(this, args);
      fn = null;
      return ret;
    }
  }
}

block.onclick = once(function (evt) {
  console.log('hide');
  evt.target.className = 'hide';
  setTimeout(function () {
    document.body.removeChild(block);
  }, 2000);
});
```

[点我可以看demo](https://code.h5jun.com/buzi/2/edit?js,output)

把**执行一次**的功能抽象成一个高阶函数 `once`，然后把原始功能函数传入 `once` 得到一个新的功能函数，新的功能函数只能执行一次。

### 节流

节流的意思是不管函数调用的速度有多快，函数执行最多n毫秒执行一次（调用一次后n毫秒内不在执行）

例如用鼠标快速点击按钮：

```js
function throttle (fn, time = 500) {
  let timer;
  return function (...args) {
    if (timer == null) {
      fn.apply(this,  args);
      timer = setTimeout(() => {
        timer = null;
      }, time)
    }
  }
}

btn.onclick = throttle(function (e) {
  circle.innerHTML = parseInt(circle.innerHTML) + 1;
  circle.className = 'fade';
  setTimeout(() => circle.className = '', 250);
});
```

[点我可以看demo](https://code.h5jun.com/gale/1/edit?js,output)

可以看出 **节流** 和 **点击一次** 是同一个逻辑，将 **节流** 抽象成高阶函数 `throttle`，然后把原始功能函数传入 `throttle` 得到一个新的功能函数，新的功能函数具有节流的功能。

### 连击

连击效果类似直播送礼物一个礼物送了多次的那个效果，[查看DEMO](https://code.h5jun.com/bucu/3/edit?js,output)

```js
function consumer (fn, time) {
  let tasks = [],
      timer;
  
  return function (...args) {
    tasks.push(fn.bind(this, ...args));
    if (timer == null) {
      timer = setInterval(() => {
        tasks.shift().call(this)
        if (tasks.length <= 0) {
          clearInterval(timer);
          timer = null;
        }
      }, time)
    }
  }
}

btn.onclick = consumer((evt) => {
  let t = parseInt(count.innerHTML.slice(1)) + 1;
  count.innerHTML = `+${t}`;
  count.className = 'hit';
  let r = t * 7 % 256,
      g = t * 17 % 128,
      b = t * 31 % 128;
  
  count.style.color = `rgb(${r},${g},${b})`.trim();
  setTimeout(() => {
    count.className = 'hide';
  }, 500);
}, 800)
```

**连击** 其实也是在 **节流** 的基础上加工一下

好了高阶函数先说到这，从上面三个例子可以看出，高阶函数就是一个函数return了另一个函数，用月影的话来说就是：**它们自身输入函数或返回函数，被称为高阶函数**

## 函数式编程

看完了高阶函数的几个例子后，在看几个函数式编程的例子：

### Toggle

```js
switcher.onclick = function (evt) {
  if (evt.target.className === 'on') {
    evt.target.className = 'off';
  } else {
    evt.target.className = 'on';
  }
}
```

[点我查看DEMO](https://code.h5jun.com/tuda/2/edit?js,output)

使用函数式实现：

```js
function toggle (...actions) {
  return function (...args) {
    let action = actions.shift();
    actions.push(action);
    return action.apply(this, args);
  }
}

switcher.onclick = toggle(
  evt => evt.target.className = 'off',
  evt => evt.target.className = 'on'
);
```

[点我查看DEMO](https://code.h5jun.com/nal/3/edit?js,output)

用函数式实现后扩展性强了很多，比如说三态：

```js
function toggle (...actions) {
  return function (...args) {
    let action = actions.shift();
    actions.push(action);
    return action.apply(this, args);
  }
}

switcher.onclick = toggle(
  evt => evt.target.className = 'warn',
  evt => evt.target.className = 'off',
  evt => evt.target.className = 'on'
);
```

[点我查看DEMO](https://code.h5jun.com/foqo/2/edit?js,output)

使用函数式方式实现可以实现N多态，而不需要改动代码，抽象的很完美

### 批量操作

```js
function batch (fn) {
  return function (target, ...args) {
    if (target.length >= 0) {
      return Array.from(target).map(item => fn.apply(this, [item, ...args]));
    } else {
      return fn.apply(this, [target, ...args]);
    }
  }
}

function setColor (el, color) {
  el.style.color = color;
}

function setFontSize (el, fontSize) {
  el.style.fontSize = fontSize;
}

setColor = batch(setColor);
setFontSize = batch(setFontSize);

let items1 = document.querySelectorAll('ul > li:nth-child(2n + 1)');
let items2 = document.querySelectorAll('ul > li:nth-child(3n + 1)');

setColor(items1, 'red');
setColor(items2, 'green');
setFontSize(items2, '22px');
```

[点我查看DEMO](https://code.h5jun.com/naco/2/edit?js,output)

这个例子有两个功能单一的函数 `setColor` 和 `setFontSize`，然后写了一个高阶函数 `batch`，将原始功能函数传入高阶函数 `batch` 里，然后返回一个函数可以支持批量操作的功能

基于这个例子在加工一下：

### 可查询

```js
function batch (fn) {
  return function (target, ...args) {
    if (target.length >= 0) {
      return Array.from(target).map(item => fn.apply(this, [item, ...args]));
    } else {
      return fn.apply(this, [target, ...args]);
    }
  }
}

function queriable (fn) {
  return function (selector, ...args) {
    if (typeof selector === 'string') {
      selector = document.querySelectorAll(selector);
    }
    return fn.apply(this, [selector, ...args]);
  }
}

function setColor (el, color) {
  el.style.color = color;
}

function setFontSize (el, fontSize) {
  el.style.fontSize = fontSize;
}

setColor = queriable(batch(setColor));
setFontSize = queriable(batch(setFontSize));

setColor('ul > li:nth-child(2n + 1)', 'red');
setColor('ul > li:nth-child(3n + 1)', 'green');
setFontSize('ul > li:nth-child(3n + 1)', '22px');
```

[点我查看DEMO](https://code.h5jun.com/luc/2/edit?js,output)

这个例子新增了一个高阶函数 `queriable`，实现了查询功能。将 `batch` 传入 `queriable` 后生成一个新函数支持查询功能。

在加工一下：

### 打包

```js
function batch (fn) {
  return function (target, ...args) {
    if (target.length >= 0) {
      return Array.from(target).map(item => fn.apply(this, [item, ...args]));
    } else {
      return fn.apply(this, [target, ...args]);
    }
  }
}

function queriable (fn) {
  return function (selector, ...args) {
    if (typeof selector === 'string') {
      selector = document.querySelectorAll(selector);
    }
    return fn.apply(this, [selector, ...args]);
  }
}

function pack (map) {
  return function (el, obj) {
    for (let key in obj) {
      map[key].call(this, el, obj[key]);
    }
  }
}

function setColor (el, color) {
  el.style.color = color;
}

function setFontSize (el, fontSize) {
  el.style.fontSize = fontSize;
}

let css = pack({color: setColor, fontSize: setFontSize});
css = queriable(batch(css));

css('ul > li:nth-child(2n + 1)', {color: 'red'});
css('ul > li:nth-child(3n + 1)', {color: 'green', fontSize: '22px'});
```

[点我查看DEMO](https://code.h5jun.com/gelo/2/edit?js,output)

这个例子又新增了一个高阶函数 `pack`，将功能单一的函数通过对象的方式传入到 `pack` 后生成了新函数，新函数可以接受对象类型的值来设置颜色和字体大小。

最后在加工一下：

### 链式调用

```js
function batch (fn) {
  return function (target, ...args) {
    if (target.length >= 0) {
      return Array.from(target).map(item => fn.apply(this, [item, ...args]));
    } else {
      return fn.apply(this, [target, ...args]);
    }
  }
}

function queriable (fn) {
  return function (selector, ...args) {
    if (typeof selector === 'string') {
      selector = document.querySelectorAll(selector);
    }
    return fn.apply(this, [selector, ...args]);
  }
}

function pack (map) {
  return function (el, obj) {
    for (let key in obj) {
      map[key].call(this, el, obj[key]);
    }
  }
}

function methodize (fn, prop) {
  return function (...args) {
    fn.apply(null, [prop ? this[prop] : this, ...args]);
    return this;
  }
}

function setColor (el, color) {
  el.style.color = color;
}

function setFontSize (el, fontSize) {
  el.style.fontSize = fontSize;
}

function setText (el, text) {
  el.innerHTML = text;
}

let css = pack({color: setColor, fontSize: setFontSize});
css = queriable(batch(css));

let text = queriable(batch(setText));

function E (selector) {
  this._selector = selector;
}

E.prototype.css = methodize(css, '_selector');
E.prototype.text = methodize(text, '_selector');

function $(selector){
  return new E(selector);
}

$('ul > li:nth-child(2n + 1)').css({color: 'red'}).text('abc');
$('ul > li:nth-child(3n + 1)').css({color: 'green', fontSize: '22px'});
```

这个例子新增了一个高阶函数 `methodize`，函数中的 `return this` 很关键，这个函数主要的功能就是使用 `return this`，来实现链式调用。

## 我对函数式编程的理解

前面写了那么多例子，看起来复杂，但其实我反而觉得很简单，因为在我的眼里，函数式编程其实就是无数个高阶函数组装在一起完成一个很复杂的功能。

而这些高阶函数我把它理解成下面这张图的样子：

[![函数式编程](https://camo.githubusercontent.com/ce15319154a510ee50f5b69a8c15a7b1f3c2197f/687474703a2f2f70312e7168696d672e636f6d2f743031653463306565303937636664333664362e706e67)](https://camo.githubusercontent.com/ce15319154a510ee50f5b69a8c15a7b1f3c2197f/687474703a2f2f70312e7168696d672e636f6d2f743031653463306565303937636664333664362e706e67)

你会发现，当滚球兽一步一步进化到战斗暴龙兽之后，它已经具备了 `pack`，`batch`，`queriable`，`methodize` 这些高阶函数所提供的所有功能。

所以简单来说，就是可以把 `pack`，`batch`，`queriable`，`methodize` 理解成类似于中间件、插件，或者 webpack中的loader（webpack 中的loader也是前一个loader的处理结果丢给下个loader继续处理），例如我手里拿着一个最原始的功能函数，比如 `setColor`，先丢给pack处理生成一个新函数，然后把处理后的新函数在丢给 `batch` 以此类推

**简单说就是上一个高阶函数的输出是下一个高阶函数的输入，而这个输出和输入不仅仅是数据，也可以是函数**

所以函数式编程，抽象的过程很重要，例如哪些逻辑是需要抽象成高阶函数的。还有就是玩参数，如果在自己的业务当中使用函数式编程的话，我觉得保证上一个函数的输出丢到下一个函数的输入是否能正常工作是一个需要注意的事。

理解了我说的内容，在回到文章的开头把这些例子重新看一遍，你会发现好像世界都不一样了。

我对函数式编程也不是特别的精，目前还在研究阶段，，，，，

*声明：如果您觉得我理解的不对，请大佬指点~*