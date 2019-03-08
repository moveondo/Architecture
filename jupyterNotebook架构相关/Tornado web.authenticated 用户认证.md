
### tornado 之authenticated和session 简单登录

1.登录检查（装饰器的使用）

我们登录的时候需要验证，但是如果有很多地方需要验证，这个时候就会出现很多重复代码的情况，这个时候我们需要一个不改变函数运行，又能给函数加上验证过程方法，很明显，我们可以使用装饰器来达到这个功能，代码如下：

```
def auth(fun):
    def wrapper(self,*args,**kwargs):
        id = self.get_secure_cookie('ID')
        if id:
            return fun(self,*args,**kwargs)
        else:
            self.redirect('/login')
    return wrapper

```

定义好装饰器之后，就可以直接去修饰需要验证的方法  

```
class IndexHandler(BaseHandler):
    @auth
    def get(self):
        self.write('登录成功---index')
```

使用装饰器可以很方便我们去做登录检查，可以节省出大量的代码，增加程序的可读性和程序整体的美观。

2.authenticated

虽然我们自己可以做这个登录检查，但是在tornado内部给我们提供了一个内置的装饰器`authenticated`这个可以帮我们自动的进行登录验证，`authenticated`可以省去我们自己重复造轮子的过程，但是在使用的时候需要注意几点：


```
Application中添加配置
login_url='/login',

# 重写 get_current_user 方法
class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        current_user = self.get_secure_cookie('ID')
        if current_user:
            return current_user
        return None
# 装饰需要验证的方法      
@authenticated     
```

有些时候我们需要跳转到之前的页面怎么做呢？当我们使用`authenticated`的时候我们可以十分方便的做这件事情。我们观察跳转之后的url就可以发现，如果是使用`authenticated`装饰器装饰之后，而跳转到登录页面之后，在登录页面的url中，可以看到最后面会添加上一个next参数，这个就是我们刚才跳转的路由，通过这个参数，我们就可以很方便的跳转回之前的的路由，具体实现如下:

```
class LoginHandler(BaseHandler):
    def get(self):
        nextname = self.get_argument('next','')
        self.render('authenticated.html',nextname=nextname)
    def post(self):
        nextname = self.get_argument('next', '')
        username = self.get_argument('name','')
        username = User.by_name(username)
        passwd = self.get_argument('password', '')
        print(username)
        if username and username[0].password == passwd:
            self.set_secure_cookie('ID',username[0].username,max_age=100)
            self.redirect(nextname)
        else:
            self.render('authenticated.html',nextname=nextname)
```

页面代码做如下的改变就行：

```
<form method="post" action="/login?next={{nextname}}">
    <p>用户名<br><input type="text" name="name"></p>
    <p>密码<br><input type="text" name="password"></p>
    <input type="submit">
</form>

```

配合使用模板的传参，可以很方便的进行跳转。

3.session

cookie中不能存放存放用户的敏感信息，那么cookie里面就只能存放一些随机的字符串，但是如果这样的话，那么服务器端又怎样知道是那个用户呢？

我们可以建立一个会话来做这件事情，这个会话里面会存储随机字符串和可以唯一确定用户的信息。

由于tornado没有内置session模块，所以使用pycket这个模块中封装好的session模块来，要想使用首先要安装：

>pip install pyckey
>pip install redis

安装好之后就可以使用了，使用很简单，注意一下几点：


```
from pycket.session import SessionMixin

# 1.在Application添加 pycket 的配置
pycket={
  'engine': 'redis',
  'storage': {
    'host': 'localhost',
    'port': 6379,
    'db_sessions': 5,
    'db_notifications': 11,
    'max_connections': 2**31,
  },
  'cookies': {
    'expires_days': 30,
    'max_age': 100
  },
},

# 2.改 self.set_secure_cookie 为 self.session.set
# self.set_secure_cookie('ID',username[0].username,max_age=100)
self.session.set('user',username[0].username)

# 3.改 self.get_secure_cookie 为 self.session.get
# current_user = self.get_secure_cookie('ID')
current_user = self.session.get('user')

```

以上就可以使用`session`了，这个`session`的工作原理是如下：

1. 使用`set`方法，为输入的用户信息生成一串随机字符串
2. 将这个字符串和对应的用户信息做成键值对，放到`redis`数据库中
3. 将字符串处理之后放入到`cookie`中，发送给浏览器
4. 浏览器请求时将`cookie`中的信息发送到服务器，`tornado`接受到之后解析出来，去`redis`查找，找到就验证成功

使用`session`有如下好处：

1. 可以不要在`cookie`中存放敏感信息
2. 减少数据传输需要的时间
3. 减少加密解密的时间

`session`的使用很简单，但是安全性会有一个很大的提升，因此使用非常多，一定要掌握使用方法。

4.跨站防伪造请求的防范

跨站伪造请求(Cross-site request forgery)](https://en.wikipedia.org/wiki/Cross-site_request_forgery)， 简称为 `XSRF`，是个性化 Web 应用中常见的一个安全问题。前面的链接也详细讲述了` XSRF `攻击的实现方式。

当前防范` XSRF` 的一种通用的方法，是对每一个用户都记录一个无法预知的` cookie `数据，然后要求所有提交的请求中都必须带有这个` cookie `数据。如果此数据不匹配 ，那么这个请求就可能是被伪造的。

`Tornado `有内建的 `XSRF `的防范机制，要使用此机制，只需要在模板中添加如下代码：

```
<form method="post" action="/login?next={{nextname}}">
    {% module xsrf_form_html() %}   <!--添加这行代码就可以了-->
    <p>用户名<br><input type="text" name="name"></p>
    <p>密码<br><input type="text" name="password"></p>
    <input type="submit">

``` 





#### Tornado web.authenticated 用户认证浅析

在Web服务中会有用户登录后的一系列操作, 如果一个客户端的http
请求要求是用户登录后才能做得操作, 那么 Web服务器接收请求时
需要判断该请求里带的数据是否有用户认证的信息.

使用 Tornado 框架开发Web服务, 框架里提供了tornado.web.authenticated
的 decorator 的辅助开发者做用户登录认证, 即开发者在实现一个 handler
(对应一个url资源, 继承于tornado.web.RequestHandler)时,
该 url的资源操作需要有用户认证或者登录为前提, 那么在资源请求的方法
覆写时(overwritten), 例如在 get 与 post 方法定义前以
tornado.web.authenticated 装饰,并且同时覆写 get_current_user
方法(RequestHandler只是定义空函数, 默认放回None). 在覆写之后,
RequestHandler 类的实例里 current_user 就会有值. current_user
在 tornado源码中是 getter setter的实现, 真正的成员变量是 _current_user
(稍后解析tornado里的源码). authenticated 即实现了 current_user 判断
这一过程来验证用户.

 

先来看简单的例子(已添加注释 代码来自中文文档):

不使用 tornado.web.authenticated, 直接判断 current_user 成员


 简单的用户认证实现
 
 BaseHandler 基类覆写 get_current_user
 
 覆写后 RequestHandler 的current_user成员会有值(稍后解释实现源码)
 
 这里简单地判断请求带的 secure cookie 是否带有 user属性的值
 
```
class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")
 
# 实际业务类实现
class MainHandler(BaseHandler):
    def get(self):
        # 判断 current_user, 如果不存在值,要求重定向到 login页面
        if not self.current_user:
            self.redirect("/login")
            return
        name = tornado.escape.xhtml_escape(self.current_user)
        self.write("Hello, " + name)
 
class LoginHandler(BaseHandler):
    def get(self):
        self.write('<html><body><form action="/login" method="post">'
                   'Name: <input type="text" name="name">'
                   '<input type="submit" value="Sign in">'
                   '</form></body></html>')
 
    def post(self):
        self.set_secure_cookie("user", self.get_argument("name"))
        self.redirect("/")
 
application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/login", LoginHandler),
], cookie_secret="61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
 
 
```

 

在 Get 方法上添加 authenticated 装饰器实现用户认证:

 
 使用装饰器实现用户认证
 
```
class MainHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        """
        直接写业务逻辑代码, 方法中不必考虑多写一份判断
        代码少即是多的原则
        """
        name = tornado.escape.xhtml_escape(self.current_user)
        self.write("Hello, " + name)
```

 cookie_secret 是用于 secure_cookie 加密实现的
 
```
settings = {
    "cookie_secret": "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
    "login_url": "/login",
}  
 
application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/login", LoginHandler),
], **settings) #**  
 
```
 
 

看完实现的小例子, 就要探究其 decorator 的实现细节:
以知晓 tornado 为何可以辅助开发者更方便实现用户认证
源码版本 tornado 4.0.2 tornado/web.py (已添加注释):


RequestHandler current_user 与 authenticated实现细节
 
```
class RequestHandler(object):
    """    
    property 装饰器将 current_user 设置为 getter 方法.
    即 handler.current_user 可以当作类数据成员的方式书写使用
    不需要以方法书写　
    """
    @property
    def current_user(self):
        """The authenticated user for this request.
 
 
        This is a cached version of `get_current_user`, which you can
        override to set the user based on, e.g., a cookie. If that
        method is not overridden, this method always returns None.
 
 
        We lazy-load the current user the first time this method is called
        and cache the result after that.
        """
        """
        延迟(lazy)方式加载 _current_user值,
        即从 get_current_user()方法中获取值,
        因此 get_current_user 需要开发者自己覆写内容.  
        """
        if not hasattr(self, "_current_user"):
            self._current_user = self.get_current_user()
        return self._current_user
 
    @current_user.setter
    def current_user(self, value):
        self._current_user = value
 
    def get_current_user(self):
        """
        默认返回　None,
        之前的 BaseHandler 的样例代码覆写判断逻辑时
        使用的是 cookie 是否存在 user 属性作为判断
        """
 
        """Override to determine the current user from, e.g., a cookie."""
        return None  
 
# authenticated 装饰器
def authenticated(method):
    """Decorate methods with this to require that the user be logged in.
 
    If the user is not logged in, they will be redirected to the configured
    `login url <RequestHandler.get_login_url>`.
 
    If you configure a login url with a query parameter, Tornado will
    assume you know what you're doing and use it as-is.  If not, it
    will add a `next` parameter so the login page knows where to send
    you once you're logged in.
    """
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        """
        这里调用的是 current_user 的 get 方法(property装饰),
        紧接着调用 return self._current_user
        原本放在业务逻辑代码中做的判断, 现在交给 decorator 帮助  
        开发者, 开发者可以少写代码, 专注自己的业务
        """
        if not self.current_user:    
            if self.request.method in ("GET", "HEAD"):
                url = self.get_login_url()
                if "?" not in url:
                    if urlparse.urlsplit(url).scheme:
                        # if login url is absolute, make next absolute too
                        next_url = self.request.full_url()
                    else:
                        next_url = self.request.uri
                    url += "?" + urlencode(dict(next=next_url))
                self.redirect(url)
                return
            raise HTTPError(403)
        return method(self, *args, **kwargs)
    return wrapper  
 
```
 

这里我们要理解的是 authenticated 装饰器的用法, 继承于
RequestHandler 的 handler 类, 开发者覆写 get post 方法
实现时, 如果要判断请求的合理性(即用户是否被认证过), 可
以在覆写方法里业务代码前加上判断代码, 这样也可以实现
同样的功能, 而 Tornado 利用了Python的语言特性, 将用户
认证的代码通过 decorator “桥接” 完成, 即 get post 这些 http
请求方法里的代码可以保持功能的专注度. 此外, 如果开发
需求更改, 资源请求不需要用户认证时, 可直接注释或者删除
方法上方的 decorator 即可, 方便快捷省事:).

用户认证未通过的重定向设置
当用户没有认证通过时, 可以在程序入口, 设置 settings dict 属性,
设置 login_url 属性 参考文档

“””
login_url: The authenticated decorator will redirect to this url
if the user is not logged in. Can be further customized
by overriding RequestHandler.get_login_url
“””

样例:

```

settings 属性设置
 
settings = dict(


login_url = "/login",
 ...
)
 

tornado.web.authenticated 未通过时, 默认  
redirect 到 "/login"  


application = tornado.web.Application(handlers, **settings)  
```
 

用户认证在什么场景下使用:

我们通常的业务需求中, 会涉及到 session会话保持 与 cookie 的
用户数据的读取场景, 即从 http 请求的 cookie 中读取 sessionid,
以 sessionid 为 key, 从内存或者缓存中判断 sessionid 是否存在值,
以此作为用户登录状态的认证, 或者是用户重新打开浏览器, 之前
浏览器缓存的cookie里的sessionid重新发送给客户端, 用户无需
重新输入账号密码, 即可直接在登录状态. 较前两年基于 memcache
做服务端 session 的缓存, 现在可以使用 Redis 服务替代 memcache,
做缓存数据库的工作.

参考： https://www.cnblogs.com/jingqi/p/8119922.html

