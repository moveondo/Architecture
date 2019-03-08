#### Python模块- jinja2

模板

　　要了解jinja2，那么需要先理解模板的概念。模板在Python的web开发中广泛使用，它能够有效的将业务逻辑和页面逻辑分开，使代码可读性增强、并且更加容易理解和维护。

　　模板简单来说就是一个其中包涵占位变量表示动态的部分的文件，模板文件在经过动态赋值后，返回给用户。  --> 可以理解为渲染

　　python中自带一个简单的模板，就是string提供的。

```
>>> import string
>>> a = string.Template('$who is $role')
>>> a.substitute(who='daxin',role='Linux')
'daxin is Linux'
>>> a.substitute(who='daxin',role='cat')
'daxin is cat'
>>>

```

　　Python自带的模板功能极其有限，如果我们想要在模板中使用控制语句，和表达式，以及继承等功能的话，就无法实现了。

　　目前主流的模板系统，最常用的就是jinja2和mako

jinja2介绍

　　jinja2是Flask作者开发的一个模板系统，起初是仿django模板的一个模板引擎，为Flask提供模板支持，由于其灵活，快速和安全等优点被广泛使用。

jinja2的优点

　　jinja2之所以被广泛使用是因为它具有以下优点：

* 相对于Template，jinja2更加灵活，它提供了控制结构，表达式和继承等。
* 相对于Mako，jinja2仅有控制结构，不允许在模板中编写太多的业务逻辑。
* 相对于Django模板，jinja2性能更好。
* Jinja2模板的可读性很棒。
安装jinja2

　　由于jinja2属于第三方模块，首先需要对其进行安装

>pip3 install jinja2

　　测试模板是否安装成功

> python -c "import jinja2"
 
* 没有报错就表示安装成功
* 必须用双引号"

jinja2语法

　　作为一个模板系统，它还提供了特殊的语法，我们按照它支持的语法进行编写之后，就能使用jinja2模块进行渲染。

基本语法

 　　在jinja2中，存在三种语法：

* 控制结构 {% %}
* 变量取值 {{ }}
* 注释 {# #}

　　下面是一个简单的jinja2例子

```
{# This is jinja code
 
    {% for file in filenames %}
    ...
    {% endfor %}
 
#}

```

　　可以看到，for循环的使用方式和Python比较类似，但是没有了句尾的冒号，另外需要使用endfor最为结尾，其实在jinja2中，if也是一样的，结尾需要使用endif。

jinja2变量

　　jinja2模板中使用 {{ }} 语法表示一个变量，它是一种特殊的占位符。当利用jinja2进行渲染的时候，它会把这些特殊的占位符进行填充/替换，jinja2支持python中所有的Python数据类型比如列表、字段、对象等。

```
<p>this is a dicectory:{{ mydict['key'] }} </p>
<p>this is a list:{{ mylist[3] }} </p>
<p>this is a object:{{ myobject.something() }} </p>

```

jinja2中的过滤器

　　变量可以通过“过滤器”进行修改，过滤器可以理解为是jinja2里面的内置函数和字符串处理函数。

　　常用的过滤器有：
```
过滤器名称	    说明    
safe	 渲染时值不转义
capitialize	 把值的首字母转换成大写，其他子母转换为小写
 lower	 把值转换成小写形式 
 upper	 把值转换成大写形式 
 title	 把值中每个单词的首字母都转换成大写
 trim	 把值的首尾空格去掉
 striptags	 渲染之前把值中所有的HTML标签都删掉
join 	 拼接多个值为字符串
 replace	 替换字符串的值
 round	 默认对数字进行四舍五入，也可以用参数进行控制
int 	 把值转换成整型
```
 　　那么如何使用这些过滤器呢？ 只需要在变量后面使用管道(|)分割，多个过滤器可以链式调用，前一个过滤器的输出会作为后一个过滤器的输入。


```
{{ 'abc' | captialize  }}
# Abc
 
{{ 'abc' | upper  }}
# ABC
 
{{ 'hello world' | title  }}
# Hello World
 
{{ "hello world" | replace('world','daxin') | upper }}
# HELLO DAXIN
 
{{ 18.18 | round | int }}
# 18

```
jinja2的控制结构

　　jinja2中的if语句类似与Python的if语句，它也具有单分支，多分支等多种结构，不同的是，条件语句不需要使用冒号结尾，而结束控制语句，需要使用endif关键字。

```
{% if daxin.safe %}
daxin is safe.
{% elif daxin.dead %}
daxin is dead
{% else %}
daxin is okay
{% endif %}

```

jinja2的for循环

　　jinja2中的for循环用于迭代Python的数据类型，包括列表，元组和字典。在jinja2中不存在while循环。

　　迭代列表
```
<ul>
{% for user in users %}
<li>{{ user.username|title }}</li>
{% endfor %}
</ul>

```

　　迭代字典

```
<dl>
{% for key, value in my_dict.iteritems() %}
<dt>{{ key }}</dt>
<dd>{{ value}}</dd>
{% endfor %}
</dl>
```

     当然也可以加入else语句，在循环正确执行完毕后，执行

      在for循环中，jinja2还提供了一些特殊的变量，用以来获取当前的遍历状态：

变量	描述
```
loop.index	当前迭代的索引（从1开始）
loop.index0	当前迭代的索引（从0开始）
loop.first	是否是第一次迭代，返回bool
loop.last	是否是最后一次迭代，返回bool
loop.length	序列中的项目数量
loop.revindex	到循环结束的次数（从1开始）
loop.revindex0	到循环结束的次数(从0开始）
```

jinja2的宏

　　宏类似于Python中的函数，我们在宏中定义行为，还可以进行传递参数，就像Python中的函数一样一样儿的。

　　在宏中定义一个宏的关键字是macro，后面跟其 宏的名称和参数等

```
{% macro input(name,age=18) %}   # 参数age的默认值为18
 
 <input type='text' name="{{ name }}" value="{{ age }}" >
 
{% endmacro %}
　　调用方法也和Python的类似

<p>{{ input('daxin') }} </p>
<p>{{ input('daxin',age=20) }} </p>

```

jinja2的继承和Super函数

　　jinja2中最强大的部分就是模板继承。模板继承允许我们创建一个基本(骨架)文件，其他文件从该骨架文件继承，然后针对自己需要的地方进行修改。

　　jinja2的骨架文件中，利用block关键字表示其包涵的内容可以进行修改。

　　以下面的骨架文件base.html为例：

```
<!DOCTYPE html>
<html lang="en">
<head>
    {% block head %}
    <link rel="stylesheet" href="style.css"/>
    <title>{% block title %}{% endblock %} - My Webpage</title>
    {% endblock %}
</head>
<body>
<div id="content">{% block content %}{% endblock %}</div>
<div id="footer">
    {% block  footer %}
    <script>This is javascript code </script>
    {% endblock %}
</div>
</body>
</html>
```

　　这里定义了四处 block，即：head，title，content，footer。那怎么进行继承和变量替换呢？注意看下面的文件

```
{% extend "base.html" %}       # 继承base.html文件
 
{% block title %} Dachenzi {% endblock %}   # 定制title部分的内容
 
{% block head %}
    {{  super()  }}        # 用于获取原有的信息
    <style type='text/css'>
    .important { color: #FFFFFF }
    </style>
{% endblock %}   
```
*  其他不修改的原封不同的继承

>　PS: super()函数 表示获取block块中定义的原来的内容。

利用jinja2进行渲染

　　jinja2模块中有一个名为Enviroment的类，这个类的实例用于存储配置和全局对象，然后从文件系统或其他位置中加载模板。

基本使用方法

　　大多数应用都在初始化的时候撞见一个Environment对象，并用它加载模板。Environment支持两种加载方式：

>PackageLoader：包加载器
>FileSystemLoader：文件系统加载器

PackageLoader

　　使用包加载器来加载文档的最简单的方式如下：

```
from jinja2 import PackageLoader,Environment
env = Environment(loader=PackageLoader('python_project','templates'))    # 创建一个包加载器对象
 
template = env.get_template('bast.html')    # 获取一个模板文件
template.render(name='daxin',age=18)   # 渲染

```
　其中：

* PackageLoader()的两个参数为：python包的名称，以及模板目录名称。
* get_template()：获取模板目录下的某个具体文件。
* render()：接受变量，对模板进行渲染

FileSystemLoader

　　文件系统加载器，不需要模板文件存在某个Python包下，可以直接访问系统中的文件。


* python中，在形参前面加上“*”与“”“**”，称为动态参数

* 加“*”时，函数可接受任意多个参数，全部放入一个元祖中


 
链接：https://www.cnblogs.com/dachenzi/p/8242713.html

http://python.jobbole.com/83560/
