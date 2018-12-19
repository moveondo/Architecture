
# webpack 入门三：插件


前面说了webpack的基本打包（js.css,img）和热启动。现在来说说css分离（extract-text-webpack-plugin）和HTML（HtmlWebpackPlugin）

### 首先来说说 HtmlWebpackPlugin

HtmlWebpackPlugin简化了HTML文件的创建，以便为您的webpack包提供服务。 这对于在文件名中包含每次会随着变异会发生变化的哈希的webpack bundle尤其有用。
您可以让插件为您生成一个HTML文件，使用lodash模板提供您自己的模板，或使用您自己的loader。

首先进行安装：
```
npm install --save html-webpack-plugin
```
基本用法

该插件将为您生成一个HTML5文件，其中包括使用script标签的body中的所有webpack包。 只需添加插件到您的webpack配置如下：

```
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackConfig = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
};

```
这将会产生一个包含以下内容的文件 dist/index.html：

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>webpack App</title>
  </head>
  <body>
    <script src="index_bundle.js"></script>
  </body>
</html>
```

如果您有多多个webpack入口点，他们都会在生成的HTML文件中的script标签内。

如果你有任何CSS assets 在webpack的输出中（例如，利用ExtractTextPlugin提取CSS），那么这些将被包含在HTML head中的<link>标签内。

以上是官方文档说明，本例子中

```
webpack.config.js:

var path = require('path')
var webpack = require('webpack')

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: { //配置入口文件，有几个写几个
    index: './req.js',
    list: './list.js'
  },
  output: {
    path: path.join(__dirname, "out"),
    filename:'js/[name].js',
    publicPath: '/',//添加静态资源, 否则会出现路径错误
    //path:  __dirname + '/out/'
  },
  module: {
       rules: [
           {
               test: /\.css$/,
               use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
               })
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
     new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
     title: 'HtmlWebpackPlugin',
     template: './index.html', //html模板路径
     inject: true, //js插入的位置，true/'head'/'body'/false
     hash: true, //为静态资源生成hash值
     chunks: ['vendors', 'list'],//需要引入的chunk，不配置就会引入所有页面的资源
     minify: { //压缩HTML文件
       removeComments: true, //移除HTML中的注释
       collapseWhitespace: false //删除空白符与换行符
     }
   }),
    new ExtractTextPlugin('css/[name].css'),
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

首先引入

```
var HtmlWebpackPlugin = require('html-webpack-plugin');

```
然后在 plugins中增加

```
 new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
     title: 'HtmlWebpackPlugin',
     template: './index.html', //html模板路径
     inject: true, //js插入的位置，true/'head'/'body'/false
     hash: true, //为静态资源生成hash值
     chunks: ['vendors', 'list'],//需要引入的chunk，不配置就会引入所有页面的资源
     minify: { //压缩HTML文件
       removeComments: true, //移除HTML中的注释
       collapseWhitespace: false //删除空白符与换行符
     }
   }),
```
### Plugins

webpack中一个非常重要的功能是Plugins。

插件（Plugins）是用来拓展webpack功能的，它们会在整个构建过程中生效，执行相关的任务。

Loaders和Plugins常常被弄混，但是他们其实是完全不同的东西：Loaders是在打包构建过程中用来处理源文件的（JSX，Scss，Less..），一次处理一个;

插件并不直接操作单个文件，它直接对整个构建过程其作用。

webpack有很多内置插件，同时也有很多第三方插件，可以让我们完成更加丰富的功能。今天说的extract-text-webpack-plugin与html-webpack-plugin就是比较实用的两个插件


### 再来说说extract-text-webpack-plugin

 extract-text-webpack-plugin该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象;
 
 首先先来介绍下这个插件的安装方法:

```
npm install extract-text-webpack-plugin --save
```

该插件有三个参数意义分别如下

 use:指需要什么样的loader去编译文件,这里由于源文件是.css所以选择css-loader
 
 fallback:编译后用什么loader来提取css文件
 
 publicfile:用来覆盖项目路径,生成该css文件的文件路径
 
 目前运行 webpack后可以访问链接变为：http://localhost:9003/out/index.html
 
 目录结构为：
 
 ![](https://github.com/moveondo/Webpack/blob/master/image/13.png)
 
 其中out文件夹为自动生成
 
 生成的/out/index.html为;
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
   <img src="">
<script type="text/javascript" src="/out/js/list.js?7ee04986114141e797dd"></script></body>
</html>
 ```
 
 out/css/index.css为:
 ```
 body{
  background: #19ec0b;
  font-size: 26px;
}

.key{
  color: #f00;
  width: 150px;
  height: 150px;
}
.question{
  color: #ff0;
  font-size: 56px;
}

 ```
 
 

