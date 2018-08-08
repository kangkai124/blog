# 不定期更新的CSS奇淫技巧（一）

作者：[小小茂茂](https://juejin.im/user/5a66053d518825735300bd4d)

### 一、CSS写自适应大小的正方形

#### 代码：

```css
<style type="text/css">
以图片为例
background 写法
	.img{
		width: 100%;
		height: 0;
		padding-bottom: 100%;		//关键所在
		overflow: hidden;
		background:url(../res/images/haha.png) center/100% 100% no-repeat;
	}
	.img img{
		width: 100%;
	}
img 写法
	.img{
		position: relative;
		width: 100%;
		height: 0;
		padding-bottom: 100%;		//关键所在
		overflow: hidden;
	}
	.img img{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
</style>
<div class="img"></div>
```

#### 效果图：

![img](https://user-gold-cdn.xitu.io/2018/6/2/163c0f9afffa8124?imageslim)

#### 原理：

元素的`padding`的百分比值四个值均根据当前元素的宽度来计算的

`padding`只能取`top`或者`bottom`，自适应正方形其值要和宽一致，当然其他不同比例的矩形可以通过设置不同比例的padding就能得到

------

### 二、多列等高

#### 代码：

```css
<style type="text/css">
	.web_width{
		width: 100%;
		overflow: hidden;			//关键所在
	}
	.left{
		float: left;
		width: 20%;
		min-height: 10em;
		background: #66afe9;
		padding-bottom: 2000px;		//关键所在
		margin-bottom: -2000px;		//关键所在
	}
	.right{
		float: right;
		width: 80%;
		height: 20em;
		background: #f00;
	}
</style>
```

#### 效果图：

![img](https://user-gold-cdn.xitu.io/2018/6/2/163c0f9b015aeebe?imageslim)

#### 原理：

padding补偿法

在高度小的元素上加一个数值为正`padding-bottom`和一个数值为负`margin-bottom`，再在父级加上`overflow: hidden`隐藏子元素超出的`padding-bottom`

#### 注：

1. `padding-bottom、margin-bottom`之和要等于0（建议值不要太大，够用就行）
2. 代码中子元素单位用`em`是为了做gif效果更明显

（在我的笔记里面翻出来了，用这个解决了很多布局问题）

------

### 三、绘制三角形

#### 代码

```css
<style type="text/css">
.demo {
	width: 0;
	height: 0;
	border-left: 50px solid transparent;
	border-right: 50px solid transparent;
	border-bottom: 50px solid red;
}
</style>
```

#### 效果图：

![img](https://user-gold-cdn.xitu.io/2018/6/2/163c1107b52977e3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 原理：

利用盒模型中的`border`属性

#### 注：

1. 当盒模型的`width/height`为 0 时，`border` 边的形状是一个三角形，通过只设置三条边的 `border` ，并将所绘制的三角形相邻两边的 `border` 的颜色设置为 `transparent`, 最后通过调整`border-width`的比例绘制自己所需要的三角形

[绘制三角形详解地址](https://link.juejin.im/?target=https%3A%2F%2Fwww.cnblogs.com%2Fv-weiwang%2Fp%2F5057588.html)

------

### 四、隐藏滚动条（这个算比较无聊的，主要当时有个需求非要隐藏）

#### 代码

```css
<style type="text/css">
	* {
		margin: 0;
		padding: 0
	}

	section {
		width: 300px;
		height: 500px;
		margin: 20px auto;
		overflow: hidden;
	}

	div {
		width: calc(100% + 20px);
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}

	p {
		width: 100%;
		height: 200px;
		background: #999;
		overflow: hidden
	}
	p:nth-child(2n){
		background: #f60;
	}
</style>
<section>
	<div>
		<p>1</p>
		<p>2</p>
		<p>3</p>
		<p>4</p>
		<p>5</p>
	</div>
</section>
```

#### 效果图：

![img](https://user-gold-cdn.xitu.io/2018/6/2/163c133098f42e56?imageslim)

#### 原理：

父元素超出部分隐藏，将滚动元素的`width`超出父元素的`width`，从而达到隐藏滚动条

------

### 五、边框字体同色（2018.06.06）

#### 代码

```css
<style>
	#app {
		width: 200px;
		height: 200px;
		color: #000;
		font-size: 30px;

		/*方案一*/
		border: 50px solid currentColor;

		/*方案二*/
		border: 50px solid;
			/*或*/
		border-width: 50px;
		border-style: solid;
	}
</style>
```

#### 效果图：

![img](https://user-gold-cdn.xitu.io/2018/6/6/163d2c209eeb5fb5?imageslim)

#### 原理：

1. 方案一：CSS3 `currentColor` 表示当前的文字颜色
2. 方案二：`border` 的默认值 (initial) 就是 `currentColor`, 可以直接写成 `border: 50px solid`; 省掉 `color` 的值

[currentColor-CSS3超高校级好用CSS变量](https://link.juejin.im/?target=http%3A%2F%2Fwww.zhangxinxu.com%2Fwordpress%2F2014%2F10%2Fcurrentcolor-css3-powerful-css-keyword%2F)

------

### 六、显示节点的层次结构（2018.06.11）

这个可以说是真奇淫技巧了，话不多说，上菜

#### 代码：

```css
/*手动添加*/
* { background-color: rgba(255,0,0,.2); }
* * { background-color: rgba(0,255,0,.2); }
* * * { background-color: rgba(0,0,255,.2); }
* * * * { background-color: rgba(255,0,255,.2); }
* * * * * { background-color: rgba(0,255,255,.2); }
* * * * * * { background-color: rgba(255,255,0,.2); }

/*JS添加 在控制台运行*/
const m_style = document.createElement('style');
const m_style_text = '*{background-color:rgba(255,0,0,.2)}* *{background-color:rgba(0,255,0,.2)}* * *{background-color:rgba(0,0,255,.2)}* * * *{background-color:rgba(255,0,255,.2)}* * * * *{background-color:rgba(0,255,255,.2)}* * * * * *{background-color:rgba(255,255,0,.2)}';
m_style.appendChild(document.createTextNode(m_style_text));
document.getElementsByTagName('head')[0].appendChild(m_style)
```

#### 效果

![img](https://user-gold-cdn.xitu.io/2018/6/8/163de43f388f00db?imageslim)

#### 原理：CSS通配符选择器（`*`）选择器配合后代选择器

[无聊水知乎看到的——原文地址](https://link.juejin.im/?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F27432017%2Fanswer%2F40940542)

------

以上内容均来自于踩坑找方案的总结，不喜勿喷，谢谢合作

如有其它好用的小技巧欢迎评论区交流

注：评论区提到的小技巧等试验完毕后会加上，毕竟发文要用心，总不能随随便便就水经验，各位小哥哥小姐姐们不要捉急



> 原文地址：[https://juejin.im/post/5b12ae3de51d4506d73f0bb4](https://juejin.im/post/5b12ae3de51d4506d73f0bb4)
