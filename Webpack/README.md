# Webpack 入门一

## 基础知识

 环境依赖：node
```
 查看node版本 node -v
```
### 安装

想使用Webpack大多数的功能只需要我们全局安装一下：

```
npm install -g webpack
```
然而Webpack的一些功能，比如优化插件，需要我们把它安装到本地。在这种情况下我们需要：
```
npm install --save-dev webpack

```
### 命令行

运行Webpack只需要下面一行命令：
```
webpack

```
如果想要Webpack在我们改变文件的同时监听改变并重新构建：
```
webpack --watch
```
 如果想要使用自定义名称的Webpack的配置文件:
 
 ```
 webpack --config myconfig.js
 ```

查看webpack版本：
```
webpack -version

```
### 打包

#### Example 1

运行以上命令后出现结构为：
```
webpack
|- node_modules
|- index.html
```
其中 index.html 为：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>webpack</title>
</head>
<body>
    <section class="q1">
	 		<p class="question">hello webpack</p>
	 		<div class="key"> missing you</div>
   </section>
   <div id="key"> </div>
</body>
</html>
<script type="text/javascript" src="bundle.js"> </script>

```
新建 req.js

```
var Key=document.getElementById("key");
Key.innerHTML="yes I do ";
```
此时在命令行进行打包 
```
wepack req.js bundle.js
```

出现以下情况，说明打包成功

![](https://github.com/moveondo/frontEnd-some/blob/master/Webpack/image/1.png)

此时的目录结构为：

![](https://github.com/moveondo/frontEnd-some/blob/master/Webpack/image/2.png)

其中bundle.js自动生成。

### 增加css

 webpack默认是打包js的所以，如果要加载css ,需要CSS加载器。
 
 首选进行安装加载器：
 ```
 npm install css-loader style-loader -D
 ```
 然后再进行书写style.css
 
 ```
 body{
  background: #f00;
}
 ```
在req.js中进行引入：

```
var Key=document.getElementById("key");
Key.innerHTML="yes I do ";

require('!style-loader!css-loader!./style.css');
```
在进行打包，
```
wepack req.js bundle.js
```
此时刷新原页面进行查看为:

![](https://github.com/moveondo/frontEnd-some/blob/master/Webpack/image/3.png)

### npm初始化来创建package.json

```
npm init
```
根据生成步骤一步一步填写：

![](https://github.com/moveondo/frontEnd-some/blob/master/Webpack/image/4.png)

最后生成package.json

### 创建配置文件webpack.config.js

  这是Webpack默认的配置名称，如果你选择使用自定义的名称，必须使用 --config来自定该特殊的配置文件名称。

```
module.exports = {
  entry: ['./req.js'], // file extension after index is optional for .js files
  output: {
    filename: 'bundle.js'
  }
}
```
module.exports 是 CommonJS 规范中定义一个文件对外接口的语法，webpack.config.js 文件对外的接口是一个 object ，其中定义了一些配置参数。

#### entry

最初 webpack 是为了构建 SPA (Single Page Application) ，entry 是『入口』配置。在 entry 中的文件才会被编译。

#### output

output 控制构建后的文件的存放位置和命名。 path 定义所有构建后文件的所在目录，本例中构建到当前文件夹。

#### filename

filename 控制构建后文件的文件名

此时运行webpack时不需要之前那么繁琐了。
```
webpack
```
以上即可打包之前的js,但如果想不用CSS前面写loader那么麻烦，需要再次封装webapck.config.js

```
module.exports = {
  entry: ['./req.js'], // file extension after index is optional for .js files
  output: {
    filename: 'bundle.js'
  },
  module: {
       loaders: [
           {
               test: /\.css$/,
               loader: "style-loader!css-loader"
           }
       ]
   }
}

```
#### module.loaders[].test

test 参数是一个正则表达式，用于匹配模块。'./index.css'.test(/\.css&/)

#### module.loaders[].loader

loader 参数定义被 test 匹配到的模块会执行哪些构建操作

本例中 .css 后缀的文件会被 style-loader 和 css-loader 构建

此时style.css
```
body{
  background: #ff0;
}
```
req.js
```
var Key=document.getElementById("key");
Key.innerHTML="yes I do ";

require('./style.css');
```

界面运行运用
```
webpack --watch
```
查看为

![](https://github.com/moveondo/frontEnd-some/blob/master/Webpack/image/5.png)

此时如果增加样式
```
body{
  background: #ff0;
  font-size: 26px;
}

```
不需要构建，直接刷新即可看到页面：

![](https://github.com/moveondo/frontEnd-some/blob/master/Webpack/image/6.png)

字体已经变大。


### 增加图片 img

 此时增加webpack.config.js
```
module.exports = {
  entry: ['./req.js'], // file extension after index is optional for .js files
  output: {
    filename: 'bundle.js'
  },
  module: {
       loaders: [
           {
               test: /\.css$/,
               loader: "style-loader!css-loader"
           },
           {
         //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
         //如下配置，将小于8192byte的图片转成base64码
         test: /\.(png|jpg|gif)$/,
         loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
        }
       ]
   }
}
```

req.js
```
var Key=document.getElementById("key");
Key.innerHTML="yes I do ";

require('./style.css');

 var src = require('./LOGO.png');

 document.getElementsByTagName('img')[0].setAttribute("src", src);
```
style.css
```
body{
  background: #19ec0b;
  font-size: 26px;
}
```
html 结构为：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>webpack</title>
</head>
<body>
    <section class="q1">
	 		<p class="question">hello webpack</p>
	 		<div class="key"> missing you</div>
   </section>
   <div id="key"> </div>
   <img src=""></img>
</body>
</html>
<script type="text/javascript" src="bundle.js"> </script>
```

此时刷新页面已经看到了

![](https://github.com/moveondo/frontEnd-some/blob/master/Webpack/image/8.png)

webpack的功能如果只是这样，那太小看了，如果想继续学习热启动，请观看

 [webpack入门第二篇：热启动](https://github.com/moveondo/Webpack/blob/master/webpack%EF%BC%9A%E7%83%AD%E5%90%AF%E5%8A%A8.md)
