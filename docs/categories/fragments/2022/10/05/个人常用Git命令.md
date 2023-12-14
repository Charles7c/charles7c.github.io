---
title: 个人常用 Git 命令
author: 查尔斯
date: 2022/10/05 21:30
isTop: true
categories:
 - 杂碎逆袭史
tags:
 - Git
---

# 个人常用 Git 命令 <Badge text="持续更新" type="warning" />

## 初始配置

### 全局配置

在进行版本管理之前，首先需要对 Git 进行用户配置。

全局配置指的是当前终端上的所有仓库使用该配置，可以在任何位置设置。

```shell
# 全局配置用户名
git config --global user.name "用户名"
# 全局配置用户邮箱
git config --global user.email "用户邮箱"
```

### 局部配置

局部配置指的是当前终端上的指定仓库使用该配置，需要在指定仓库内进行设置。

```shell
# 局部配置用户名
git config user.name "用户名"
# 局部配置用户邮箱
git config user.email "用户邮箱"
```

## 版本控制相关

### 初始化仓库

自动创建 master 分支。

```shell
git init
```

### 查看工作区状态

```shell
git status
```

### 将工作区的修改添加到暂存区

::: tip 笔者说
该命令可执行多次，来实现将多个文件的修改添加到暂存区。另外，如果某个文件在添加到暂存区后又发生了变更，在没有提交到版本库之前，依然需要执行一次该命令。
:::

```shell
git add 文件名1 [文件名2...]
```

### 将暂存区的修改提交到版本库

```shell
git commit -m "提交信息"
```

### 撤销未提交到暂存区的修改

```shell
git restore 文件名
```

### 撤销暂存区的修改

```shell
git restore --staged 文件名
```

### 查看提交日志

```shell
# --oneline 以一行格式显示提交日志
# 查看该文件的提交日志
git log [--oneline] [文件名]
```

### 查看操作日志

相比于 `git log`，reflog 可以查看到所有的操作行为，例如：回退版本······

```shell
git reflog
```

### 回退版本

::: tip 笔者说
1、回退版本的数量较少时，可以将 `HEAD~回退版本的数量` 改为 `HEAD^` 的写法。  

`HEAD^` 相当于 `HEAD~1`，`HEAD^^` 相当于 `HEAD~2`，依次类推。  

2、回退版本的数量比较多时，建议采用指定 Commit ID 来回退的方法
:::

```shell
# --hard 回退到相应版本，放弃之前版本的修改
git reset --hard HEAD~回退版本的数量/HEAD^/Commit ID

# --soft 回退到相应版本，保留之前版本的修改
git reset --soft HEAD~回退版本的数量/HEAD^/Commit ID
```

### 修改最后一次提交的信息

::: warning 笔者说
如果你已经将之前本地版本推送到了远程仓库，那么在下一次推送的时候就需要加上 `-f` 参数了。  

`git push -f`   

但是 GitHub 或者公司内的 GitLab 等，默认都是禁止强制推送的，需要设置一下，所以还是多加注意吧。
:::

```shell
# 如果仅修改用户名这类信息，改完在编辑模式按 : 随后按 wq 保存即可
# 信息格式参考 git log 输出
git commit --amend [--author="用户名<用户邮箱>"] [--date "日期信息"] [-m 提交信息]
```

### 修改指定提交的信息

::: warning 笔者说
如果你已经将之前本地版本推送到了远程仓库，那么在下一次推送的时候就需要加上 `-f` 参数了。  

`git push -f`   

但是 GitHub 或者公司内的 GitLab 等，默认都是禁止强制推送的，需要设置一下，所以还是多加注意吧。
:::

```shell
# 1.开始（Commit ID 是要修改提交信息的版本的上一个版本的 Commit ID）
git rebase -i Commit ID
# 2.打开记事本后，将对应提交前的 pick 改为 e 或 edit，保存退出
# 3.进行修订，同上
# 信息格式参考 git log 输出
git commit --amend [--author="用户名<用户邮箱>"] [--date "日期信息"] [-m 提交信息]
# 4.完成
git rebase --continue
```

## 远程仓库相关

### 生成 SSH Key

```shell
# 一路回车即可，最终会在 ${user.home}/.ssh/ 下生成 id_rsa.pub 公钥文件和 id_rsa 私钥文件
ssh-keygen -t rsa -C "用户邮箱"
```

### 添加远程仓库

```shell
git remote add origin 远程仓库Git地址
```

### 查看远程仓库信息

```shell
git remote -v
```

### 删除远程仓库

```shell
git remote rm origin
```

### 将本地分支推送到远程仓库

```shell
# 第一次推送时，加上 [-u]，后续不需要加 [-u]
# 如果远程分支名和本地分支名相同，可以省略
# 常见用法：
#   git push -u origin master
#   git push origin master
#   git push
git push [-u] [远程主机名] [本地分支名]:[远程分支名]
```

**【谨慎】如果本地版本和远程版本不一致，可强制推送覆盖：** 

```shell
git push [--force/-f] [远程主机名] [本地分支名]:[远程分支名]
```

### 克隆远程仓库到本地

::: tip 笔者说
适用于本地不存在仓库，远程存在的情况。

例如：换了电脑，刚开始进入某个项目组等场景。
:::

```shell
git clone 远程仓库Git地址
```

### 拉取远程分支与本地分支合并

```shell
# 如果远程分支是与当前分支合并，则冒号后面的部分可以省略
# 常见用法：git pull origin
git pull [远程主机名] [远程分支名]:[本地分支名]
```

## 分支相关

### 查看本地分支

```shell
git branch
```

### 创建并切换分支

```shell
git switch -c 分支名
```

### 创建分支

```shell
git branch 分支名
```

### 切换分支

```shell
git switch 分支名
```

### 将指定分支合并到当前分支

```shell
git merge 分支名
```

### 重命名分支

```shell
git branch -m old-branch new-branch
```

## 标签相关

### 查看标签

```shell
git tag
```

### 打标签

```shell
# 将指定版本打标签
# 常见用法:
#   git tag -a v1.0.0 -m "version 1.0.0" b43375
#   git tag v1.0.0
git tag [-a 标签名] [-m 标签信息] [Commit ID]
```

### 查看指定标签详细信息

```shell
git show 标签名
```

### 删除标签

```shell
git tag -d 标签名
```

### 将本地标签推送到远程仓库

```shell
git push origin -tags
```