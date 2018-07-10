# mpvue 踩坑笔记

一直想写个小程序，前段时间发现 mpvue 这个框架，可以用 vue 写小程序。简直开心，因为 leader 是个忠实的 react 迷弟，所以 mpvue 的出现同时满足我练手 vue 和小程序的需求，*笑容逐渐失控.jpg*。

项目的搭建神马的就不说了，可以看 [这篇介绍](https://imkk.asia/react-vue/) 或者 [mpvue 官网](http://mpvue.com/)。

emmmm.....那个，下面就是我自己练手时遇到的坑：

## 1. 小程序的事件 bind 需要替换为 @

比如用户登录：

```html
<button open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="onGotUserInfo">获取用户信息</button>
```

在 mpvue 中就需要替换为：

```html
<button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">获取用户信息</button>
```

## 2. mpvue 不支持自定义指令 directives

场景是这样，页面中间有个输入框，点击之后跑到顶部，然后让输入框获取焦点。vue 中很常见的解决方式是定义一个自定义指令，但是发现 mpvue 不支持。所以我的解决方法是在 data 中添加一个变量，通过改变这个变量的值来控制输入框的焦点。

```vue
<template>
	<input
        :focus="focus"
        :disabled="!canInput"
        v-model="text"
        @click="onInputClick"
        @focus="onTextFocus"
        @blur="onTextBlur" />
</template>
<script>
    export default {
        data () {
            return {
                text: '',
                canInput: false,
                focus: false,
            }
        },
        methods: {
            onTextFocus () {
                this.focus = true
            },
            onTextBlur () {
                this.focus = false
            },
            onInputClick () {
                if (!this.canInput) {
                    this.canInput = true
                    setTimeout(() => {
                        this.focus = true
                    }, 200)
                }
            },
		}
    }
</script>

```

可能有同学问，为什么要手动控制获焦呢，点击的时候让输入框自己获取焦点不就行了嘛。

因为在这个场景下，点击之后会有个 0.2s 的动画从页面中间跑到顶部，如果让输入框自己获取焦点，那么点击的一瞬间输入框会出现光标，然后 0.2s 后输入框移动到顶部，这个过程就会有种卡顿的感觉。

## 3. 对 dom 使用 ref，返回 undefined

这个场景是有个列表，以卡片的形式水平依次排开，用户可以左右滑动查看。首先想到的就是 [swiper4中文网](http://www.swiper.com.cn/api/index.html)，但是初始化的时候就GG了，因为无法使用 ref 获取 dom。去 issue 页了解到 v1.0.9 后支持子组件的引用，但对 dom 的支持意愿不大。然后就用了微信小程序提供的 swiper 组件代替。

```vue
<template>
	<div ref="swiper" class="swiper-container" id="swiper1">....<div>
</template>
<script>
    export default {
        mounted () {
            console.log(this.$refs.swiper)
            // undefined
        }
    }
</script>
```

## 4. v-for 用在组件上刷新的问题

场景是这样，调接口拿到数据列表数组赋值给 data 中的一个变量 list，循环渲染 `<ListItem />` 组件。然后接口数据改变，即 list 也跟着改变，但是子组件内部却没有改变。

```vue
<template>
	<div class="list">
      <ListItem :key="item.id" v-for="item in list" :item="item"/>
    </div>
</template>
<script>
    export default {
        data () {
            list: []
        },
        methods: {
            async getList () {
                const list = await get(...)
                this.list = list
            }
        }
    }
</script>
// ListItem 组件
<template>
  <div>
    {{item.value}}
  </div>
</template>
<script>
    export default {
        props: ['item'],
        updated () {
            console.log(this.item)
        }
    }
</script>
```

在 ListItem 组件的 `updated` 生命周期里打印父组件传来的数据，发现没有更新，还是上一次的数据。这个问题出现的原因研究了很久也没有找到（菜- -），然后试着把循环放到 ListItem 里，这个问题就解决了。

```vue
<template>
	<div class="list" v-if="list.length > 0">
      <ListItem :list="list" :query="text" />
    </div>
</template>

// ListItem
<template>
  <div class="list-container">
    <div
      class="list-item"
      v-for="item in list"
      :key="item.id">
      {{item.value}}
    </div>
  </div>
</template>
```

如果有遇到过这种问题的同学或者解了的大神，求讨论。。。

## 5.  无法通过 methods 返回值在 html中赋值

如下赋值在 mpvue 中是行不通的。

```vue
<template>
	<div id="example">
      <p>Original message: "{{ message }}"</p>
      <p>Computed reversed message: "{{ reversedMessage }}"</p>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                message: 'hello mpvue'
            }
        },
        methods: {
            reversedMessage () {
                return this.message.split('').reverse().join('')
            }
        }
    }
</script>
```

所以这种情况还是要用 computed 来赋值。

但是在循环中，需要根据情况来修改赋值，用 computed 就不好实现，然后 methods 赋值又不支持，所以想了个曲线的实现方式：methods + watch。

```vue
<template>
  <div>
    <h2>
      <span
        :class="{highlight: item.color}"
        :key="i"
        v-for="(item, i) in scKey">{{item.text}}</span>
    </h2>
    <p>
      <span
        :class="{highlight: item.color}"
        :key="i"
        v-for="(item, i) in content">{{item.text}}</span>
    </p>
  </div>
</template>
<script>
export default {
  props: ['item', "query"],
  data () {
    return {
      scKey: [],
      content: []
    }
  },
  mounted () {
    this.getScKey()
    this.getContent()
  },
  watch: {
    item () {
      console.log('watch')
      this.getScKey()
      this.getContent()
    }
  },
  methods: {
    getScKey () {
      // 一顿操作
      this.scKey = [ ... ]
    },
    getContent () {
      // 二顿操作
      this.content = [ ...]
    }
  }
}
</script>
```



以上就是我最近尝试 mpvue 遇到的比较大的坑，如有不对的地方、或者同学们有更好的解法，欢迎谈论交流，笔芯🤓😁。