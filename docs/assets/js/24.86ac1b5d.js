(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{170:function(e,t,a){"use strict";a.r(t);var r=a(0),s=Object(r.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content"},[a("h2",{attrs:{id:"当初要是看了这篇，react高阶组件早会了"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#当初要是看了这篇，react高阶组件早会了","aria-hidden":"true"}},[e._v("#")]),e._v(" 当初要是看了这篇，React高阶组件早会了")]),a("blockquote",[a("p",[e._v("作者： 大转转FE/邹存洋")]),a("p",[e._v("mp.weixin.qq.com/s/_zQZ4Gg9WIG-3byL_p13QA")])]),a("h4",{attrs:{id:"概况："}},[a("a",{staticClass:"header-anchor",attrs:{href:"#概况：","aria-hidden":"true"}},[e._v("#")]),e._v(" 概况：")]),a("h4",{attrs:{id:"什么是高阶组件？"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#什么是高阶组件？","aria-hidden":"true"}},[e._v("#")]),e._v(" 什么是高阶组件？")]),a("blockquote",[a("p",[e._v("高阶部件是一种用于复用组件逻辑的高级技术，它并不是 React API的一部分，而是从React 演化而来的一种模式。 具体地说，高阶组件就是一个接收一个组件并返回另外一个新组件的函数！")])]),a("p",[e._v("这是官方文档说的，我没有截全，因为后面的解释会造成误解，但简单讲高阶组件（函数）就好比一个加工厂，同样的，屏幕、cpu、扬声器、电池，小米手机工厂组装完就是小米手机，魅族手机组装完就是魅族手机，基本材料都是相同的，不同工厂（高阶组件）有不同的实现及产出，当然这个工厂（高阶组件）也可能是针对某个基本材料的处理。 总之产出的结果拥有了输入组件不具备的功能，输入的组件可以是一个组件的实例，也可以是一个组件类，还可以是一个无状态组件的函数。")]),a("h4",{attrs:{id:"解决什么问题？"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#解决什么问题？","aria-hidden":"true"}},[e._v("#")]),e._v(" 解决什么问题？")]),a("p",[e._v("随着项目越来越复杂，开发过程中，多个组件需要某个功能，而且这个功能和页面并没有关系，所以也不能简单的抽取成一个新的组件，但是如果让同样的逻辑在各个组件里各自实现，无疑会导致重复的代码。比如页面有三种弹窗一个有title，一个没有，一个又有右上角关闭按钮，除此之外别无它样，你总不能整好几个弹窗组件吧，这里除了tilte,关闭按钮其他的就可以做为上面说的基本材料。")]),a("hr"),a("h4",{attrs:{id:"高阶组件总共分为两大类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#高阶组件总共分为两大类","aria-hidden":"true"}},[e._v("#")]),e._v(" 高阶组件总共分为两大类")]),a("ul",[a("li",[e._v("代理方式")])]),a("ol",[a("li",[e._v("操纵prop")]),a("li",[e._v("访问ref（不推荐）")]),a("li",[e._v("抽取状态")]),a("li",[e._v("包装组件")])]),a("ul",[a("li",[e._v("继承方式")])]),a("ol",[a("li",[e._v("操纵生命周期")]),a("li",[e._v("操纵prop")])]),a("h4",{attrs:{id:"代理方式之-操纵prop"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#代理方式之-操纵prop","aria-hidden":"true"}},[e._v("#")]),e._v(" 代理方式之 操纵prop")]),a("h6",{attrs:{id:"删除prop"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#删除prop","aria-hidden":"true"}},[e._v("#")]),e._v(" 删除prop")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("import React from 'react'function HocRemoveProp(WrappedComponent) {  return class WrappingComPonent extends React.Component {    render() {      const { user, ...otherProps } = this.props;      return <WrappedComponent {...otherProps} />    }  }}export default HocRemoveProp;\n")])])]),a("h6",{attrs:{id:"增加prop"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#增加prop","aria-hidden":"true"}},[e._v("#")]),e._v(" 增加prop")]),a("p",[e._v("接下来我把简化了写法，把匿名函数去掉，同时换成箭头函数")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("import React from 'react'const HocAddProp = (WrappedComponent，uid) =>  class extends React.Component {    render() {      const newProps = {        uid,      };      return <WrappedComponent {...this.props}  {...newProps}  />    }  }export default HocAddProp;\n")])])]),a("p",[e._v("上面HocRemoveProp高阶组件中，所做的事情和输入组件WrappedComponent功能一样，只是忽略了名为user的prop。也就是说，如果WrappedComponent能处理名为user的prop,这个高阶组件返回的组件则完全无视这个prop。")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const { user, ...otherProps } = this.props;\n")])])]),a("p",[e._v("这是一个利用es6语法技巧，经过上面的语句，otherProps里面就有this.props中所有的字段除了user. 假如我们现在不希望某个组件接收user的prop,那么我们就不要直接使用这个组件，而是把这个组件作为参数传递给HocRemoveProp，然后我们把这个函数的返回结果当作组件来使用 两个高阶组件的使用方法：")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const  newComponent = HocRemoveProp(SampleComponent);const  newComponent = HocAddProp(SampleComponent,'1111111');\n")])])]),a("p",[e._v("也可以利用decorator语法糖这样使用")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("import React, { Component } from 'React';@HocRemoveProp class SampleComponent extends Component {render() {}}export default SampleComponent;\n")])])]),a("h4",{attrs:{id:"代理方式之-抽取状态"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#代理方式之-抽取状态","aria-hidden":"true"}},[e._v("#")]),e._v(" 代理方式之 抽取状态")]),a("p",[e._v("将所有的状态的管理交给外面的容器组件，这个模式就是 抽取状态 外面的容器就是这个高阶组件")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const HocContainer = (WrappedComponent) =>  class extends React.Component {    constructor(props) {      super(props)      this.state = {        name: ''      }    }    onNameChange = (event) => {      this.setState({        name: event.target.value      })    }    render() {      const newProps = {        name: {          value: this.state.name,          onChange: this.onNameChange        }      }      return <WrappedComponent {...this.props} {...newProps} />    }  }\n@HocContainerclass SampleComponent extends React.Component {  render() {    return <input name=\"name\" {...this.props.name}/>  }}\n")])])]),a("p",[e._v("这样当我们在使用这个已经被包裹的input组件（SampleComponent）时候 它的值就被放在了HocContainer高阶组件中，当很多这样的input组件都用这个HocContainer高阶组件时，那么它们的值都将保存在这个HocContainer高阶组件中")]),a("h4",{attrs:{id:"代理方式之-包装组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#代理方式之-包装组件","aria-hidden":"true"}},[e._v("#")]),e._v(" 代理方式之 包装组件")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const HocStyleComponent = (WrappedComponent, style) =>  class extends React.Component {    render() {      return (        <div style={style}>          <WrappedComponent {...this.props} {...newProps} />        </div>      )    }  }\n")])])]),a("p",[e._v("这样使用")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("import HocStyleComponent from  './HocStyleComponent';const colorSytle ={color:'#ff5555'}const  newComponent = HocStyleComponent(SampleComponent, colorSytle);\n")])])]),a("p",[e._v("-代理方式的生命周期的过程类似于堆栈调用:")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("didmount 一> HOC didmount 一>(HOCs didmount) 一>(HOCs will unmount) 一>HOC will unmount一>unmount\n")])])]),a("h4",{attrs:{id:"在说继承方式之前先看一个例子"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#在说继承方式之前先看一个例子","aria-hidden":"true"}},[e._v("#")]),e._v(" 在说继承方式之前先看一个例子")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const MyContainer = (WrappedComponent) =>  class extends WrappedComponent {    render() {      return super.render();    }  }\n")])])]),a("p",[e._v("这个例子很简单，相当于把WrappedComponent组件的render方法，")]),a("p",[e._v("通过super.render()方法吐到了MyContainer 中，可以顺序调用。")]),a("p",[e._v("继承方式的生命周期的过程类似队列调用:")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("didmount 一> HOC didmount 一>(HOCs didmount) 一>will unmount一>HOC will unmount一> (HOCs will unmount)\n")])])]),a("ol",[a("li",[e._v("代理方式下WrappedComponent会经历一个完整的生命周期，产生的新组件和参数组件是两个不同的组件，一次渲染，两个组件都会经历各自的生命周期")]),a("li",[e._v("而在继承方式下，产生的新组件和参数组件合二为一，super.render只是生命周期中的函数，变成一个生命周期。")])]),a("p",[e._v("来看下面的例子你就会明白了。")]),a("h4",{attrs:{id:"继承方式之-操纵生命周期-渲染劫持"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#继承方式之-操纵生命周期-渲染劫持","aria-hidden":"true"}},[e._v("#")]),e._v(" 继承方式之 操纵生命周期(渲染劫持)")]),a("p",[e._v("首先创建一个高阶，在创建一个使用高阶组件的组件，也就是是输入组件，最后我在改变这个输入组件props")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("import * as React from 'react';const HocComponent = (WrappedComponent) =>  class MyContainer extends WrappedComponent {    render() {      if (this.props.time && this.state.success) {        return super.render()      }      return <div>倒计时完成了...</div>    }  }\n")])])]),a("p",[e._v("这个高阶组件会直接读取输入组件中的props,state,然后控制了输入组件的render展示 只有在props.time和state.success同时为真的时候才会展示")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("import * as React from 'react';import HocComponent from './HocComponent'@HocComponentclass DemoComponent extends React.Component {  constructor(props) {    super(props);   this.state = {    success: true,   }; }  render() {    return   <div>我是一个组件</div>  }} export default DemoComponent;\n")])])]),a("p",[e._v("然后调用，递减time数值直到变为0最后页面的效果就是，当然他不是循环的。先展示”我是一个组件“，我设置了两秒，之后展示”倒计时完成“")]),a("p",[a("img",{attrs:{src:"https://mmbiz.qpic.cn/mmbiz_gif/T81bAV0NNNibuOtNsFhnTeL7UiaaLS75W9x3Hv2Stb43iap58TJa2PAB4dTqYYTYvchqrhgfXtavHAibK6KvFIyHVA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1",alt:"img"}})]),a("p",[e._v("由此可以看出高阶组件也可以控制state")]),a("p",[e._v("但是最好要限制这样做，可能会让WrappedComponent组件内部状态变得一团糟。建议可以通过重新命名state，以防止混淆。")]),a("h4",{attrs:{id:"继承方式之-操纵prop"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#继承方式之-操纵prop","aria-hidden":"true"}},[e._v("#")]),e._v(" 继承方式之 操纵prop")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const HOCPropsComponent = (WrappedComponent) =>  class extends WrappedComponent {    render() {      const elementsTree = super.render();      let newProps = {        color: (elementsTree && elementsTree.type === 'div') ? '#fff' : '#ff5555'      };      const props = Object.assign({}, elementsTree.props, newProps)      const newElementsTree = React.cloneElement(elementsTree, props, elementsTree.props.children)      return newElementsTree    }  }\n")])])]),a("p",[e._v("这样就传入了新的props")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("React.cloneElement( element, [props], [...children])参数：TYPE（ReactElement），[PROPS（object）]，[CHILDREN（ReactElement）\n")])])]),a("p",[e._v("克隆并返回一个新的 ReactElement ，新返回的元素会保留有旧元素的 props、ref、key，也会集成新的 props。")]),a("h5",{attrs:{id:"还有一个方式，在传递props上有着强于高阶组件的优势不用关心命名，"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#还有一个方式，在传递props上有着强于高阶组件的优势不用关心命名，","aria-hidden":"true"}},[e._v("#")]),e._v(" 还有一个方式，在传递props上有着强于高阶组件的优势不用关心命名，")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("class addProps extends React.Component {  render() {    const newProps = 'uid'    return this.props.children(newProps)  }} \n")])])]),a("p",[e._v("使用方式")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("<addProps>{   (argument) => <div>{argument}</div>}</addProps>\n")])])]),a("p",[e._v("感觉很方便，但是每次渲染都会重新定义一个新的函数，如果不想的话就不要定义匿名函数，")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("showUid(argument) {    return <div>{argument}</div>}\n")])])]),a("h5",{attrs:{id:"彩蛋recompose库"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#彩蛋recompose库","aria-hidden":"true"}},[e._v("#")]),e._v(" 彩蛋recompose库")]),a("p",[e._v("recompose是一个很流行的库，它提供了很多很有用的高阶组件（小工具），而且也可以优雅的组合它们。")]),a("h6",{attrs:{id:"step-1-扁平props"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#step-1-扁平props","aria-hidden":"true"}},[e._v("#")]),e._v(" Step 1 扁平props.")]),a("p",[e._v("我们有这样一个组件")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const Profile = ({ user }) => ( <div>     <div>Username: {user.username}</div>      <div>Age: {user.age}</div> </div> )\n")])])]),a("p",[e._v("如果想要改变组件接口来接收单个 prop 而不是整个用户对象，可以用 recompose 提供的高 阶组件 flattenProp 来实现。")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const Profile = ({ username，age }) => ( <div>     <div>Username: {username}</div>      <div>Age: {age}</div> </div> )\n")])])]),a("p",[e._v("const ProfileWithFlattenUser = flattenProp('user')(Profile)； 现在我们希望同时使用多个高阶组件：一个用于扁平化处理用户 prop，另一个用于重命名用 户对象的单个 prop。 此时 recompose 库提供的 compose 函数就派上用场了。")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const enhance = compose( flattenProp('user'), renameProp('username', 'name') )\n")])])]),a("p",[e._v("然后按照以下方式将它应用于原有组件：")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v(" const EnhancedProfile = enhance(Profile)\n")])])]),a("p",[e._v("还可以将 compose 函数用 在我们自己的高阶组件上，甚至结合使用都可以：")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const enhance = compose(  flattenProp('user'),  renameProp('username', 'name'),  withInnerWidth )\n")])])]),a("h6",{attrs:{id:"step-2-提取输入表单的state"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#step-2-提取输入表单的state","aria-hidden":"true"}},[e._v("#")]),e._v(" Step 2 提取输入表单的State")]),a("p",[e._v("我们将从Recompose库中使用withStateHandlers高阶组件。 它将允许我们将组件状态与组件本身隔离开来。 我们将使用它为电子邮件，密码和确认密码字段添加表单状态，以及上述字段的事件处理程序。")]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('import { withStateHandlers, compose } from "recompose";const initialState = {  email: { value: "" },  password: { value: "" },  confirmPassword: { value: "" }};const onChangeEmail = props => event => ({  email: {    value: event.target.value,    isDirty: true  }});const onChangePassword = props => event => ({  password: {    value: event.target.value,    isDirty: true  }});const onChangeConfirmPassword = props => event => ({  confirmPassword: {    value: event.target.value,    isDirty: true  }});const withTextFieldState = withStateHandlers(initialState, {  onChangeEmail,  onChangePassword,  onChangeConfirmPassword});export default withTextFieldState;\n')])])]),a("p",[e._v("withStateHandlers它接受初始状态和包含状态处理程序的对象。调用时，每个状态处理程序将返回新的状态。")]),a("p",[e._v("好了，很辛苦也很感谢你能看到这里，关于recompose介绍就到这里了，喜欢的朋友可以深入研究recompose其它的方法和源码。")]),a("p",[e._v("不准确的地方欢迎拍砖")])])}],!1,null,null,null);t.default=s.exports}}]);