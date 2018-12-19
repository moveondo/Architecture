# webpack 入门二：热启动

[上一节](https://github.com/moveondo/Webpack/blob/master/README.md)中已经讲解了webpack基本的打包知识（js,css,img）,本章讲解比较火的热启动。

热启动，需要插件

首选安装插件：

```
npm install webpack-dev-server --save
```

然后再我们的webpack.config.js里面添加一下代码

```
var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: [
    './req.js'
  ], 
  output: {
    filename: 'bundle.js'
  },
  module: {
       loaders: [
           {
               test: /\.css$/,
               loader: "style-loader!css-loader"
              // loader: ExtractTextPlugin.extract("style-loader", "css-loader")
           },
           {
         //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
         //如下配置，将小于8192byte的图片转成base64码
         test: /\.(png|jpg|gif)$/,
         loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
        }
       ]
   },
   plugins: [
       new webpack.HotModuleReplacementPlugin(),
     ],
  devServer: {
    contentBase:"./",
    host:'localhost',
    port: 9003, //默认8080
    inline: true, //可以监控js变化
    hot: true, //热启动
    overlay: true,
    stats: "errors-only",
    historyApiFallback:{
    rewrites:[
      {from:/./,to:'/404.html'}
    ]
   }
  }
}
```

增加
```
 plugins: [
       new webpack.HotModuleReplacementPlugin(),
     ],
  devServer: {
    contentBase:"./",
    host:'localhost',
    port: 9003, //默认8080
    inline: true, //可以监控js变化
    hot: true, //热启动
    overlay: true,
    stats: "errors-only",
    historyApiFallback:{
    rewrites:[
      {from:/./,to:'/404.html'}
    ]
   }
  }
```

其中 
#### 1.contentBase

contentBase是我们今天要讲的第一个webpack-dev-server的配置属性，那么，contentBase做了什么事情呢？——它指定了服务器资源的根目录，如果不写入contentBase的值，那么contentBase默认是项目的目录。

#### 2.port

port配置属性指定了开启服务的端口号：

#### 3.host

host设置的是服务器的主机号：

#### 4.historyApiFallback

在文档里面说的很清楚，这个配置属性是用来应对返回404页面时定向到特定页面用的（the index.html page will likely have to be served in place of any 404 responses)

如图：

![](https://github.com/moveondo/Webpack/blob/master/image/404.png)

#### 5.devServer.overlay
这个配置属性用来在编译出错的时候，在浏览器页面上显示错误，默认是false，可设置为true

#### 6. stats（字符串）
 
这个配置属性用来控制编译的时候shell上的输出内容，我们没有设置devServer.stats时候编译输出是这样子的：

stats: "errors-only"表示只打印错误：

#### 7. quiet

当这个配置属性和devServer.stats属于同一类型的配置属性
当它被设置为true的时候，控制台只输出第一次编译的信息，当你保存后再次编译的时候不会输出任何内容，包括错误和警告

**【吐槽】这样看的话感觉这个配置好像只有负面作用呢.....

#### 8. compress

 这是一个布尔型的值，当它被设置为true的时候对所有的服务器资源采用gzip压缩 采用gzip压缩的优点和缺点：
 
 优点：对JS，CSS资源的压缩率很高，可以极大得提高文件传输的速率，从而提升web性能
 
 缺点：服务端要对文件进行压缩，而客户端要进行解压，增加了两边的负载
 
#### 9. hot和 inline

在这之前，首先要说一下的是webpack-dev-server的自动刷新和模块热替换机制

这两个机制是紧紧联系在一起的
 
从外部角度看——自动刷新

当我们对业务代码做了一些修改然后保存后（command+s），页面会自动刷新，我们所做的修改会直接同步到页面上，而不需要我们刷新页面，或重新开启服务
（The webpack-dev-server supports multiple modes to automatically refresh the page）

内部角度看——模块热替换

在热替换（HMR）机制里，不是重载整个页面，HMR程序会只加载被更新的那一部分模块，然后将其注入到运行中的APP中

（In Hot Module Replacement, the bundle is notified that a change happened. Rather than a full page reload, a Hot Module Replacement runtime could then load the updated modules and inject them into a running app.）

webpack-dev-server有两种模式可以实现自动刷新和模块热替换机制

 1. Iframe mode(默认,无需配置)

  页面被嵌入在一个iframe里面，并且在模块变化的时候重载页面

 2.inline mode（需配置）添加到bundle.js中

  当刷新页面的时候，一个小型的客户端被添加到webpack.config.js的入口文件中
  
  #### 那怎么才能inline mode模式的刷新呢？
  
 你需要做这些：
 
1,在配置中写入devServer.hot：true和devServer.inline：true

2,增加一个插件配置webpack.HotModuleReplacementPlugin()

 
![](https://github.com/moveondo/Webpack/blob/master/image/9.png)

如果有上面两行输出则表明你已经配置成功


现在还有一个问题，那就是每次直接输入node_modules/.bin/webpack-dev-server来启动服务器对我们来说简直就是莫大的痛苦，那么怎么对这一过程进行简化呢？

#### 答案：把这个运行脚本写到package.json里就行了！
```
{
  "name": "webpackrumen",
  "version": "1.0.0",
  "description": "",
  "main": "bundle.js",
  "dependencies": {
    "css-loader": "^0.28.7",
    "style-loader": "^0.19.0",
    "webpack": "^3.8.1"
  },
  "devDependencies": {
    "css-loader": "^0.28.7",
    "extract-text-webpack-plugin": "^3.0.2",
    "file-loader": "^1.1.5",
    "style-loader": "^0.19.0",
    "url-loader": "^0.6.2"
  },
  "scripts": {
    "dev": "node_modules/.bin/webpack-dev-server --port 9003 --inline true"
  },
  "author": "lilu",
  "license": "ISC"
}

主要是
 "scripts": {
    "dev": "node_modules/.bin/webpack-dev-server --port 9003 --inline true"
  },
  
```
在终端运行npm run dev:

![](https://github.com/moveondo/Webpack/blob/master/image/10.png)

运行成功！

此时修订 style.css时
```
.question{
  color: #ff0;
  font-size: 26px;
}

```
页面为：

![](https://github.com/moveondo/Webpack/blob/master/image/11.png)

修改为：

```
.question{
  color: #ff0;
  font-size: 56px;
}
```
直接查看，不用任何刷新，页面为：

![](https://github.com/moveondo/Webpack/blob/master/image/12.png)


至此，热启动模块已经全部OK







