
### Tornado （python的web框架）

Tornado是一种 Web 服务器软件的开源版本。Tornado 和现在的主流 Web 服务器框架（包括大多数 Python 的框架）有着明显的区别：它是非阻塞式服务器，而且速度相当快。

得利于其非阻塞的方式和对epoll的运用，Tornado 每秒可以处理数以千计的连接，因此 Tornado 是实时 Web 服务的一个 理想框架。

基本信息

Tornado就是我们在 FriendFeed 的 Web 服务器及其常用工具的开源版本 [1]  。Tornado 和现在的主流 Web 服务器框架（包括大多数 Python 的框架）有着明显的区别：它是非阻塞式服务器，而且速度相当快。
得利于其 非阻塞的方式和对epoll的运用，Tornado 每秒可以处理数以千计的连接，因此 Tornado 是实时 Web 服务的一个 理想框架。我们开发这个 Web 服务器的主要目的就是为了处理 FriendFeed 的实时功能
 ——在 FriendFeed 的应用里每一个活动用户都会保持着一个服务器连接。（关于如何扩容 服务器，以处理数以千计的客户端的连接的问题，请参阅The C10K problem）
 
 
1.Tornado

Tornado：python编写的web服务器兼web应用框架

1.1.Tornado的优势

* 轻量级web框架
* 异步非阻塞IO处理方式
* 出色的抗负载能力
* 优异的处理性能，不依赖多进程/多线程，一定程度上解决C10K问题
* WSGI全栈替代产品，推荐同时使用其web框架和HTTP服务器

1.2.Tornado VS Django

 Django：重量级web框架，功能大而全，注重高效开发 
* 内置管理后台 
* 内置封装完善的ORM操作 
* session功能 
* 后台管理 
* 缺陷：高耦合
 Tornado：轻量级web框架，功能少而精，注重性能优越 
* HTTP服务器 
* 异步编程 
* WebSocket 
* 缺陷：入门门槛较高

2.安装

> 输入命令：pip install tornado

**备注：** Tornado应该运行在类Unix平台，为了达到最佳的性能和扩展性，仅推荐Linux和BSD(充分利用Linux的epoll工具和BSD的kqueue达到高性能处理的目的)

3.使用

3.1.Tornado入门程序 - （一）
```
#-*- coding:utf-8 -*-
import tornado.web
import tornado.ioloop


#定义处理类型
class IndexHandler(tornado.web.RequestHandler):
    #添加一个处理get请求方式的方法
    def get(self):
        #向响应中，添加数据
        self.write('好看的皮囊千篇一律，有趣的灵魂万里挑一。')

if __name__ == '__main__':
    #创建一个应用对象
    app = tornado.web.Application([(r'/',IndexHandler)])
    #绑定一个监听端口
    app.listen(8888)
    #启动web程序，开始监听端口的连接
    tornado.ioloop.IOLoop.current().start()
```

1 .在pycharm中直接运行代码 

2 .如果是在ubuntu，在命令窗口输入


4.Tornado 代码解析

4.1.入门程序代码解析
```
tornado.web：tornado的基础web框架

RequestHandler：封装对请求处理的所有信息和处理方法
get/post/..：封装对应的请求方式
write()：封装响应信息，写响应信息的一个方法
tornado.ioloop：核心io循环模块，封装linux的epoll和BSD的kqueue， tornado高性能处理的核心。

current()返回当前线程的IOLoop实例对象
start()启动IOLoop实力对象的IO循环，开启监听
```

4.2.httpserver底层处理
```
httpserver监听端口
tornado.httpserver.HTTPServer(app)
httpserver.listen(port)

httpserver实现多进程操作
tornado.httpserver.HTTPServer(app)
httpserver.bind(port)
httpserver.start(0/None/<0/num)


# -*- coding:utf-8 -*-
from tornado.web import Application,RequestHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer

class IndexHandler(RequestHandler):
    def get(self):
        self.write('给自己一点时间，理清所有的荒唐与期望。')

if __name__ == '__main__':
    app = Application([(r'/',IndexHandler)])
    http_server = HTTPServer(app)
    #最原始的方式
    http_server.bind(8888)
    http_server.start(1)

    #启动Ioloop轮循监听
    IOLoop.current().start()
```

 同时打开两个窗口测试发现实现了多进程

4.3.options配置
全局配置
```
tornado.options.define(
    name, default, type, multiple, help
)
```

命令行参数转换
>tornado.options.parse_command_line()


```
#-*- coding:utf-8 -*-

from tornado.web import RequestHandler,Application
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
import tornado.options

#定义变量
tornado.options.define('port',default=8000,type=int,help="this is the port >for application")

class IndexHandler(RequestHandler):
   def get(self):
       self.write('我们既然改变不了规则，那就做到最好')

if __name__ == '__main__':
   app = Application([(r'/',IndexHandler)])
   tornado.options.parse_command_line()

   http_server = HTTPServer(app)
   http_server.bind(tornado.options.options.port)
   http_server.start(1)
   #启动IOLoop轮循监听
   IOLoop.current().start()
```

 通过命令窗口输入port来访问 
 
通过使用我们命令窗口设定的port进行访问

配置文件

#即在当前py文件目录创建config文件，并在py代码中加入以下代码，

>tornado.options.parse_config_file("./config")

配置模块：跟配置文件类似

4.4.application配置

程序调试之debug配置

#自动重启+取消缓存模板+取消缓存静态文件+提供追踪信息

>tornado.web.Application([(..)], debug=True)

注：开发之初可以设置debug=True方便调试，开发完毕改为False.


路由信息初始化参数配置

tonado.web.Application([(r””, Handler, {k:v})])

def initialize(self, k)


路由名称设置及反解析

#名称设置
```
tornado.web.Application([
    url(r””, handler, {k,v}, name=“”)
])
```
#反解析操作

>reverse_url(name)

实例

```
# -*- coding:utf-8 -*-

from tornado.web import Application, RequestHandler, url
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer


class IndexHandler(RequestHandler):

    def get(self):
        self.write("<a href='"+self.reverse_url("login")+"'>用户登录</a>")


class RegistHandler(RequestHandler):
    def initialize(self, title):
        self.title = title

    def get(self):
        self.write("注册业务处理:" + str(self.title))


class LoginHandler(RequestHandler):
    def get(self):
        self.write("用户登录页面展示")

    def post(self):
        self.write("用户登录功能处理")


if __name__ == "__main__":
    app = Application(
        [
            (r"/", IndexHandler),
            (r"/regist", RegistHandler, {"title": "会员注册"}),
            url(r"/login", LoginHandler, name="login"),
        ]
    )

    http_server = HTTPServer(app)
    http_server.listen(8000)

    IOLoop.current().start()
```

4.5.参数传递

get方式传递参数
```
get_query_arguments(name,default=_ARG_DEFAULT,strip=True)
get_query_argument(name ,strip=True)


post方式传递参数
get_body_arguments(name, default=_ARG_DEFAULT,strip=True)
get_body_argument(name ,strip=True)

```
实例
```
# -*- coding:utf-8 -*-

from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer


class IndexHandler(RequestHandler):

    def get(self):
        # 获取get方式传递的参数
        username = self.get_query_argument("username")
        usernames = self.get_query_arguments("username")

        print (username)
        print (usernames)

    def post(self):
        # 获取post方式传递的参数
        username = self.get_body_argument("username")
        usernames = self.get_body_arguments("username")

        print (username)
        print (usernames)

if __name__ == "__main__":
    app = Application([(r"/",IndexHandler)])

    app.listen(8000)

    IOLoop.current().start()
```
#网页运行时需要传入参数

#192.168.11.79:8000/?username=123


混合方式

get_arguments(..)/get_argument(..)


实例
```
# -*- coding:utf-8 -*-

from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop


class IndexHandler(RequestHandler):

    def get(self):
        # 获取get方式的参数
        user = self.get_argument("user")
        print("get方式获取参数：" + str(user))

    def post(self):
        # 获取post方式的参数
        user = self.get_argument("user")
        print("post方式获取参数：" + user.encode("utf-8"))


if __name__ == "__main__":
    app = Application([(r"/", IndexHandler)])

    app.listen(8000)

    IOLoop.current().start()
```

其他参数

通过request获取参数数据

method/host/uri/path/query/version/headers/body/remote_ip/files


实例 

- request/json
```
# -*- coding:utf-8 -*-

from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop


class IndexHandler(RequestHandler):
    def get(self):
        print self.request

        json_str = {"username": "admin", "password": "123123"}
        self.write(json.dumps(json_str))



if __name__ == "__main__":
    app = Application([(r"/", IndexHandler)])

    app.listen(8000)

    IOLoop.current().start()

```
```
header 
.add_header() .set_header() .set_default_headers() 
设置响应HTTP头, 前两者的不同点在于多次设置同一个项时, .add_header()会叠加参数, 而.set_header()则以最后一次为准. 
.set_default_headers()比较特殊, 是一个空方法, 可根据需要重写, 作用是在每次请求初始化RequestHandler时设置默认headers.
.clear_header() .clear()
.clear_header()清除指定的headers, 而.clear()清除.set_default_headers()以外所有的headers设置.
# add_header
self.add_header('Foo', 'one')
self.add_header('Foo', 'two')
# set_header
self.set_header('Bar', 'one')
self.set_header('Bar', 'two')

# HTTP头的设置结果
# Foo → one, two
# Bar → two


```
```
# -*- coding:utf-8 -*-

from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop


class IndexHandler(RequestHandler):
    def set_default_headers(self):
        # 第二种响应头设置方式
        print("---------> 响应头set_default_headers()执行")
        self.set_header("Content-type", "application/json; charset=utf-8")
        self.set_header("qiku", "奇酷信息")

    def get(self):
        # 第一种操作响应头的方式：
        # self.set_header("Content-type", "application/json")
        print("---------->get方法执行")
        self.write("{'name':'jerry'}")
        self.set_header("qiku", "qikuedu.com")


if __name__ == "__main__":
    app = Application([(r"/", IndexHandler)])

    app.listen(8000)

    IOLoop.current().start()


```
writerror 

.send_error()用于发送HTTP错误页(状态码). 该操作会调用.clear() .set_status()

.write_error()用于清除headers, 设置状态码, 发送错误页. 重写.write_error()可以自定义错误页.
```
# -*- coding:utf-8 -*-

from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop


class IndexHandler(RequestHandler):

    def get(self):
        self.write("hello qikuedu.com")

        self.send_error(404, msg="页面丢失", info="家里服务器搞对象去了")

    def write_error(self, status_code, **kwargs):
        self.write("<h1>出错啦，工程师MM正在赶来的途中...</h1>")
        self.write("<p>错误信息:%s</p>" % kwargs["msg"])
        self.write("<p>错误描述:%s</p>" % kwargs["info"])


if __name__ == "__main__":
    app = Application([(r"/", IndexHandler)])

    app.listen(8000)

    IOLoop.current().start()
```

数据流

.write()

将数据写入输出缓冲区. 如果直接传入dict, 那Tornado会自动将其识别为json, 并把Content-Type设置为application/json, 如果你不想要这个Content-Type, 那么在.write()之后,
 调用.set_header()重新设置就好了. 需要注意的是, 如果直接传入的是list, 考虑到安全问题(json数组会被认为是一段可执行的JavaScript脚本, 且<script src="*/secret.json">可以绕过跨站限制),list将不会被转换成json.
 

.flush()

将输出缓冲区的数据写入socket. 如果设置了callback, 会在完成数据写入后回调. 需要注意的是, 同一时间只能有一个”等待”的flush callback, 
如果”上一次”的flush callback还没执行, 又来了新的flush, 那么”上一次”的flush callback会被忽略掉.

.finish()

完成响应, 结束本次请求. 通常情况下, 请求会在return时自动调用.finish(), 
只有在使用了异步装饰器@asynchronous或其他将._auto_finish设置为False的操作, 才需要手动调用.finish().

cookie
```
# -*- coding:utf-8 -*-

from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop


class IndexHandler(RequestHandler):

    def get(self):
        self.write("hello qikuedu.com")

        self.set_cookie("loginuser", "admin老王")

        print self.get_cookie("loginuser")

        print self.cookies


if __name__ == "__main__":
    app = Application([(r"/", IndexHandler)])

    app.listen(8000)

    IOLoop.current().start()


```

.render()

返回渲染完成的html. 调用后不能再进行输出操作.

.redirect()

重定向, 可以指定3xx重定向状态码. 调用后不能再进行输出操作.

 临时重定向 301

>self.redirect('/foo')

 永久重定向 302

>self.redirect('/foo', permanent=True)

 指定状态码, 会忽略参数 permanent

>self.redirect('/foo', status=304)



```
# -*- coding:utf-8 -*-

from tornado.web import Application, RequestHandler, url
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer


class IndexHandler(RequestHandler):

    def get(self):
        self.write("<a href='"+self.reverse_url("login")+"'>用户登录</a>")


class RegistHandler(RequestHandler):
    def initialize(self, title):
        self.title = title

    def get(self):
        self.write("注册业务处理:" + str(self.title))


class LoginHandler(RequestHandler):
    def get(self):
        self.write("用户登录页面展示")

    def post(self):
        self.write("用户登录功能处理")


if __name__ == "__main__":
    app = Application(
        [
            (r"/", IndexHandler),
            (r"/regist", RegistHandler, {"title": "会员注册"}),
            url(r"/login", LoginHandler, name="login"),
        ]
    )

    http_server = HTTPServer(app)
    http_server.listen(8000)

    IOLoop.current().start()
```
 
链接：https://blog.csdn.net/xc_zhou/article/details/80637714;

https://blog.csdn.net/xiaobaihe0825/article/details/26295207