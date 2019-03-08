2.prop-types基础入门
 
2.1首先你需要通过在终端npm install prop-types安装一个叫prop-types的第三方包
 
2.2然后通过下面的写法对你的某一个组件的props中的变量进行类型检测：

```
yourComponent.propTypes = {
    属性1：属性1的变量类型，
    属性2：属性2的变量类型
    //...
}
```

3.propTypes的使用全解
 
3.1利用propTypes检测全部数据类型的变量

```
  import React from 'react'
  class Son extends React.Component{

  render(){
    return (<div style ={{padding:30}}>
              {this.props.number}
              <br/>
              {this.props.array}
              <br/>
              {this.props.boolean.toString()}
            </div>)
           }
}
class Father extends React.Component{
   render(){
     return (<Son
              number = {'1'}
              array = {'[1,2,3]'}
              boolean = {'true'}
              />)
            }
}

```

 
比如这个例子，我们通过props从父组件向子组件传递属性，你原本试图通过number，array和boolean这三个属性分别向Son中传递一个数字，数组和一个布尔型数值，但由于你刚一下子追完了50多集《人民的名义》，导致你过度疲惫，把它们都写成了字符串，虽然渲染是正常的，但这可能会导致你接下来调用一些方法的时候发生错误，而系统并不提供任何提示。
 
让我们给它加上propTypes的类型检测：
 
```
import React from 'react'
import PropTypes from 'prop-types';
class Son extends React.Component{
   render(){
        return (<div style ={{padding:30}}>
                      {this.props.number}
                      <br/>
                      {this.props.array}
                      <br/>
                      {this.props.boolean.toString()}
                    </div>)
                  }
}
Son.propTypes = {
        number:PropTypes.number,
        array:PropTypes.array,
        boolean:PropTypes.bool
}
class Father extends React.Component{
    render(){
         return (<Son
                       number = {'1'}
                       array = {'[1,2,3]'}
                       boolean = {'true'}
                        />)
                  }
}
```
 
然后我们就能看到报的错误了，而且这个时候，报的错误包括错误的props属性名称，错误的变量类型，属性所在的组件名称，预期的正确的变量类型，错误代码的位置以及其他更详细的信息。
 
这种“人为控制”的报错比一般的系统报错看起来应该要亲切自然得多吧...你大可以说：这个error是我“私人定制”的呦 （//▽//）

 
propTypes 能用来检测全部数据类型的变量，包括基本类型的的string，boolean,number,以及引用类型的object,array,function,甚至还有ES6新增的symbol类型
 
```
Son.propTypes = {
     optionalArray: PropTypes.array,//检测数组类型
     optionalBool: PropTypes.bool,//检测布尔类型
     optionalFunc: PropTypes.func,//检测函数（Function类型）
     optionalNumber: PropTypes.number,//检测数字
     optionalObject: PropTypes.object,//检测对象
     optionalString: PropTypes.string,//检测字符串
     optionalSymbol: PropTypes.symbol,//ES6新增的symbol类型
}
```

 
【注意】下面这些是从官方英文文档里引用过来的，你大概能够注意到，五种基本类型中的undefined和null并不在此列，propTypes类型检测的缺憾之一是，对于undefined和null的值，它无法捕捉错误
 
让我们把上述实例中的Father组件传递给Son组件修改一下,改成：
 
```
class Father extends React.Component{
    render(){
       return (<Son
                 number = {null}
                 array = {null}
                 boolean = {null}
                />)
             }
}
```
 
结果是输出台不报任何错误，（当然你改成undefined也是同样效果）。
 

3.2 通过oneOfType实现多选择检测——可规定多个检测通过的数据类型
 
上个例子中类型检测的要求是一个变量对应一个数据类型，也就是规定的变量类型只有一个。那么怎样能让它变得灵活一些，比如规定多个可选的数据类型都为检测通过呢？PropTypes里的oneOfType方法可以做到这一点，oneOfType方法接收参数的是一个数组，数组元素是你希望检测通过的数据类型。
 
```
import React from 'react'
import PropTypes from 'prop-types';
class Son extends React.Component{
   render(){
     return (<div style ={{padding:30}}>
                    {this.props.number}
                 </div>)
              }
}
Son.propTypes = {
       number:PropTypes.oneOfType(
           [PropTypes.string,PropTypes.number]
         )
}
class Father extends React.Component{
    render(){
         //分别渲染数字的11和字符串的11
        return (<div>
                      <Son number = {'字符串11'}/>
                      <Son number = {11}/>
                    </div>)
                }
}
```
 
这时候，因为在类型检测中，number属性的规定类型包括字符串和数字两种，所以此时控制台无报错
 
当然，如果你改为number = {数组或其他类型的变量}，那么这时就会报错了

3.3 通过oneOf实现多选择检测——可规定多个检测通过的变量的值
 
3.2是规定了多个可检测通过的数据类型，那么同样的道理，我们也可以规定多个可检测通过的变量的值，这就要用到PropTypes里的oneOf方法，和PropTypes方法一样oneOf方法接收参数的是一个数组，数组元素是你希望检测通过的变量的值，比如我们把上面类型检测的部分改成：

```

Son.propTypes = {
    number:PropTypes.oneOf(
          [12,13]
      )
}
 
```


 
3.4 arrayOf,objectOf实现多重嵌套检测
 
试想一下，如果我们检测的是基本类型的变量，那么这自然是很简单的，但当我们要检测的是一个引用类型的变量呢？当我们除了检测这个变量是否符合规定的引用类型外（Object/array），还想要进一步检测object中的属性变量或array中数组元素的数据类型时，单靠上面的方法已经不能满足要求了。这时候就要用到PropTypes的arrayOf，objectOf方法。
 
arrayOf接收一个参数，这个参数是规定的数组元素的数据类型。objectOf接收的参数则是属性的数据类型
 
我们对上述例子做些修改：

```
import React from 'react'
import PropTypes from 'prop-types';
class Son extends React.Component{
    render(){
       return (<div style ={{padding:30}}>
                {this.props.array}
               </div>)
           }
}
Son.propTypes = {
     array:PropTypes.arrayOf(PropTypes.number)
}
class Father extends React.Component{
    render(){
       return (<div>
                 <Son array = {[1,2,3,4]}/>
               </div>)
}
}
```

正常渲染，然后我们把<Son array = {[1,2,3,4]}/>改为<Son array = {['1','2','3','4']}/>，报错
 
【注意】虽然报错但是这并不会影响程序的正常运行（譬如上面我们看到渲染仍然是正常的），因为本质上说类型检测报的是非致命性错误warning而不是致命性错误error（区别在于是否影响了正常运行）。对objectOf也是同样的做法
 
3.5 通过shape方法检测目标对象不同属性的不同数据类型
 
如果你认真思考一下的话，你会发现3.4中的objectOf有一个缺陷，就是它内部的属性的数据类型被强行规定为一种，但通常一个对象里应该是有多种不同类型的属性了，那么这时候objectOf就不符合要求了，我们应该使用shape方法，其用法：

```
PropTypes.shape({
   属性1：类型1，
   属性2：类型2，
  //...
}),
 

import React from 'react'
import PropTypes from 'prop-types';
class Son extends React.Component{
     render(){
        return (<div style ={{padding:30}}>
                  {'我的名字叫' + this.props.object.name}
                  <br/>
                  {'我的年龄是' + this.props.object.age}
                 </div>)
             }
}
Son.propTypes = {
     object:PropTypes.shape({
     name:PropTypes.string,
     age:PropTypes.number
      })
}
class Father extends React.Component{
    render(){
       return (<div>
                  <Son object = {{name:'彭湖湾',age:20}}/>
               </div>)
     }
}

```

无报错，把<Son object = {{name:'彭湖湾',age:20}}/>改成<Son object = {{name:'彭湖湾',age:'20'}}/>，然后就能喜闻乐见得报错了

 

3.6 通过isRequired检测props中某个必要的属性（如果该属性不存在就报错）
 
有时候，我们在对某个变量进行类型检测时，我们不仅要求它符合预期的类型，同时也要求它是必须写入的，这时候就要用到isRequired。

```
Son.propTypes = {
          number:PropTypes.number
}
 
```

这段代码的作用是当你在props中写入number属性且number属性类型错误时给予报错提示，可如果你压根就没有写入number属性呢？没错，什么错误都不会报。这就是使用isRequired的必要性
 
```

import React from 'react'
import PropTypes from 'prop-types';
class Son extends React.Component{
    render(){
       return (<div style ={{padding:30}}>
                  {this.props.number}
               </div>)
           }
}
Son.propTypes = {
     number:PropTypes.number
}
class Father extends React.Component{
   render(){
      return (<div>
                <Son />
              </div>)
        }
}
```

 

控制台无任何输出

 

如果我们改成：

```
Son.propTypes = {
    number:PropTypes.number.isRequired
}
```

再运行，我们就又可以喜闻乐见得看到错误了：

 
【注意】在这里给大家提个问题：我们上述的写法是number:PropTypes.number.isRequired，这要求number是数字类型，但如果你不想控制number的类型而仅仅是想控制它的必要性呢？难道写成number:isRequired或number:PropTypes.isRequired? 这个时候PropTypes.any就登场啦！它代表了该变量可取任何一种数据类型，所以你可以写成这样——number: PropTypes.any.isRequired
 
3.7 应对更复杂的类型检测——将PropTypes的属性值写成函数

```
Son.propTypes = {
      prop:function(props,propName,componentName){
          if(/*判断条件*/){
               return new Error(/*错误的参数*/)
           }
    }
}

```
 

在属性prop的类型检测中，属性值是一个函数，在这里props是包含prop的props对象，propName是prop的属性名，componentName是props所在的组件名称，函数的返回值是一个Error对象


```
import React from 'react'
import PropTypes from 'prop-types';
class Son extends React.Component{
         render(){
               return (<div style ={{padding:30}}>
                        {this.props.email}
                       </div>)
                  }
}
Son.propTypes = {
     email:function(props,propName,componentName){
            if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(props[propName])){
                  return new Error('组件' + componentName+ '里的属性' + propName + '不符合邮箱的格式');
                         }
                }
}
class Father extends React.Component{
        render(){
             return (<div>
                        <Son email = {2314838004}/>
                     </div>)
                }
}
```

 
在这里我们利用正则表达式检测传递到Son组件的email属性是否符合邮箱格式，如果不符合就抛出错误，那么2314838004显然不符合这一要求，所以我们就得到下面的demo:(其实加上qq.com就是我的邮箱啦 哈哈)

 

4.ES7下类型检测的新写法：

可能你觉得把propTypes写在类外看起来有些怪怪的，在ES7的静态类属性的支持下，你可以这样写：


```
class Son extends React.Component{
static propTypes = {
       //..类型检测
}
render(){
   return (/* 渲染*/)
     }
}

```
 

但注意，这在ES7下生效

5.props-types的独立与react.PropTypes的弃用
 
在上面我是利用props-types这个独立的第三方库来进行类型检测的，但在不久前（react V15.5以前），它使用的是react内置的类型检测，而不是第三方库（也就是说我们现在的prop-types是当初以react内置的PropTypes对象为基础分离出来的）
 

翻译成中文就是：


所以说在你也可以这样进行类型检测，虽然并不推荐（为了保持向下兼容这在最新版本的react上仍然是可用的）

```
Son.propTypes = {
    number:React.PropTypes.number
}
```

6.参考资料：

react官方文档/高级指导/类型检测（docs/advanced guide/Typechecking with propTypes）

https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 
 
参考链接：https://www.cnblogs.com/penghuwan/p/6796139.html