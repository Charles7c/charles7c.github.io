<template>
  <div class="timeline-wrap">
    <!-- <div class="timeline-header">
      <span>{{ title }}</span>
    </div> -->
    <div class="timeline-item" v-for="(item, year) in archiveData">
      <div class="year">
        <img class="chinese-zodiac" :src="'/img/svg/chinese-zodiac/' + getChineseZodiac(year.replace('年', '')) + '.svg'" :title="getChineseZodiac(year.replace('年', ''))" alt="生肖">
        <span>{{ year }}</span>
      </div>
      <div class="timeline-item-content">
        <div v-for="(articles, month) in item">
          <span class="month">
            {{ month }}
          </span>
          <div class="articles">
            <span v-for="article in articles" class="article">
              <svg v-if="article.categories.includes('Bug万象集')" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-bug" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" style="color: #f53f3f;"><title>Bug万象集</title><path d="M24 42c-6.075 0-11-4.925-11-11V18h22v13c0 6.075-4.925 11-11 11Zm0 0V23m11 4h8M5 27h8M7 14a4 4 0 0 0 4 4h26a4 4 0 0 0 4-4m0 28v-.5a6.5 6.5 0 0 0-6.5-6.5M7 42v-.5a6.5 6.5 0 0 1 6.5-6.5M17 14a7 7 0 1 1 14 0"></path></svg>

              <svg v-else-if="article.categories.includes('杂碎逆袭史')" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-bulb" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" style="color: #ff7d00;"><title>杂碎逆袭史</title><path d="M17 42h14m6-24c0 2.823-.9 5.437-2.43 7.568-1.539 2.147-3.185 4.32-3.77 6.897l-.623 2.756A1 1 0 0 1 29.2 36H18.8a1 1 0 0 1-.976-.779l-.624-2.756c-.584-2.576-2.23-4.75-3.77-6.897A12.94 12.94 0 0 1 11 18c0-7.18 5.82-13 13-13s13 5.82 13 13Z"></path></svg>

              <svg v-else-if="article.categories.includes('方案春秋志')" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-code" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" style="color: #165dff;"><title>方案春秋志</title><path d="M16.734 12.686 5.42 24l11.314 11.314m14.521-22.628L42.57 24 31.255 35.314M27.2 6.28l-6.251 35.453"></path></svg>

              <svg v-else viewBox="0 0 48 48" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="arco-icon arco-icon-bookmark" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" style="color: #00b42a;"><path d="M16 16h16M16 24h8"></path><path d="M24 41H8V6h32v17"></path><path d="M30 29h11v13l-5.5-3.5L30 42V29Z"></path></svg>
              
              <a :href="article.path" class="title" target="_blank">{{ article.title }}</a>
              <br>
              <span>{{ formatDate(article.date) }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import articleData from '../../../../../article-data.json'
import { formatDate } from '../../utils.ts'

articleData.sort((a, b) => b.date.localeCompare(a.date))

const archiveData = {}
for (let i = 0; i < articleData.length; i++) {
  const article = articleData[i]
  let year = (new Date(article.date).getFullYear()) + '年'
  let month = (new Date(article.date).getMonth() + 1) + '月'

  if (!archiveData[year]) {
    archiveData[year] = {}
  }
  if (!(archiveData[year][month])) {
    archiveData[year][month] = []
  }
  
  archiveData[year][month].push(article)
}

/**
 * 获取生肖
 */
function getChineseZodiac(year) {
  switch(year % 12){
    case 0:
      return 'monkey'
    case 1:
      return 'rooster'
    case 2:
      return 'dog'
    case 3:
      return 'pig'
    case 4:
      return 'rat'
    case 5:
      return 'ox'
    case 6:
      return 'tiger'
    case 7:
      return 'rabbit'
    case 8:
      return 'dragon'
    case 9:
      return 'snake'
    case 10:
      return 'horse'
    case 11:
      return 'goat'
  }
}
</script>

<style scoped>
:deep(.arco-icon) {
  width: 1em;
  height: 1em;
}

.timeline-wrap {
  margin-top: 24px;
  word-break: break-all;
}

.timeline-wrap .timeline-header {
  padding-bottom: 16px;
}

.timeline-wrap .timeline-header span {
  font-size: 18px;
  font-weight: bold;
}

.timeline-wrap .timeline-item {
  padding: 0 0 0 20px;
  border-left: 1px solid #5D9DF0;
  line-height: 1;
  position: relative;
}

.timeline-wrap .timeline-item:not(:last-child) {
  padding-bottom: 20px;
}

.timeline-wrap .timeline-item .year {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0.6em;
}

.timeline-wrap .timeline-item .year .chinese-zodiac {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: absolute;
  left: -10.5px;
  top: -1px;
  background: #fff;
  border: 1px solid #84b9e5;
  border-radius: 50%;
}

.timeline-wrap .timeline-item .timeline-item-time {
  margin-bottom: 12px;
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-wrap .timeline-item .month {
  padding: 8px 0 8px 0;
  display: block;
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: bold;
  position: relative;
}

.timeline-wrap .timeline-item .timeline-item-content {
  font-size: 14px;
}

.timeline-wrap .timeline-item .articles {
  line-height: 1;
  padding-top: 7px;
}

.timeline-wrap .timeline-item .articles .article {
  display: block;
  position: relative;
  margin-bottom: 20px;
  line-height: 1.5;
}

.timeline-wrap .timeline-item .articles svg {
  position: absolute;
  left: -27.5px;
  top: 3.5px;
  background: #fff;
  border: 1px solid #84b9e5;
  border-radius: 50%;
}

.timeline-wrap .timeline-item .articles .article span {
  color: var(--vp-c-text-2);
}

.vp-doc a {
  font-weight: 400;
  color: var(--vp-c-text-1);
}
.vp-doc a:hover {
  color: var(--vp-c-brand);
}
</style>