---
title: 内网CentOS服务器设置网络代理
author: 查尔斯
date: 2022/08/29 20:53
categories:
 - 杂碎逆袭史
tags:
 - Linux
 - CentOS
 - 网络代理
---

# 内网CentOS服务器设置网络代理

**C：** 今天在网管那新申请了一台服务器，打算用来做测试环境。但是内网服务器没有网络，所以需要设置一下网络代理才能满足上网要求。

<!-- more -->

## 设置http/https代理

1. 修改 profile 文件

   ```sh
   vi /etc/profile
   ```

2. 在 profile 文件末尾，追加下方配置内容

   ```shell
   # 注意：这台机器必须能够访问配置的代理服务器
   export http_proxy=http://你的代理服务器地址:你的代理服务器端口号
   export https_proxy=http://你的代理服务器地址:你的代理服务器端口号
   ```
   
   如果你的代理服务器需要登录，那么只需要如下写法即可：
   
   ```shell
   # 注意：这台机器必须能够访问配置的代理服务器
   export http_proxy=http://用户名:密码@你的代理服务器地址:你的代理服务器端口号
   export https_proxy=http://用户名:密码@你的代理服务器地址:你的代理服务器端口号
   ```


## 设置yum代理

因为安装一些环境的时候还需要用到 yum，所以给 yum 也配置一下代理。

1. 修改 yum.conf 文件

   ```shell
   vi /etc/yum.conf
   ```

2. 在 yum.conf 文件末尾，追加下方配置内容

   ```shell
   proxy=http://你的代理服务器地址:你的代理服务器端口号
   ```

   当然了，如果你的代理服务器需要登录，写法也和设置 http/https 代理时一样。

都设置完之后，执行 `reboot` 重启服务器，让配置生效即可。

## 检测是否可以上网

重启后，为了确认配置是否成功，执行 `curl` 来测试一下。

```shell
curl www.baidu.com
```

很明显，看到下面的返回就知道配置成功了，如期返回了百度的页面内容。

```html
<!DOCTYPE html>
<!--STATUS OK--><html> <head><meta http-equiv=content-type content=text/html;charset=utf-8><meta http-equiv=X-UA-Compatible content=IE=Edge><meta content=always name=referrer><link rel=stylesheet type=text/css href=http://s1.bdstatic.com/r/www/cache/bdorz/baidu.min.css><title>百度一下，你就知道</title></head> <body link=#0000cc> <div id=wrapper> <div id=head> <div class=head_wrapper> <div class=s_form> <div class=s_form_wrapper> <div id=lg> <img hidefocus=true src=//www.baidu.com/img/bd_logo1.png width=270 height=129> </div> <form id=form name=f action=//www.baidu.com/s class=fm> <input type=hidden name=bdorz_come value=1> <input type=hidden name=ie value=utf-8> <input type=hidden name=f value=8> <input type=hidden name=rsv_bp value=1> <input type=hidden name=rsv_idx value=1> <input type=hidden name=tn value=baidu><span class="bg s_ipt_wr"><input id=kw name=wd class=s_ipt value maxlength=255 autocomplete=off autofocus></span><span class="bg s_btn_wr"><input type=submit id=su value=百度一下 class="bg s_btn"></span> </form> </div> </div> <div id=u1> <a href=http://news.baidu.com name=tj_trnews class=mnav>新闻</a> <a href=http://www.hao123.com name=tj_trhao123 class=mnav>hao123</a> <a href=http://map.baidu.com name=tj_trmap class=mnav>地图</a> <a href=http://v.baidu.com name=tj_trvideo class=mnav>视频</a> <a href=http://tieba.baidu.com name=tj_trtieba class=mnav>贴吧</a> <noscript> <a href=http://www.baidu.com/bdorz/login.gif?login&amp;tpl=mn&amp;u=http%3A%2F%2Fwww.baidu.com%2f%3fbdorz_come%3d1 name=tj_login class=lb>登录</a> </noscript> <script>document.write('<a href="http://www.baidu.com/bdorz/login.gif?login&tpl=mn&u='+ encodeURIComponent(window.location.href+ (window.location.search === "" ? "?" : "&")+ "bdorz_come=1")+ '" name="tj_login" class="lb">登录</a>');</script> <a href=//www.baidu.com/more/ name=tj_briicon class=bri style="display: block;">更多产品</a> </div> </div> </div> <div id=ftCon> <div id=ftConw> <p id=lh> <a href=http://home.baidu.com>关于百度</a> <a href=http://ir.baidu.com>About Baidu</a> </p> <p id=cp>&copy;2017&nbsp;Baidu&nbsp;<a href=http://www.baidu.com/duty/>使用百度前必读</a>&nbsp; <a href=http://jianyi.baidu.com/ class=cp-feedback>意见反馈</a>&nbsp;京ICP证030173号&nbsp; <img src=//www.baidu.com/img/gs.gif> </p> </div> </div> </div> </body> </html>
```

