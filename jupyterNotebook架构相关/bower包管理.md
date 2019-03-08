#### 使用Bower进行前端依赖管理

什么是Bower？

前端开发圈越来越热闹，第三方js库层出不穷，版本更迭日新月异；且许多库又对其他库有着依赖关系。而我们的页面需要的库也越来越多样化。以往需要引入第三方库，需要搜索寻找所需库的特定版本下载，还需要搜索寻找下载特定版本的依赖库，十分麻烦；库的更新也是件十分繁琐的事情。是否有一个工具：搜索、自动安装/卸载、检查更新、确保依赖关系……

Bower 是 twitter 推出的一款包管理工具，基于nodejs的模块化思想，把功能分散到各个模块中，让模块和模块之间存在联系，通过 Bower 来管理模块间的这种联系。

 * “包”是指一系列有意义的资源的集合，在bower这里，更多体现在json文件，它是这些资源的配置文件，一个完整的包都应该有一个bower.json文件。

 * “管理”包含获取，下载，安装，更新，查找,注册等等一系列对资源的操作。

npm是专门管理node模块的管理工具，而bower是node的模块，因为bower是依赖node，npm和git。正如前面所言，npm是擅长的是管理node模块，而bower管理的范围更大，涉及html,css,js和图片等媒体资源。或许，这也是人们喜欢在服务器端使用npm,而在客户端使用bower。

#### Bower 的基础功能有哪些？

 *  注册模块：每个包需要确定一个唯一的 ID 使得搜索和下载的时候能够正确匹配
 * 文件存储：把文件存储在一个有效的网络地址上,使用的时候可以直接下载到
 * 上传下载：你可以把你的包注册后上传存储，使用的时候可以使用一条命令直接下载到当前项目
 * 依赖分析：它帮我们解决了包与包直接的依赖关系，当我们下载一个包A的时候,由于它依赖包B,所以bower会自动帮我们下载好包
 
#### 为什么要使用Bower?

 * 节省时间。为什么要学习Bower的第一个原因，就是它会为你节省寻找客户端的依赖关系的时间。每次我需要安装jQuery的时候，我都需要去jQuery网站下载包或使用CDN版本。但是有了Bower，你只需要输入一个命令，jquery就会安装在本地计算机上，你不需要去记版本号之类的东西，你也可以通过Bower的info命令去查看任意库的信息。
 * 脱机工作。Bower会在用户主目录下创建一个.bower的文件夹，这个文件夹会下载所有的资源、并安装一个软件包使它们可以离线使用。如果你熟悉Java，Bower即是一个类似于现在流行的Maven构建系统的.m2仓库。每次你下载任何资源库都将被安装在两个文件夹中 —— 一个在的应用程序文件夹，另一个在用户主目录下的.bower文件夹。因此，下一次你需要这个仓库时，就会用那个用户主目录下.bower中的版本。
 * 可以很容易地展现客户端的依赖关系。你可以创建一个名为json的文件，在这个文件里你可以指定所有客户端的依赖关系，任何时候你需要弄清楚你正在使用哪些库，你可以参考这个文件。
 * 让升级变得简单。假设某个库的新版本发布了一个重要的安全修补程序，为了安装新版本，你只需要运行一个命令，bower会自动更新所有有关新版本的依赖关系。

#### 如何安装Bower?

Bower依赖于Node.js，Git（资源主要通过git进行下载），因此你需要提前安装好，才能正常安装bower。 Bower可以通过NPM进行安装：

一旦你已经安装了上面所说的所有必要文件，键入以下命令安装Bower：

> $ npm install -g bower
 

这行命令是Bower的全局安装，-g 操作表示全局。

> $ bower –version //检查版本确认是否安装好
> $ npm update -g bower //更新Bower版本
> $ npm uninstall --global bower 卸载Bower
 

如何使用Bower?

安装完bower之后就可以使用所有的bower命令了。可以键入help 命令来查看bower可以完成那些操作，如下：

复制代码

> PS D:\> bower help

```
Usage:
 
    bower <command> [<args>] [<options>]
Commands:
 
    cache                  Managebowercache
    help                    DisplayhelpinformationaboutBower
    home                    Opens a package homepageintoyourfavoritebrowser
    info                    Infoof a particularpackage
    init                    Interactivelycreate a bower.jsonfile
    install                Install a package locally
    link                    Symlink a package folder
    list                    Listlocalpackages - and possibleupdates
    login                  AuthenticatewithGitHuband storecredentials
    lookup                  Lookup a package URLbyname
    prune                  Removeslocalextraneouspackages
    register                Register a package
    search                  Searchfor a package byname
    update                  Update a localpackage
    uninstall              Remove a localpackage
    unregister              Remove a package fromtheregistry
    version                Bump a package version
Options:
 
    -f, --force            Makesvariouscommandsmoreforceful
    -j, --json              OutputconsumableJSON
    -l, --loglevel          Whatleveloflogsto report
    -o, --offline          Do not hitthenetwork
    -q, --quiet            Onlyoutputimportantinformation
    -s, --silent            Do not outputanything, besideserrors
    -V, --verbose          Makesoutputmoreverbose
    --allow-root            Allowsrunningcommandsas root
    -v, --version          OutputBowerversion
    --no-color              Disablecolors
See 'bower help <command>' for moreinformationon a specificcommand.

```
 

上面help 信息列出 bower 提供的命令：

```
cache:bower缓存管理
help:显示Bower命令的帮助信息
home:通过浏览器打开一个包的github发布页
info:查看包的信息
init:创建json文件
install:安装包到项目
link:在本地bower库建立一个项目链接
list:列出项目已安装的包
lookup:根据包名查询包的URL
prune:删除项目无关的包
register:注册一个包
search:搜索包
update:更新项目的包
uninstall:删除项目的包

```

包的安装

Bower是一个软件包管理器，举例来看一下来如何使用Bower安装JQuery，首先使用命令行将找到包存放的本地目录，然后执行：

> bower install jquery

安装后的库默认存放在项目的 bower_components 子目录，如果要指定其他位置，可在 .bowerrc 文件的 directory 属性设置。

Bower使用包的名字去在线索引中搜索该包的网址 — bower.com。某些情况下，如果一个库很新（或者你不想使用默认网址），可能需要我们手动指定该库的网址。指定的网址可以是 github 地址、http 网址、本地文件。

```
bowerinstallgit://github.com/documentcloud/backbone.git
bowerinstallhttp://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min.js
bowerinstall ./some/path/relative/to/this/directory/backbone.js

```


默认情况下，会安装该库的最新版本，但是也可以手动指定版本号。

> bower install jquery-ui#1.10.1
 

如果某个库依赖另一个库，安装时默认将所依赖的库一起安装。Bower会根据该库的 bower.json 文件下的 dependencies 配置自动给你安装指定依赖库的指定版本。比如，jquery-ui依赖jquery，安装时会连jquery一起安装。

包的搜索

假如你想在你的应用程序中使用twitter的bootstrap框架，但你不确定包的名字，这时你可以使用search 命令：


> PS D:\> bower search bootstrap

Searchresults:
 
    bootstrapgit://github.com/twbs/bootstrap.git
    angular-bootstrapgit://github.com/angular-ui/bootstrap-bower.git
    bootstrap-sass-officialgit://github.com/twbs/bootstrap-sass.git
    sass-bootstrapgit://github.com/jlong/sass-bootstrap.git
    bootstrap-datepickergit://github.com/eternicode/bootstrap-datepicker.git
    bootstrap-selectgit://github.com/silviomoreto/bootstrap-select.git
    angular-ui-bootstrap-bowergit://github.com/angular-ui/bootstrap-bower
    angular-ui-bootstrapgit://github.com/angular-ui/bootstrap.git
    bootstrap-daterangepickergit://github.com/dangrossman/bootstrap-daterangepicker.git
    bootstrap-timepickergit://github.com/jdewit/bootstrap-timepicker
    bootstrap-switch git://github.com/nostalgiaz/bootstrap-switch.git
    bootstrap-cssgit://github.com/jozefizso/bower-bootstrap-css.git
    select2-bootstrap-cssgit://github.com/t0m/select2-bootstrap-css.git
    eonasdan-bootstrap-datetimepickergit://github.com/Eonasdan/bootstrap-datetimepicker.git
    seiyria-bootstrap-slidergit://github.com/seiyria/bootstrap-slider.git
    angular-bootstrap-colorpickergit://github.com/buberdds/angular-bootstrap-colorpicker.git
    bootstrap-multiselectgit://github.com/davidstutz/bootstrap-multiselect.git
    bootstrap.cssgit://github.com/bowerjs/bootstrap.git
    bootstrap-datetimepickergit://github.com/tarruda/bootstrap-datetimepicker.git
    angular-bootstrap-datetimepickergit://github.com/dalelotts/angular-bootstrap-datetimepicker
    bootstrap-modalgit://github.com/jschr/bootstrap-modal.git
    bootstrap-tourgit://github.com/sorich87/bootstrap-tour.git
    bootstrap-tagsinputgit://github.com/TimSchlechter/bootstrap-tagsinput.git
    bootstrap-additionsgit://github.com/mgcrea/bootstrap-additions.git
    bootstrap-file-inputgit://github.com/grevory/bootstrap-file-input.git
    angular-bootstrap-switch git://github.com/frapontillo/angular-bootstrap-switch.git
    bootstrap-socialgit://github.com/lipis/bootstrap-social.git
    twbs-bootstrap-sassgit://github.com/twbs/bootstrap-sass
    ember-addons.bs_for_embergit://github.com/ember-addons/bootstrap-for-ember.git
    jasny-bootstrapgit://github.com/jasny/bootstrap.git
复制代码
 

查看包的信息
如果你想看到关于特定的包的信息，可以使用info 命令来查看该包的所有信息：

>PS D:\> bowerinfobootstrap

```
bowerbootstrap#*           not-cached git://github.com/twbs/bootstrap.git#*
bowerbootstrap#*              resolve git://github.com/twbs/bootstrap.git#*
bowerbootstrap#*             download https://github.com/twbs/bootstrap/archive/v3.3.6.tar.gz
bowerbootstrap#*             progress received 0.9MB of 3.8MB downloaded, 24%
bowerbootstrap#*             progress received 1.0MB of 3.8MB downloaded, 27%
bowerbootstrap#*             progress received 1.1MB of 3.8MB downloaded, 30%
bowerbootstrap#*             progress received 1.3MB of 3.8MB downloaded, 34%
bowerbootstrap#*             progress received 1.4MB of 3.8MB downloaded, 37%
bowerbootstrap#*             progress received 1.6MB of 3.8MB downloaded, 41%
bowerbootstrap#*             progress received 1.7MB of 3.8MB downloaded, 46%
bowerbootstrap#*             progress received 1.9MB of 3.8MB downloaded, 50%
bowerbootstrap#*             progress received 2.1MB of 3.8MB downloaded, 55%
bowerbootstrap#*             progress received 2.3MB of 3.8MB downloaded, 59%
bowerbootstrap#*             progress received 2.4MB of 3.8MB downloaded, 64%
bowerbootstrap#*             progress received 2.6MB of 3.8MB downloaded, 69%
bowerbootstrap#*             progress received 2.8MB of 3.8MB downloaded, 74%
bowerbootstrap#*             progress received 3.0MB of 3.8MB downloaded, 79%
bowerbootstrap#*             progress received 3.2MB of 3.8MB downloaded, 85%
bowerbootstrap#*             progress received 3.4MB of 3.8MB downloaded, 88%
bowerbootstrap#*             progress received 3.5MB of 3.8MB downloaded, 92%
bowerbootstrap#*             progress received 3.7MB of 3.8MB downloaded, 96%
bowerbootstrap#*              extract archive.tar.gz
bowerbootstrap#*             resolved git://github.com/twbs/bootstrap.git#3.3.6
 
{
  name: 'bootstrap',
  description: 'The most popular front-end framework for developing responsive, mobile first projects on the web.',
  keywords: [
    'css',
    'js',
    'less',
    'mobile-first',
    'responsive',
    'front-end',
    'framework',
    'web'
  ],
  homepage: 'http://getbootstrap.com',
  license: 'MIT',
  moduleType: 'globals',
  main: [
    'less/bootstrap.less',
    'dist/js/bootstrap.js'
  ],
  ignore: [
    '/.*',
    '_config.yml',
    'CNAME',
    'composer.json',
    'CONTRIBUTING.md',
    'docs',
    'js/tests',
    'test-infra'
  ],
  dependencies: {
    jquery: '1.9.1 - 2'
  },
  version: '3.3.6'
}
 
Availableversions:
  - 3.3.6
  - 3.3.5
  - 3.3.4
  - 3.3.2
  - 3.3.1
  - 3.3.0
  - 3.2.0
  - 3.1.1
  - 3.1.0
  - 3.0.3
  - 3.0.2
  - 3.0.1
  - 3.0.0
  - 2.3.2
  - 2.3.1
  - 2.3.0
  - 2.2.2
  - 2.2.1
  - 2.2.0
  - 2.1.1
  - 2.1.0
  - 2.0.4
  - 2.0.3
  - 2.0.2
  - 2.0.1
  - 2.0.0
  - 1.4.0
  - 1.3.0
  - 1.2.0
  - 1.1.1
  - 1.1.0
  - 1.0.0
 
Show 4 additionalprereleaseswith ‘bowerinfobootstrap --verbose’
Youcanrequestinfofor a specificversionwith 'bower info bootstrap#<version>'

```

查看指定版本包的信息：

>PS D:\> bower info bootstrap#3.3.6

bowerbootstrap#3.3.6           cached git://github.com/twbs/bootstrap.git#3.3.6

bowerbootstrap#3.3.6         validate 3.3.6 against git://github.com/twbs/bootstrap.git#3.3.6
 
```
{
  name: 'bootstrap',
  description: 'The most popular front-end framework for developing responsive, mobile first projects on the web.',
  keywords: [
    'css',
    'js',
    'less',
    'mobile-first',
    'responsive',
    'front-end',
    'framework',
    'web'
  ],
  homepage: 'http://getbootstrap.com',
  license: 'MIT',
  moduleType: 'globals',
  main: [
    'less/bootstrap.less',
    'dist/js/bootstrap.js'
  ],
  ignore: [
    '/.*',
    '_config.yml',
    'CNAME',
    'composer.json',
    'CONTRIBUTING.md',
    'docs',
    'js/tests',
    'test-infra'
  ],
  dependencies: {
    jquery: '1.9.1 - 2'
  },
  version: '3.3.6'
}
```

已安装包列表

> PS D:\> bowerlist

bowercheck-new    Checkingfor new versionsoftheprojectdependencies...

root D:\
└── jquery#2.2.0 extraneous (latest is 3.0.0-beta1)


其他常用指令

包的升级 bower update jquery

包的卸载 bower uninstall jquery  （注意：默认情况下会连所依赖的库一起卸载。比如，jquery-ui 依赖 jquery，卸载时会连 jquery 一起卸载，除非还有别的库依赖 jquery。）

安装失败清除缓存 bower cache clean

Bower的配置文件.bowerrc

项目根目录下（也可以放在用户的主目录下，这样就不用每次都配置）的 .bowerrc 文件是 Bower 的配置文件，它大概像下面这样。

复制代码

```

{
  "directory" : "components",
  "json"      : "bower.json",
  "endpoint"  : "https://Bower.herokuapp.com",
  "searchpath"  : "",
  "shorthand_resolver" : ""
}

```

 

其中的属性含义如下。

* directory：存放库文件的子目录名。
* json：描述各个库的json文件名。
* endpoint：在线索引的网址，用来搜索各种库。
* searchpath：一个数组，储存备选的在线索引网址。如果某个库在endpoint中找不到，则继续搜索该属性指定的网址，通常用于放置某些不公开的库。
* shorthand_resolver：定义各个库名称简写形式。
* bower.json文件
* bower.json文件的使用可以让包的安装更容易，你可以在应用程序的根目录下创建一个名为“bower.json”的文件，并定义它的依赖关系。bower.json的作用是：

保存项目的库信息，供项目二次安装时使用（重复使用）

向com 提交你的库时，该网站会读取 bower.json，列入在线索引。

其中dependencies 记录着生产环境依赖的库；devDependencies 记录着开发时依赖的 node package。其版本规则见 npm 的version rules。

使用bower init 命令可以来创建bower.json文件，它会自动提示你输入一系列的内容，以生成最终的文件，包括项目名称、作者信息、项目描述信息、关键词、开源证书等等。


#### PS D:\> bowerinit
```
? namenewone
? description a new oneproject
? mainfilenewone.js
? whattypesofmodulesdoesthis package expose? es6
? keywordstest
? authorsbiaodianfu <biaodianfu#gmail.com>
? licenseMIT
? homepagehttp://www.biaodianfu.com
? set currently installed components as dependencies? Yes
? add commonly ignored files to ignore list? Yes
? would you like to mark this package as private which prevents it from being accidentally published to the registry? No
 
 
 
{
  name: 'newone',
  authors: [
    'biaodianfu <biaodianfu#gmail.com>'
  ],
  description: 'a new one project',
  main: 'newone.js',
  moduleType: [
    'es6'
  ],
  keywords: [
    'test'
  ],
  license: 'MIT',
  homepage: 'http://www.biaodianfu.com',
  ignore: [
    '**/.*',
    'node_modules',
    'bower_components',
    'test',
    'tests'
  ],
  dependencies: {
    jquery: '^2.2.0'
  }
}

```
 

注意看，它已经加入了jQuery依赖关系。现在假设也想用twitter bootstrap，我们可以用下面的命令安装twitter bootstrap并更新bower.json文件：

> $ bowerinstallbootstrap --save
 
-save 就是把下载的包信息写入到配置文件的依赖项里，它会自动安装最新版本的bootstrap并更新bower.json文件：

```
{
  "name": "newone",
  "authors": [
    "biaodianfu <biaodianfu@gmail.com>"
  ],
  "description": "a new one project",
  "main": "newone.js",
  "moduleType": [
    "es6"
  ],
  "keywords": [
    "test"
  ],
  "license": "MIT",
  "homepage": "http://www.biaodianfu.com",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "dependencies": {
    "jquery": "^2.2.0",
    "bootstrap": "^3.3.6"
  }
}
```
 

需要注意的是，这里有两个版本的依赖，一个是dependencies，另一个是devDependencies，分别代表生产环境和开发环境中的依赖包，它们可以分别通过下面两个指令自动添加：

> bower install jquery --save         //添加到dependencies

> bower install angular --save-dev        //添加到devDependencies
 

按照上面的做法，例如，我创建了一个前端开发的较为齐全的包，就可以挂在git或者bower的官网上了。而你要做的是，只把这个bower.jsonpush到线上即可。别人通过下载这个bower.json文件，在已经安装bower的前提下，直接运行bower install就可以使用这个前端开发包了。

将包发布到bower.com

你可以注册自己的包，这样其他人也可以使用了，这个操作只是在服务器上保存了一个映射，服务器本身不托管代码。

提交你的 bower 包给 bower.com：

>bowerregister <my-package-name> <git-endpoint>
 
实例：在 bower.com 登记jquery

>bower register jquery git://github.com/jquery/jquery
 
注意，如果你的库与现有的库重名，就会提交失败。

