# 不定期更新的CSS奇淫技巧（二）

作者：[小小茂茂](https://juejin.im/user/5a66053d518825735300bd4d)

拖更很久，各位小哥哥、小姐姐别介意，今天本来会死在襁褓（草稿待了一个月）中的 不定期更新的CSS奇淫技巧（二）终于出来了，本文可能会水份居多，如有问题欢迎提议我会逐步榨干它

### 七、CSS 绝对底部

#### 代码：

```css
方案一：原理————正（padding）负（margin）抵消法
<style>
* {
    margin: 0;
    padding: 0;
}
body {
    height: 100vh;
}
#wrap {
    height: auto;
    min-height: 100%;
}
#main {
    padding-bottom: 150px; /* 和footer相同的高度 */
}  
#footer {
    margin-top: -150px; /* footer高度的负值 */
    height: 150px;
	background: #0c8ed9
}
</style>

<div id="wrap">
    <div id="main">正文</div>
</div>
<div id="footer">底部</div> <!--底部和外层同级-->

方案二：原理———— flex 布局
<style>
* {
    margin: 0;
    padding: 0;
}
#wrap {
    display: flex;
    flex-flow: column;
    min-height: 100vh;
}
#main {
    flex:1;
}  
#footer {
    height: 150px;
	background: #0c8ed9
}
</style>
<div id="wrap">
    <div id="main">正文</div>
    <div id="footer">底部</div>
</div>
```

#### 效果图

![CSS 绝对底部](https://user-gold-cdn.xitu.io/2018/7/31/164f10e7deb2a94e?imageslim)

### 八、多边框

#### 先上效果图

![`border + outline` （伪元素） 方案](https://user-gold-cdn.xitu.io/2018/8/7/16513085cc086ccd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 方案一：`border + outline` （伪元素） 方案

##### 代码：

```css
<style>
* {
    padding: 0;
    margin: 0;
}
body {
    margin: 150px;
}
.one-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 310px;
    height: 310px;
}
/*
 * 由于使用伪元素和 outline 制作的边框是脱离文档流的，建议再套一个 div 并使用水平垂直居中 防止影响其他样式
 */
.one {
    width: 150px;
    height: 150px;
    position: relative;
    background-color: #999;
    border: 10px double #ff0000;
    outline: 10px solid rgb(255, 136, 0);
    outline-offset: 0px; /* 控制 outline 的偏移位置 */
}
.one::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    bottom: -40px;
    left: -40px;
    z-index: -1;
    background-color: #f7fc00;
    background-clip: content-box; /* 当使用伪元素的背景做为边框时需要使用该属性控制背景的区域 */
    border: 10px dashed rgb(56, 252, 8);
    outline: 10px inset rgb(3, 194, 252);
}
.one::after {
    content: '';
    position: absolute;
    top: -70px;
    right: -70px;
    bottom: -70px;
    left: -70px;
    z-index: -2;
    background-color: #fc000d;
    background-clip: content-box; /* 当使用伪元素的背景做为边框时需要使用该属性控制背景的区域 */
    border: 10px dotted rgb(56, 252, 8);
    outline: 10px outset rgb(252, 3, 177);
}
</style>
<div class="one-box">
    <div class="one">方案一</div>
</div>
```

##### 特点

1. `outline` 不受 `border-radius` 影响（可以制作出一种方边框一种圆角边框）
2. `outline` 和 `border` 一样可以 [自定义边框样式](https://link.juejin.im/?target=http%3A%2F%2Fwww.w3school.com.cn%2Fcssref%2Fpr_outline-style.asp)
3. 可以通过 `outline-offset`控制 outline 的位置
4. 边框数量有限（加上 `::before / ::after` 的 `background / border / outline` 最多 8 种边框）

#### 方案二：[`box-shadow`](https://link.juejin.im/?target=http%3A%2F%2Fwww.w3cplus.com%2Fcontent%2Fcss3-box-shadow) 方案

##### 代码：

```css
<style>
* {
    padding: 0;
    margin: 0;
}
body {
    margin: 150px;
}
.two {
    width: 150px;
    height: 150px;
    padding: 110px;
    background-color: #999;
    box-shadow:inset 0 0 0 10px #ff0000,
               inset 0 0 0 20px rgb(255, 136, 0),
               inset 0 0 0 30px rgb(166, 255, 0),
               inset 0 0 0 40px rgb(0, 102, 255),
               inset 0 0 0 50px rgb(255, 0, 221),
               inset 0 0 0 60px rgb(0, 255, 191),
               inset 0 0 0 70px rgb(225, 0, 255),
               inset 0 0 0 80px rgb(81, 255, 0),
               inset 0 0 0 90px rgb(255, 0, 106),
               inset 0 0 0 100px rgb(255, 153, 0),
               inset 0 0 0 110px rgb(30, 255, 0);
    /*
     *对象选择器 {box-shadow:投影方式 X轴偏移量 Y轴偏移量 阴影模糊半径 阴影扩展半径 阴影颜色}
     */
}
</style>
<div class="two"></div>
```

##### 特点

1. 边框样式单一
2. 可以制作渐变边框
3. 可以制作圆角边框
4. 边框数量不像方案一有限制

#### 使用建议：

需要两种边框、多样式边框时可以优先使用方案一，需要渐变边框、多层边框可以使用方案二，虽说方案一使用伪元素后可以高达8种边框，但是样式代码众多，不太建议，当然具体使用情况各位小哥哥、小姐姐可以根据实际需求，也可以结合方案一和方案二制作多边框

感谢 [@Vinsea](https://link.juejin.im/?target=https%3A%2F%2Fjuejin.im%2Fuser%2F5b19d785e51d4506e1749a92) 的提议

### 九、BFC

#### 什么是 BFC

[W3C 定义](https://link.juejin.im/?target=https%3A%2F%2Fwww.w3.org%2FTR%2FCSS2%2Fvisuren.html%23block-formatting)：浮动，绝对定位元素，inline-blocks, table-cells, table-captions,和overflow的值不为visible的元素，（除了这个值已经被传到了视口的时候）将创建一个新的块级格式化上下

#### 产生条件

1. `float` 的值不为 `none`
2. `position` 的值不为 `static` 或者 `relative`
3. `display` 的值为 `table-cell`, `table-caption`, `inline-block`, `flex`, 或者 `inline-flex` 中的其中一个
4. `overflow` 的值不为 `visible`
5. `display:flow-root`: 最安全无副作用的做法 （但是 [兼容](https://link.juejin.im/?target=https%3A%2F%2Fcaniuse.com%2F%23search%3Dflow-root) 头疼）

![img](https://user-gold-cdn.xitu.io/2018/8/7/165132477ed787db?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 特性

1. 内部的Box会在垂直方向，从顶部开始一个接一个地放置。
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生叠加
3. 每个元素的margin box的左边， 与包含块border
4. box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
5. BFC的区域不会与float box叠加。
6. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。
7. 计算BFC的高度时，浮动元素也参与计算

#### 使用场景

1. 用于清除浮动，计算BFC高度

```
ul {
    overflow: hidden; /*创建 BFC */
}
li {
    float: left;
    width: 100px;
    height: 200px;
    background-color: #f7fc00;
    overflow: hidden;
}
li:first-child{
    background-color: #fc000d;
}
</style>
<ul>
    <li></li>
    <li></li>
</ul>
```

1. 自适应两栏布局

```html
<style>
.aside {
    width: 100px;
    height: 150px;
    float: left;
    background: #ff0000;
}
.main {
    height: 200px;
    background: #f7fc00;
    overflow: hidden; /*创建 BFC */
}
</style>
<div class="aside"></div>
<div class="main"></div>
```

1. 解决margin叠加问题

篇幅有限 想了解更多可以去 [w3cplus BFC 详解](https://link.juejin.im/?target=https%3A%2F%2Fwww.w3cplus.com%2Fblog%2Ftags%2F389.html)

感谢 [@百草园](https://link.juejin.im/?target=https%3A%2F%2Fjuejin.im%2Fuser%2F5b1c8e0de51d455c6e0acdcc) 的提议

### 十、新一代变量骚操作（ CSS 自定义属性）

#### 效果图

不好意思又是音乐播放器的图，只因为喜欢听音乐

![效果图](https://user-gold-cdn.xitu.io/2018/7/20/164b81f0efceb29a?imageslim)

#### 代码（我在音乐播放器中的使用）

1. 根元素设置全局自定义属性

```css
:root {
	--THEME: var(--USER-THEME-COLOR, #e5473c);
	--THEME-COLOR: var(--USER-THEME-COLOR, #e5473c);
}
```

1. 将全局自定义属性设置为 `SASS` 变量

```scss
$theme-color: var(--THEME);
$theme-bg: var(--THEME);
```

- 为什么使用 `SASS` 变量做为自定义属性的载体
- 1. 方便管理（统一的var.scss文件编写主题变量）
- 1. 避免直接修改全局自定义属性

1. JS 修改全局自定义属性

```js
const elm = document.documentElement
const colorArr = ['#e5473c', '#31c27c', '#0c8ed9', '#f60']
elm.style.setProperty('--USER-THEME-COLOR', colorArr[i])
i = (i + 1) % colorArr.length
```

更多介绍 ==> [CSS自定义属性使用指南](https://link.juejin.im/?target=https%3A%2F%2Fwww.w3cplus.com%2Fcss%2Fcss-custom-properties-strategy-guide.html)

[效果图Github地址](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fmaomao1996%2Freact-music)

[音乐播放器展示地址](https://link.juejin.im/?target=http%3A%2F%2Freactmusic.mtnhao.com%2F)

### 十一、PNG 格式小图标的 CSS 任意颜色赋色技术

#### 代码：

```cssc
<style>
.icon-color{
	display: inline-block;
	width: 144px;
	height: 144px;
	background: url('https://user-gold-cdn.xitu.io/2018/7/31/164f0e6745afe2ba?w=144&h=144&f=png&s=2780') no-repeat center / cover;
	overflow: hidden;
}
.icon-color:after{
	content: '';
	display: block;
	height: 100%;
	transform: translateX(-100%);
	background: inherit;
	filter: drop-shadow(144px 0 0 #42b983); // 需要修改的颜色值
}
</style>

<i class="icon-color"></i>
```

#### 效果图

![PNG 格式小图标的 CSS 任意颜色赋色技术](https://user-gold-cdn.xitu.io/2018/7/31/164f0edd59324934?imageslim)

#### 原理：

使用 `CSS3` 滤镜 `filter` 中的 `drop-shadow`。

1. `drop-shadow` 滤镜可以给元素或图片非透明区域添加投影
2. 将背景透明的 PNG 图标施加一个不带模糊的投影，就等同于生成了另外一个颜色的图标
3. 再通过 `overflow:hidden` 和位移处理将原图标隐藏

PS：我测试过大部分设备还是可行的，不过我写的 [deom (react 版音乐播放器)](https://link.juejin.im/?target=http%3A%2F%2Freactmusic.mtnhao.com) 涉及众多奇淫技巧，所以还是不做参考

[原文地址：高产的张鑫旭大佬](https://link.juejin.im/?target=https%3A%2F%2Fwww.zhangxinxu.com%2Fwordpress%2F2016%2F06%2Fpng-icon-change-color-by-css%2F)

### 感谢

> [张鑫旭的个人主页](https://link.juejin.im/?target=https%3A%2F%2Fwww.zhangxinxu.com)
>
> [w3cplus_引领web前沿，打造前端精品教程](https://link.juejin.im/?target=https%3A%2F%2Fwww.w3cplus.com%2F)

### Tips

当各位遇到布局问题的时候可以去各大 `UI` 框架翻你要实现的效果的代码，看看他们是如何解决的，我遇到样式布局的坑基本就这样整，除非特别罕见的一般都能这样解决。

> 原文地址：[https://juejin.im/post/5b607a0b6fb9a04fd260aa70](https://juejin.im/post/5b607a0b6fb9a04fd260aa70)
