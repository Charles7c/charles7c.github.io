<template>
  <div v-if="frontmatter?.aside ?? true" class="meta-wrapper">
    <div class="meta-item">
      <span class="meta-icon">
        <svg role="img" viewBox="0 0 1024 1024"><title>原创作者</title><path d="M621.8 601.2c86.8-49.5 146.1-141.9 146.1-249 0-158.9-128.8-287.7-287.7-287.7S192.5 193.3 192.5 352.2c0 107.1 59.2 199.5 146.1 249-150 54.5-259.7 192.7-272.3 358.3h63.9c16.2-178.9 166.9-319.6 350-319.6s333.8 140.7 350 319.6h63.9c-12.6-165.6-122.3-303.8-272.3-358.3z m-365.4-249c0-123.4 100.4-223.7 223.8-223.7S704 228.8 704 352.2 603.6 575.9 480.2 575.9 256.4 475.6 256.4 352.2z"></path></svg>
      </span>
      <span class="meta-content">
        <a :href="frontmatter?.authorLink ?? theme.articleMetadataConfig.authorLink" title="进入作者主页">{{ frontmatter?.author ?? theme.articleMetadataConfig.author }}</a>
      </span>
    </div>
    <div class="meta-item">
      <span class="meta-icon">
        <svg role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><title>发布时间</title><path d="M512.006169 1024c-136.761166 0-265.330233-53.260979-362.04388-149.962289S0 648.754997 0 511.993831s53.260979-265.330233 149.962289-362.031542S375.245003 0 512.006169 0s265.330233 53.248642 362.04388 149.962289S1024.012337 375.232665 1024.012337 511.993831s-53.260979 265.34257-149.962288 362.04388S648.767335 1024 512.006169 1024z m0-960.474223c-247.280473 0-448.468054 201.187581-448.468054 448.468054s201.187581 448.468054 448.468054 448.468054 448.468054-201.175243 448.468054-448.468054S759.286642 63.525777 512.006169 63.525777z"></path><path d="M786.688225 599.82448H512.006169a31.769057 31.769057 0 0 1 0-63.538115h274.682056a31.769057 31.769057 0 0 1 0 63.538115z"></path><path d="M512.006169 598.88683a31.769057 31.769057 0 0 1-31.769058-31.769057V292.435716a31.769057 31.769057 0 0 1 63.538115 0v274.682057A31.769057 31.769057 0 0 1 512.006169 598.88683z"></path></svg>
      </span>
      <time class="meta-content" :datetime="isoDatetime" :title="toDate">{{ datetime }}</time>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useData } from 'vitepress'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 获取发布时间
const { theme, frontmatter } = useData()
const date = computed(() => new Date(frontmatter.value.date))
const isoDatetime = computed(() => date.value.toISOString())
const datetime = ref('')

// 获取发布时间的相对时间, 例如: 1天前、2周前、3个月前、4年前
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
const toDate = dayjs().to(dayjs(frontmatter.value.date))

onMounted(() => {
  watchEffect(() => {
    datetime.value = date.value.toLocaleString(window.navigator.language, {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'})
  })
})
</script>

<style scoped>
.meta-wrapper {
  margin-top: 10px;
}
.meta-item {
  display: inline-block;
  margin-right: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  max-width: 240px;
  color: var(--vp-c-text-2);
  cursor: default;
  font-size: 14px;
}
.meta-icon, meta-content {
  display: inline-block;
  margin-right: 8px;
  vertical-align: baseline;
}
.meta-icon {
  position: relative;
  top: 1.36px;
}
.meta-icon svg {
  fill: var(--vp-c-text-2);
  height: 14px;
  width: 14px;
}
.meta-content a {
  font-weight: 400;
  color: var(--vp-c-text-2);
}
.meta-content a:hover {
  color: var(--vp-c-brand);
}
</style>