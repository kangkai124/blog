# vue权限路由实现方式总结

## 使用全局路由守卫

### 实现

前端定义好路由，并且在路由上标记相应的权限信息

```
const routerMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'page',
      component: () => import('@/views/permission/page'),
      name: 'pagePermission',
      meta: {
        title: 'pagePermission',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'directive',
      component: () => import('@/views/permission/directive'),
      name: 'directivePermission',
      meta: {
        title: 'directivePermission'
        // if do not set roles, means: this page does not require permission
      }
    }]
  }]
复制代码
```

全局路由守卫每次都判断用户是否已经登录，没有登录则跳到登录页。已经登录(已经取得后台返回的用户的权限信息(角色之类的))，则判断当前要跳转的路由，用户是否有权限访问(根据路由名称到全部路由里找到对应的路由，判断用户是否具备路由上标注的权限信息(比如上面的`roles: ['admin', 'editor']`))。没有权限则跳到事先定义好的界面(403,404之类的)。

这种方式，菜单可以直接用路由生成(用户没有权限的菜单也会显示，点击跳转的时候才做权限判断)，也可以在用户登录后根据用户权限把路由过滤一遍生成菜单(菜单需要保存在vuex里)。

> 目前[iview-admin](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fiview%2Fiview-admin%2Fblob%2Fdev%2Fsrc%2Frouter%2Findex.js)还是用的这种方式

### 缺点

- 加载所有的路由，如果路由很多，而用户并不是所有的路由都有权限访问，对性能会有影响。
- 全局路由守卫里，每次路由跳转都要做权限判断。
- 菜单信息写死在前端，要改个显示文字或权限信息，需要重新编译
- 菜单跟路由耦合在一起，定义路由的时候还有添加菜单显示标题，图标之类的信息，而且路由不一定作为菜单显示，还要多加字段进行标识

## 登录页与主应用分离

针对前一种实现方式的缺点，可以将登录页与主应用放到不同的页面(不在同一个vue应用实例里)。

### 实现

登录成功后，进行页面跳转(真正的页面跳转，不是路由跳转)，并将用户权限传递到主应用所在页面，主应用初始化之前，根据用户权限筛选路由，筛选后的路由作为vue的实例化参数，而不是像前一种方式所有的路由都传递进去，也不需要在全局路由守卫里做权限判断了。

### 缺点

- 需要做页面跳转，不是纯粹的单页应用
- 菜单信息写死在前端，要改个显示文字或权限信息，需要重新编译
- 菜单跟路由耦合在一起，定义路由的时候还有添加菜单显示标题，图标之类的信息，而且路由不一定作为菜单显示，还要多加字段进行标识

## 使用`addRoutes`动态挂载路由

`addRoutes`允许在应用初始化之后，动态的挂载路由。有了这个新姿势，就不用像前一种方式那样要在应用初始化之要对路由进行筛选。

### 实现

应用初始化的时候先挂载不需要权限控制的路由，比如登录页，404等错误页。

有个问题，`addRoutes`应该何时调用，在哪里调用

登录后，获取用户的权限信息，然后筛选有权限访问的路由，再调用`addRoutes`添加路由。这个方法是可行的。但是不可能每次进入应用都需要登录，用户刷新浏览器又要登陆一次。

所以`addRoutes`还是要在全局路由守卫里进行调用

```
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
复制代码
```

关键的代码如下

```
if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
复制代码
```

> 上面的代码就是[vue-element-admin](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2FPanJiaChen%2Fvue-element-admin)的实现

### 缺点

- 全局路由守卫里，每次路由跳转都要做判断
- 菜单信息写死在前端，要改个显示文字或权限信息，需要重新编译
- 菜单跟路由耦合在一起，定义路由的时候还有添加菜单显示标题，图标之类的信息，而且路由不一定作为菜单显示，还要多加字段进行标识

## 菜单与路由分离，菜单由后端返回

菜单的显示标题，图片等需要随时更改，要对菜单做管理功能。

后端直接根据用户权限返回可访问的菜单。

### 实现

前端定义路由信息(标准的路由定义，不需要加其他标记字段)。

```
{
    name: "login",
    path: "/login",
    component: () => import("@/pages/Login.vue")
}
复制代码
```

name字段都不为空，需要根据此字段与后端返回菜单做关联。

做菜单管理功能的时候，一定要有个字段与前端的路由的name字段对应上(也可以是其他字段，只要菜单能找到对应的路由或者路由能找到对应的菜单就行)，并且做唯一性校验。菜单上还需要定义权限字段，可以是一个或多个。其他信息，比如显示标题，图标，排序，锁定之类的，可以根据实际需求进行设计。

![img](https://user-gold-cdn.xitu.io/2018/7/28/164dfe8dcf86273a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

还是在全局路由守卫里做判断

```
function hasPermission(router, accessMenu) {
  if (whiteList.indexOf(router.path) !== -1) {
    return true;
  }
  let menu = Util.getMenuByName(router.name, accessMenu);
  if (menu.name) {
    return true;
  }
  return false;

}

Router.beforeEach(async (to, from, next) => {
  if (getToken()) {
    let userInfo = store.state.user.userInfo;
    if (!userInfo.name) {
      try {
        await store.dispatch("GetUserInfo")
        await store.dispatch('updateAccessMenu')
        if (to.path === '/login') {
          next({ name: 'home_index' })
        } else {
          //Util.toDefaultPage([...routers], to.name, router, next);
          next({ ...to, replace: true })//菜单权限更新完成,重新进一次当前路由
        }
      }  
      catch (e) {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
          next()
        } else {
          next('/login')
        }
      }
    } else {
      if (to.path === '/login') {
        next({ name: 'home_index' })
      } else {
        if (hasPermission(to, store.getters.accessMenu)) {
          Util.toDefaultPage(store.getters.accessMenu,to, routes, next);
        } else {
          next({ path: '/403',replace:true })
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login')
    }
  }
  let menu = Util.getMenuByName(to.name, store.getters.accessMenu);
  Util.title(menu.title);
});

Router.afterEach((to) => {
  window.scrollTo(0, 0);
});

复制代码
```

上面代码是[vue-quasar-admin](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fwjkang%2Fvue-quasar-admin)的实现。因为没有使用`addRoutes`,每次路由跳转的时候都要判断权限，这里的判断也很简单，因为菜单的name与路由的name是一一对应的,而后端返回的菜单就已经是经过权限过滤的，所以如果根据路由name找不到对应的菜单，就表示用户有没权限访问。

如果路由很多，可以在应用初始化的时候，只挂载不需要权限控制的路由。取得后端返回的菜单后，根据菜单与路由的对应关系，筛选出可访问的路由，通过`addRoutes`动态挂载。

### 缺点

- 菜单需要与路由做一一对应，前端添加了新功能，需要通过菜单管理功能添加新的菜单，如果菜单配置的不对会导致应用不能正常使用
- 全局路由守卫里，每次路由跳转都要做判断

## 菜单与路由完全由后端返回

菜单由后端返回是可行的，但是路由由后端返回呢？看一下路由的定义

```
{
    name: "login",
    path: "/login",
    component: () => import("@/pages/Login.vue")
}
复制代码
```

后端如果直接返回

```
{
    "name": "login",
    "path": "/login",
    "component": "() => import('@/pages/Login.vue')"
}
复制代码
```

这是什么鬼，明显不行。`() => import('@/pages/Login.vue')`这代码如果没出现在前端，webpack不会对`Login.vue`进行编译打包

### 实现

前端统一定义路由组件，比如

```
const Home = () => import("../pages/Home.vue");
const UserInfo = () => import("../pages/UserInfo.vue");
export default {
  home: Home,
  userInfo: UserInfo
};
复制代码
```

将路由组件定义为这种key-value的结构。

后端返回格式

```
[
      {
        name: "home",
        path: "/",
        component: "home"
      },
      {
        name: "home",
        path: "/userinfo",
        component: "userInfo"
      }
]
复制代码
```

在将后端返回路由通过`addRoutes`动态挂载之间，需要将数据处理一下，将component字段换为真正的组件。

至于菜单与路由是否还要分离，怎么对应，可以根据实际需求进行处理。

如果有嵌套路由，后端功能设计的时候，要注意添加相应的字段。前端拿到数据也要做相应的处理。

### 缺点

- 全局路由守卫里，每次路由跳转都要做判断
- 前后端的配合要求更高

## 不使用全局路由守卫

前面几种方式，除了`登录页与主应用分离`,每次路由跳转，都在全局路由守卫里做了判断。

### 实现

应用初始化的时候只挂载不需要权限控制的路由

```
const constRouterMap = [
  {
    name: "login",
    path: "/login",
    component: () => import("@/pages/Login.vue")
  },
  {
    path: "/404",
    component: () => import("@/pages/Page404.vue")
  },
  {
    path: "/init",
    component: () => import("@/pages/Init.vue")
  },
  {
    path: "*",
    redirect: "/404"
  }
];
export default constRouterMap;
复制代码
```

```
import Vue from "vue";
import Router from "vue-router";
import ConstantRouterMap from "./routers";

Vue.use(Router);

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: ConstantRouterMap
});
复制代码
```

登录成功后跳到`/`路由

```
submitForm(formName) {
      let _this=this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.$store.dispatch("loginByUserName",{
            name:_this.ruleForm2.name,
            pass:_this.ruleForm2.pass
          }).then(()=>{
            _this.$router.push({
              path:'/'
            })
          })
        } else {
          
          return false;
        }
      });
    }
复制代码
```

因为当前没有`/`路由，会跳到`/404`

```
<template>
  <h1>404</h1>
</template>
<script>
export default {
  name:'page404',
  mounted(){
    if(!this.$store.state.isLogin){
      this.$router.replace({ path: '/login' });
      return;
    }
    if(!this.$store.state.initedApp){
       this.$router.replace({ path: '/init' });
       return
    }
  }
}
</script>
复制代码
```

404组件里判断已经登录，接着判断应用是否已经初始化(用户权限信息，可访问菜单，路由等是否已经从后端取得)。没有初始化则跳转到`/init`路由

```
<template>
  <div></div>
</template>
<script>
import { getAccessMenuList } from "../mock/menus";
import components from "../router/routerComponents.js";
export default {
  async mounted() {
    if (!this.$store.state.isLogin) {
      this.$router.push({ path: "/login" });
      return;
    }
    if (!this.$store.state.initedApp) {
      const loading = this.$loading({
        lock: true,
        text: "初始化中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let menus = await getAccessMenuList(); //模拟从后端获取
      var routers = [...menus];
      for (let router of routers) {
        let component = components[router.component];
        router.component = component;
      }
      this.$router.addRoutes(routers);
      this.$store.dispatch("setAccessMenuList", menus).then(() => {
        loading.close();
        this.$router.replace({
          path: "/"
        });
      });
      return;
    } else {
      this.$router.replace({
        path: "/"
      });
    }
  }
};
</script>

复制代码
```

init组件里判断应用是否已经初始化(避免初始化后，直接从地址栏输入地址再次进入当前组件)。

如果已经初始化，跳转`/`路由(如果后端返回的路由里没有定义次路由，则会跳转404)。

没有初始化，则调用远程接口获取菜单和路由等，然后处理后端返回的路由，将component赋值为真正 的组件，接着调用`addRoutes`挂载新路由，最后跳转`/`路由即可。菜单的处理也是在此处，看实际 需求。

> [实现例子](https://link.juejin.im/?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fr02zvvlpno)

### 缺点

- 在404页面做了判断，感觉比较怪异
- 多引入了一个init页面组件

## 总结

比较推荐后面两种实现方式。



> 原文：[https://juejin.im/post/5b5bfd5b6fb9a04fdd7d687a](https://juejin.im/post/5b5bfd5b6fb9a04fdd7d687a)

