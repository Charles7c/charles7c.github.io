<template>
  <div id="comment-container"></div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import md5 from 'blueimp-md5'
import Gitalk from 'gitalk'
import '../styles/gitalk.css'

const { page, theme, frontmatter } = useData()
const commentConfig = theme.value.commentConfig

onMounted(() => {
  switch (commentConfig.type) {
    case 'gitalk':
      renderGitalk(commentConfig.options)
      break
    default:
      break
  }
})

/**
 * 渲染Gitalk
 * 
 * @param options Gitalk配置
 */
function renderGitalk(options) {
  const gitalkConfig = {
    clientID: options.clientID,
    clientSecret: options.clientSecret,
    repo: options.repo,
    owner: options.owner,
    admin: options.admin,
    id: md5(page.value.relativePath),
    language: options.language,
    distractionFreeMode: options.distractionFreeMode,
    proxy: options.pagerDirection
  }

  const gitalk = new Gitalk(gitalkConfig)
  gitalk.render('comment-container')

  /*
  // 感谢: dingqianwen/my-blog
  // 如果点赞，先判断有没有登录
  let $gc = $('#gitalk-container');
  $gc.on('click', '.gt-comment-like', function () {
    if (!localStorage.getItem('GT_ACCESS_TOKEN')) {
      $warning('亲，你还没有登录哦!');
      return false;
    }
    return true;
  })
  // 评论提交评论后输入框高度没有重置bug
  $gc.on('click', '.gt-header-controls .gt-btn-public', function () {
    let $gt = $('.gt-header-textarea');
    $gt.css('height', '72px');
  })
  // 点击预览时，隐藏评论按钮
  $gc.on('click', '.gt-header-controls .gt-btn-preview', function () {
    let pl = $('.gt-header-controls .gt-btn-public');
    if (pl.hasClass('hide')) {
      pl.removeClass('hide');
    } else {
      // 隐藏
      pl.addClass('hide');
    }
  })*/
  // handleCommentPreview bug 点击编辑时也会调用预览接口
  /*if(!_this.state.isPreview){
    return;
  }*/
}
</script>

<style scoped>
</style>