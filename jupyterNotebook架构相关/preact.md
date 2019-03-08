前一段时间由于React Licence的问题，团队内部积极的探索React的替代方案，同时考虑到之后可能开展的移动端业务，团队目标是希望能够找到一个迁移成本低，体量小的替代产品。经过多方探索，Preact进入了我们的视野。从接触到Preact开始，一路学习下来折损了许多头发，也收获不少思考，这里想和大家介绍一下Preact的实现思路，也分享一下自己的思考所得。

Preact是什么

一句话介绍Preact，它是React的3KB轻量替代方案，拥有同样的ES6 API。如果觉得就这么一句话太模糊的话，我还可以再啰嗦几句。Preact = performance + react，这是Preact名字的由来，其中一个performance足以窥见作者的用心。下面这张图反映了在长列表初始化的场景下，不同框架的表现，可以看出Preact确实性能出众。

高性能，轻量，即时生产是Preact关注的核心。基于这些主题，Preact关注于React的核心功能，实现了一套简单可预测的diff算法使它成为最快的虚拟 DOM 框架之一，
同时preact-compat为兼容性提供了保证，使得Preact可以无缝对接React生态中的大量组件，同时也补充了很多Preact没有实现的功能。


链接： https://www.sohu.com/a/204132178_500651