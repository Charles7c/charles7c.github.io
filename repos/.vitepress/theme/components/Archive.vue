<template>
  <div class="timeline-wrapper">
    <a-timeline
      reverse
      labelPosition="relative"
      pending="未完待续 ······"
    >
      <a-timeline-item
        v-for="article in articles"
        :label="formatDate(article.date)"
      >
        <template #dot>
          <IconBug :style="{color: '#f53f3f'}" v-if="article.categories.includes('Bug万象集')" />
          <IconBulb :style="{color: '#ff7d00'}" v-else-if="article.categories.includes('杂碎逆袭史')" />
          <IconCode v-else-if="article.categories.includes('方案春秋志')" />
          <IconBookmark :style="{color: '#00b42a'}" v-else />
        </template>
        <a :href="article.path" class="title" target="_blank">{{ article.title }}</a>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import articleData from '../../../../article-data.json'
import { formatDate } from '../utils.ts'
import { IconBug, IconBulb, IconCode, IconBookmark } from '@arco-design/web-vue/es/icon'

const articles = computed(() => articleData.sort((a, b) => a.date.localeCompare(b.date)))
</script>

<style scoped>
/** ---------------Arco样式--------------- */
:deep(.arco-timeline-item-content) {
  color: var(--vp-c-text-1);
}
:deep(.arco-timeline-item-dot-custom) {
  background-color: transparent;
}
:deep(.arco-timeline-item-label-relative > .arco-timeline-item-label) {
  max-width: 145px;
}
:deep(.arco-icon) {
  width: 1.3em;
  height: 1.3em;
}

/** ---------------自定义样式--------------- */
.timeline-wrapper {
  margin-top: 24px;
  margin-left: 35px;
  word-break: break-all;
}
.title {
  font-weight: 400;
  color: var(--vp-c-text-1);
}
</style>