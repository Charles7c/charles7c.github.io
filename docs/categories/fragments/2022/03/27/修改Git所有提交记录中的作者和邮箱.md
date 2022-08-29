---
title: 修改Git所有提交记录中的作者和邮箱
author: 查尔斯
date: 2022/03/27 13:00
categories:
 - 杂碎逆袭史
tags:
 - Git
---

# 修改Git所有提交记录中的作者和邮箱

## 前言

**C：** 上一篇，笔者介绍了怎么修改 Git 最后一次提交的作者和邮箱信息。那如果你是已经提交了很多次的记录，难道一个个的回退过去修改吗？显然不可能，所以本篇笔者带着大家认识一下如何批量修改 Git 提交记录中的作者和邮箱信息。

## 问题解决

解决方法其实就是编写一个脚本来进行批量替换。

1. 新建一个 sh / bat 格式的脚本文件（如果你是在 cmd 中执行，那就用 bat 格式，如果是在 git bash 中执行就用 sh）

2. 复制下方脚本内容到脚本文件中，然后编辑替换好错误邮箱、正确作者和邮箱（如果是在 cmd 中执行，#!/bin/sh 就替换为 #!/bin/bat）

   ```sh
   #!/bin/sh
   
   git filter-branch --env-filter '
   WRONG_EMAIL="错误的邮箱"
   NEW_NAME="正确的作者名"
   NEW_EMAIL="正确的邮箱"
   
   if [ "$GIT_COMMITTER_EMAIL" = "$WRONG_EMAIL" ]
   then
       export GIT_COMMITTER_NAME="$NEW_NAME"
       export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
   fi
   if [ "$GIT_AUTHOR_EMAIL" = "$WRONG_EMAIL" ]
   then
       export GIT_AUTHOR_NAME="$NEW_NAME"
       export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
   fi
   ' --tag-name-filter cat -- --branches --tags
   ```

3. 保存脚本

4. 将脚本文件放到要批量修改提交记录的 Git 仓库中（根目录就行）

1. 执行脚本

随后你就会看到，先是提示一个 warn 警告，然后它会一条条的修改以往提交记录，如果错误的提交比较多，那就耐心等一会儿吧。
