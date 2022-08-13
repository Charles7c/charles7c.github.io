<template>
  <div id="comment-container"></div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useData } from 'vitepress'
import md5 from 'blueimp-md5'
import Gitalk from 'gitalk'
import '../styles/gitalk.css'

// 定义属性
const props = defineProps({
  commentConfig: Object
})

const data = reactive({
  type: props.commentConfig?.type ?? 'gitalk',
  options: props.commentConfig?.options ?? {}
})
const { type, options } = toRefs(data)

// 初始化评论组件配置
const { page } = useData()
let gitalk
if (type.value && type.value == 'gitalk') {
  gitalk = new Gitalk({
    clientID: options.value.clientID,
    clientSecret: options.value.clientSecret,
    repo: options.value.repo,
    owner: options.value.owner,
    admin: options.value.admin,
    id: md5(page.value.relativePath),
    language: options.value.language,
    distractionFreeMode: options.value.distractionFreeMode,
    proxy: options.value.pagerDirection
  })
}

// 渲染评论组件
onMounted(() => {
  if (type.value && type.value == 'gitalk') {
    gitalk.render('comment-container')
  }
})
</script>

<style scoped>
</style>