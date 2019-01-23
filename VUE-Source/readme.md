
Vue API

全局配置（Vue.config）

Vue.config是一个与全局配置有关的对象，可以在启动应用之前修改下列属性。

1.silent

类型： Boolean 

取消Vue所有的日志和警告 

Vue.config.silent = false

2.optionMergeStrategies

类型：Function 

自定义合并策略的选项。 

合并策略选项分别接受第一个参数作为父实例，第二个参数为子实例，Vue实例上下文被作为第三个参数传入。

```
Vue.config.optionMergeStrategies._my_option = function(parent, child, vm) {
    return child + 1
}
const Profile = Vue.extend({
    _my_option: 1
})
```


关于自定义选项的混合策略： 

基础 

混合是一种灵活的分布式复用Vue组件的方式。混合对象可以包含任意组件选项(比如data，created，methods等等)。以组件使用混合对象时，所有混合对象的选项将被混入该组件本身的选项。 

例子：

```
// 定义一个混合对象
var myMixin = {
    created: function() {
        this.hello()
    },
    methods: {
        hello: function() {
            console.log('hello from mixin')
        }
    }
}

// 定义一个使用混合对象的组件
var Component = Vue.extend({
    mixins: [myMixin]
})

var component = new Component()

```

选项合并 

当组件和混合对象含有同名选项时，这些选项将以恰当的方式混合。比如，同名钩子函数将混合为一个数组，因此都将被调用。另外，混合对象的钩子将在组件自身钩子之前调用：

```

var mixin = {
    created: function() {
        console.log('混合对象的钩子被调用')
    }
}
new Vue({
    mixins: [mixin],
    created: function() {
        console.log('组件钩子被调用')
    }
})

// '混合对象的钩子被调用'
// '组件钩子被调用'

```

值为对象的选项，例如methods，components和directives，将被混合为同一对象。两个对象键名冲突时，取组件对象的键值对。

```

var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}
var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

```

全局混合 

也可以全局混合对象。但是，一旦使用全局混合对象，将会影响到所有之后创建的Vue实例。使用恰当时，可以为自定义对象注入处理逻辑。

```
// 为自定义的选项 'myOption' 注入一个处理器。 
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})
new Vue({
  myOption: 'hello!'
})
// -> "hello!"
```

自定义选项混合策略 

自定义选项将使用默认策略，即简单地覆盖已有值。如果想染自定义选项以自定义逻辑混合，可以向Vue.config.optionMergeStrategies 添加一个函数：

```
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal

```


devtools

类型：Boolean 

配置是否允许vue-devtools检查代码，开发版本默认为true，生产版本则是false

// 务必在加载 Vue 之后，立即同步设置以下内容
> Vue.config.devtools = true


errorHandler

类型：Function 

指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和Vue实例。

```
Vue.config.errorHandler = function (err, vm) {
  // handle error
}

```

ignoredElements

类型： Array 

须使Vue忽略在Vue之外的自定义元素，否则，它会假设你忘记注册全局组件或者拼错了组件名称，从而抛出一个关于Unknown custom element的警告。

```

Vue.config.ignoredElements = [
  'my-custom-web-component', 'another-web-component'
]

```

keyCodes

类型： { [key: string]: number | Array } 

给 v-on自定义键位别名。

```

Vue.config.keyCodes = {
  v: 86,
  f1: 112,
  mediaPlayPause: 179,
  up: [38, 87]
}

```


全局API

Vue.extend(options)

使用基础Vue构造器，创建一个子类。参数是一个包含了组件选项的对象。 

data选项时特例，需要注意，在Vue.extend()中它必须是函数

```
<div id="mount-point"></div>

// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point')

```

Vue.nextTick（[callback, context]）

在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM。

```
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
})

```

Vue.set(object, key，value)

设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法用于避开Vue不能检测属性被添加的限制。

Vue.delete(object, key)

删除对象的属性

Vue.directive(id, [definition])

注册或获取全局指令。

```

// 注册
Vue.directive('my-directive', {
  bind: function () {},
  inserted: function () {},
  update: function () {},
  componentUpdated: function () {},
  unbind: function () {}
})
// 注册（传入一个简单的指令函数）
Vue.directive('my-directive', function () {
  // 这里将会被 `bind` 和 `update` 调用
})
// getter，返回已注册的指令
var myDirective = Vue.directive('my-directive')

```

Vue.filter（id,[definition]）

注册或获取全局过滤器

```
// 注册
Vue.filter('my-filter', function(value) {
    // 返回处理后的值
})

// getter，返回已注册的过滤器
var myFilter = Vue.filter('my-filter')

```


Vue.component(id,[definition])

注册或获取全局组件。注册还会自动使用给定的id设置组件的名称。

// 注册组件，传入一个扩展过的构造器

Vue.component('my-component', Vue.extend({/*..*/}))

// 注册组件，传入一个选项对象（自动调用Vue.extend）

Vue.component('my-component', {/*..*/})

// 获取注册的组件（始终返回构造器）

var MyComponent = Vue.component('my-component')


Vue.use(plugin)

安装Vue.js插件。如果插件是一个对象，必须提供install方法。如果插件是一个函数，它会被作为install方法。 

当 install方法被同一插件多次调用，插件将只会被安装一次。

Vue.mixin(mixin)

全局注册一个混合，影响注册之后所有创建的每个Vue实例

Vue.compile(template)

在render函数中编译模板字符串。只在独立构建时有效

```
var res = Vue.compile('<div><span>{{ msg }}</span></div>')
new Vue({
  data: {
    msg: 'hello'
  },
  render: res.render,
  staticRenderFns: res.staticRenderFns
})
```


选项/数据

data

该使用的响应数据最好一开始就声明。
 
以_或$开头的属性不会被Vue实例代理，比如vm._a就不行，必须用

```
vm.$data._a。
var data = { a: 1 }
// 直接创建一个实例
var vm = new Vue({
  data: data
})
vm.a // -> 1
vm.$data === data // -> true
// Vue.extend() 中 data 必须是函数
var Component = Vue.extend({
  data: function () {
    return { a: 1 }
  }
})

```


注意，不能对data属性使用箭头函数

props

props可以是数组或对象，用于接收来自父组件的数据。props可以是简单的数组，或者使用对象作为替代，对象允许配置高级选项，如类型检测、自定义检验或设置默认值。

```
// 简单语法
Vue.component('props-demo-simple', {
  props: ['size', 'myMessage']
})
// 对象语法，提供校验
Vue.component('props-demo-advanced', {
  props: {
    // 只检测类型
    height: Number,
    // 检测类型 + 其他验证
    age: {
      type: Number,
      default: 0,
      required: true,
      validator: function (value) {
        return value >= 0
      }
    }
  }
})

```


computed

```
var vm = new Vue({
  data: { a: 1 },
  computed: {
    // 仅读取，值只须为函数
    aDouble: function () {
      return this.a * 2
    },
    // 读取和设置
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
vm.aPlus   // -> 2
vm.aPlus = 3
vm.a       // -> 2
vm.aDouble // -> 4

```


methods

```
var vm = new Vue({
  data: { a: 1 },
  methods: {
    plus: function () {
      this.a++
    }
  }
})
vm.plus()
vm.a // 2

```


watch

```

var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 深度 watcher
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    }
  }
})
vm.a = 2 // -> new: 2, old: 1

```


选项/DOM

el

提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。可以是 CSS 选择器，也可以是一个 HTMLElement 实例。 
在实例挂载之后， 元素可以用 vm.$el 访问。

template

一个字符串模板作为 Vue 实例的标识使用。模板将会 替换 挂载的元素。挂载元素的内容都将被忽略，除非模板的内容有分发 slot。

如果值以 # 开始，则它用作选项符，将使用匹配元素的 innerHTML 作为模板。常用的技巧是用

render

字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。render 函数接收一个 createElement 方法作为第一个参数用来创建 VNode。

选项/生命周期钩子

选项/资源

directives

filters

components

选项/杂项

parent

类型： Vue instance 

指定已创建的实例之父实例，在两者之间建立父子关系。子实例可以用this.$parent访问父实例，而子实例被推入父实例的$children数组中。
 
同时使用$parent和$children有冲突，他们作为同一个入口。 

更推荐使用props和events实现父子组件通信。

mixins

extends

允许声明扩展另一个组件，组件自身的选项会比要扩展的源组件具有更高的优先级。

```

var CompA = { ... }
// 在没有调用 Vue.extend 时候继承 CompA
var CompB = {
  extends: CompA,
  ...
}

```

实例属性

vm.$data

vm.$el

vm.$options

用于当前Vue实例的初始化选项。需要在选项中包含自定义属性时会有用处。

vm.$parent

vm.$root

vm.$children

vm.$slots

vm.$refs

vm.$isServer

实例方法/数据

vm.$watch

vm.$set

vm.$delete

实例方法/事件

vm.$on(event, callback)

参数： 

{string} event 

{Function} callback 

监听当前实例上的自定义事件。事件可以由vm.$emit触发。回调函数会接收所有传入事件触发函数的额外参数。

```
vm.$on('test', function (msg) {
  console.log(msg)
})
vm.$emit('test', 'hi')
// -> "hi"

```

vm.$once(event, callback)

监听一个自定义事件，只触发一次，触发后移除监听器

vm.$off([event, callback])

参数： 

event：string 

callback：function 

用法： 

如果没有提供参数，则移除所有的事件监听器； 

如果只提供了事件，则移除该事件的所有监听器； 

如果同时提供了两个参数，则只移除这个回调的监听器。

vm.$emit(event, […args])

触发当前实例上的某事件，并传参数给监听器回调

实例方法/生命周期

vm.$mount

如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例。

如果没有提供 elementOrSelector 参数，模板将被渲染为文档之外的的元素，并且你必须使用原生DOM API把它插入文档中。

这个方法返回实例自身，因而可以链式调用其它实例方法。

```
var MyComponent = Vue.extend({
  template: '<div>Hello!</div>'
})
// 创建并挂载到 #app (会替换 #app)
new MyComponent().$mount('#app')
// 同上
new MyComponent({ el: '#app' })
// 或者，在文档之外渲染并且随后挂载
var component = new MyComponent().$mount()
document.getElementById('app').appendChild(component.$el)

```


vm.$forceUpdate

迫使Vue实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

vm.$nextTick

将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。

vm.$destroy

完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。

指令

v-text

更新元素的 textContent。如果要更新部分的 textContent ，需要使用 {{ Mustache }} 插值。

```
<span v-text="msg"></span>
<!-- 和下面的一样 -->
<span>{{msg}}</span>

```

v-show

根据表达式之真假值，切换元素的 display CSS 属性。 

当条件变化时该指令触发过渡效果。

v-if

根据表达式的值的真假条件渲染元素。在切换时元素及它的数据绑定 / 组件被销毁并重建。如果元素是 <template> ，将提出它的内容作为条件块。 
当条件变化时该指令触发过渡效果。

v-else

不需要表达式

限制： 前一兄弟元素必须有 v-if 或 v-else-if。

```
<div v-if="Math.random() > 0.5">
  Now you see me
</div>
<div v-else>
  Now you don't
</div>

```

v-else-if

类型: any

限制: 前一兄弟元素必须有 v-if 或 v-else-if。

```
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>

```

v-for

类型： Array | Object | number | string

```

<div v-for="(item, index) in items"></div>
<div v-for="(val, key) in object"></div>
<div v-for="(val, key, index) in object"></div>


```
v-for 默认行为试着不改变整体，而是替换元素。迫使其重新排序的元素,您需要提供一个 key 的特殊属性:

```
<div v-for="item in items" :key="item.id">
  {{ item.text }}
</div>

```

v-pre
跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。

> <span v-pre>{{ this will not be compiled }}</span>


v-cloak

不会显示，直到关联实例结束编译

v-once

只渲染一次。

内置的组件

transition-group

Props：

tag - string, 默认为 span

move-class - 覆盖移动过渡期间应用的 CSS 类。

除了 mode，其他特性和 <transition> 相同。


事件：

事件和 <transition> 相同.


用法：

<transition-group>元素作为多个元素/组件的过渡效果。<transition-group> 渲染一个真实的 DOM 元素。默认渲染 <span>，可以通过 tag 属性配置哪个元素应该被渲染。

注意，每个<transition-group>的子节点必须有 独立的key ，动画才能正常工作

<transition-group> 支持通过 CSS transform 过渡移动。当一个子节点被更新，从屏幕上的位置发生变化，它将会获取应用 CSS 移动类（通过 name 属性或配置 move-class 属性自动生成）。如果 CSS transform 属性是“可过渡”属性，当应用移动类时，将会使用 FLIP 技术 使元素流畅地到达动画终点。

```
<transition-group tag="ul" name="slide">
  <li v-for="item in items" :key="item.id">
    {{ item.text }}
  </li>
</transition-group>
```



参考链接：https://blog.csdn.net/heliumlau/article/details/70182966