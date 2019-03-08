Xterm.js是一个用TypeScript编写的前端组件，它允许应用程序在浏览器中为用户提供功能齐全的终端。它被VS Code，Hyper和Theia等热门项目所使用。

特征

终端应用只是工作：Xterm.js与大多数终端应用程序，如bash，vim和tmux，这包括基于光标的应用程序和鼠标事件支持支持

Perfomant：Xterm.js 非常快，它甚至还包括一个GPU加速的渲染器

丰富的unicode支持：支持CJK，表情符号和IME

自包含：需要零依赖性才能工作

可访问：可以使用该screenReaderMode选项打开屏幕阅读器支持

还有更多：链接，主题，插件，记录良好的API等。

入门

首先你需要安装模块，我们只通过npm发送，所以你需要安装，然后运行以下命令添加xterm.js作为依赖项：

npm install xterm

要开始使用您的浏览器xterm.js，添加xterm.js和xterm.css你的HTML页面的头部。然后创建一个<div id="terminal"></div>xterm可以附加到其自身。最后实例化Terminal对象，然后open使用DOM对象调用该函数div。
```
<!doctype html>
  <html>
    <head>
      <link rel="stylesheet" href="node_modules/xterm/dist/xterm.css" />
      <script src="node_modules/xterm/dist/xterm.js"></script>
    </head>
    <body>
      <div id="terminal"></div>
      <script>
        var term = new Terminal();
        term.open(document.getElementById('terminal'));
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
      </script>
    </body>
  </html>

```
真实世界的用途


Xterm.js用于几个世界级的应用程序，以提供良好的终端体验。

```
SourceLair：浏览器中的IDE，为用户提供基于xterm.js的全功能Linux终端
Microsoft Visual Studio Code：现代，多功能且功能强大的开源代码编辑器，提供基于xterm.js的集成终端
ttyd：一种用于在网络上共享终端的命令行工具，具有基于xterm.js的全功能终端仿真
Katacoda：Katacoda是面向软件开发人员的交互式学习平台，涵盖了最新的Cloud Native技术。
Eclipse Che：开发人员工作区服务器，云IDE和Eclipse下一代IDE。
Codenvy：开发团队的云工作空间。
CoderPad：面向程序员的在线面试平台。以多种编程语言运行代码，结果显示为xterm.js。
WebSSH2：使用xterm.jssocket.io和ssh2的基于Web的SSH2客户端。
Spyder终端：Spyder IDE上嵌入的完整系统终端。
Cloud Commander：带控制台和编辑器的正统Web文件管理器。
Codevolve：交互式编码和Web开发课程的在线平台。直播容器支持的终端使用xterm.js。
RStudio：RStudio是R的集成开发环境（IDE）。
Atom终端：Atom文本编辑器的简单终端。
Eclipse Orion：一个在云中运行的现代开源软件开发环境。在云中编码，部署和运行。
Gravitational Teleport：Gravitational Teleport是一种现代SSH服务器，用于通过SSH或HTTPS远程访问Linux服务器群集。
Hexlet：实用编程课程（JavaScript，PHP，Unix，数据库，函数式编程）。从第一行代码到第一份作业的稳定路径。
Selenoid UI：Selenium Hub的可扩展golang实现的简单UI，名为Selenoid。我们使用XTerm通过docker容器上的websockets传输日志。
Portainer：Docker的简单管理UI。
SSHy：基于HTML5的SSHv2 Web客户端，采用E2E加密xterm.js，SJCL和websockets。
JupyterLab： Jupyter的可扩展计算环境，支持跨所有编程语言的交互式数据科学和科学计算。
Theia：Theia是一个用TypeScript实现的云和桌面IDE框架。
Opshell Ops Helper工具可以让您更轻松地在多个组织中使用AWS实例。
Proxmox VE：Proxmox VE是一个完整的企业虚拟化开源平台。它将xterm.js用于容器终端和主机shell。
脚本运行器：在Atom中运行脚本（或shell）。
Whack Whack Terminal：适用于Visual Studio 2017的终端模拟器。
VTerm：基于Electron和React的可扩展终端仿真器。
electerm：electerm是基于electron / node-pty / xterm的终端/ ssh / sftp客户端（mac，win，linux）。
Kubebox：Kubernetes集群的终端控制台。
Azure云外壳：Azure云外壳是一个Microsoft管理的管理员计算机，基于Azure构建，适用于Azure。
atom-xterm：用于在Atom工作区内提供终端的Atom插件。
rtty：反向代理WebTTY。它由客户端和服务器组成。
Pisth：适用于iOS的SFTP和SSH客户端
深奥：Abstruse CI是一个基于Node.JS和Docker的持续集成平台。
Microsoft SQL Operations Studio：一种数据管理工具，支持从Windows，macOS和Linux使用SQL Server，Azure SQL DB和SQL DW
FreeMAN：面向高级用户的免费跨平台文件管理器
流利终端：基于UWP和Web技术的终端仿真器。
Hyper：基于Web技术构建的终端
诊断：更快地解决问题的更好方法。捕获，共享和重新应用故障排除知识，以便您可以专注于解决重要问题。
GoTTY：一个简单的命令行工具，它将您的终端作为基于xterm.js的Web应用程序共享

```

链接： https://xtermjs.org/