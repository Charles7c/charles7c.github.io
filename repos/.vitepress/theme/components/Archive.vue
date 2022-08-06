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
          <svg v-if="article.categories.includes('Bug万象集')" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-bug" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" data-v-8ed9eb22="" style="color: #f53f3f;"><path d="M24 42c-6.075 0-11-4.925-11-11V18h22v13c0 6.075-4.925 11-11 11Zm0 0V23m11 4h8M5 27h8M7 14a4 4 0 0 0 4 4h26a4 4 0 0 0 4-4m0 28v-.5a6.5 6.5 0 0 0-6.5-6.5M7 42v-.5a6.5 6.5 0 0 1 6.5-6.5M17 14a7 7 0 1 1 14 0"></path></svg>

          <svg v-else-if="article.categories.includes('杂碎逆袭史')" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-bulb" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" data-v-8ed9eb22="" style="color: #ff7d00;"><path d="M17 42h14m6-24c0 2.823-.9 5.437-2.43 7.568-1.539 2.147-3.185 4.32-3.77 6.897l-.623 2.756A1 1 0 0 1 29.2 36H18.8a1 1 0 0 1-.976-.779l-.624-2.756c-.584-2.576-2.23-4.75-3.77-6.897A12.94 12.94 0 0 1 11 18c0-7.18 5.82-13 13-13s13 5.82 13 13Z"></path></svg>

          <svg v-else-if="article.categories.includes('方案春秋志')" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-code" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" data-v-8ed9eb22=""><path d="M16.734 12.686 5.42 24l11.314 11.314m14.521-22.628L42.57 24 31.255 35.314M27.2 6.28l-6.251 35.453"></path></svg>

          <svg v-else viewBox="0 0 48 48" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="arco-icon arco-icon-bookmark" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" data-v-8ed9eb22="" style="color: #00b42a;"><path d="M16 16h16M16 24h8"></path><path d="M24 41H8V6h32v17"></path><path d="M30 29h11v13l-5.5-3.5L30 42V29Z"></path></svg>
        </template>
        <a :href="article.path" class="title" target="_blank">{{ article.title }}</a>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { IconBug, IconBulb, IconCode, IconBookmark } from '@arco-design/web-vue/es/icon'
import articleData from '../../../../article-data.json'
import { formatDate } from '../utils.ts'

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