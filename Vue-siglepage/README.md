# Vue-siglepage

用vue开发前端页面


### 遇到问题1，根据后端返回结果判断是否显示，是否赋值class

```
 <div   :class="[ {'angle': item.productTag.length >=1},{'': item.productTag.length<= 0}]" v-if="item.productTag.length >=1">
            {{item.productTag}}
</div>
<div :class="[  {'angle': item.productTag.length>=1}, {'': item.productTag.length<=0}]"  v-else>

</div>
```

### 2.如果引用后端返回的图片链接

```
<div class="img"  :style="{ backgroundImage: 'url(' + item.productLogo + ')' }">
               
 </div>
```
与

```
 <div class="banner" :bannerURl="bannerURl" @click = "ClickBannerUrl(bannerURl)">
        <img :src="imgUrl " />
  </div>
```

### 3.点击所在区域跳转对应页面

```
HTML:
 <div class="product" v-for="(item, index) of tableData" @click = "ClickUrl(item.productForwardUrl)">
 
 </div>
 
 JAvascript:
 
  ClickUrl:function (UrL) {
         window.location.href=UrL;
  },
                
```

### 4点击banner 跳转对应链接

```
 <div class="banner" :bannerURl="bannerURl" @click = "ClickBannerUrl(bannerURl)">
        <img :src="imgUrl " />
    </div>
    
 对 bannnerURl进行赋值：
 
get:function(){
    let self = this;

    this.$http.get("/ccd/api/loanSupermarket/queryLoanProduct.htm?startPage=1&pageSize=100").then(function(res){
        self.tableData = res.data.content.productList.list;
        self.imgUrl=res.data.content.bannerList[0].productLogo;
        self.bannerURl=res.data.content.bannerList[0].productForwardUrl;
        console.log( self.imgUrl);
    },function(){
        alert('网络错误'); //失败处理
    });
},

 ClickBannerUrl:function (URL) {
                    window.location.href=URL;
  },
```

### 5 本文中的写法部分兼容性不好，以框架的思想去写的，应该按正式写法。亲测安卓机部分不兼容，ＰＣ端的微信和ＱＱ浏览器不兼容，移动端可以

```
  created(){
      this.get();
    },
   JumpWX(){
                    
       window.location.href="http://ccdspread.ppdai.com/";
     }
     
     应该写成：
     
   created:function(){
    this.get();
   },
   JumpWX:function(){

     window.location.href="http://ccdspread.ppdai.com/";
    }
     
 
```

页面短短几行可以配置：
样式为：

![](https://github.com/moveondo/frontEnd-some/tree/master/Vue-siglepage/image/img.png)  

 




