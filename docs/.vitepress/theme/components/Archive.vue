<template>
  <div class="timeline-wrap">
    <!-- 时间轴头部 -->
    <div class="timeline-header">
      <a-tag
        v-if="$category"
        class="content"
        closable
        @close="goToLink('/archives.html')"
      >
        <template #icon>
          <svg class="icon" role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><title>所属分类</title><path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 0 0-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256z m635.3 512H159l103.3-256h612.4L771.3 768z"></path></svg>
        </template>
        {{ $category }} (共 {{ $articleData.length }} 篇)
      </a-tag>
      <a-tag
        v-else-if="$tag"
        class="content"
        closable
        @close="goToLink('/archives.html')"
      >
        <template #icon>
          <svg class="icon" role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><title>标签列表</title><path d="M483.2 790.3L861.4 412c1.7-1.7 2.5-4 2.3-6.3l-25.5-301.4c-0.7-7.8-6.8-13.9-14.6-14.6L522.2 64.3c-2.3-0.2-4.7 0.6-6.3 2.3L137.7 444.8a8.03 8.03 0 0 0 0 11.3l334.2 334.2c3.1 3.2 8.2 3.2 11.3 0z m62.6-651.7l224.6 19 19 224.6L477.5 694 233.9 450.5l311.9-311.9z m60.16 186.23a48 48 0 1 0 67.88-67.89 48 48 0 1 0-67.88 67.89zM889.7 539.8l-39.6-39.5a8.03 8.03 0 0 0-11.3 0l-362 361.3-237.6-237a8.03 8.03 0 0 0-11.3 0l-39.6 39.5a8.03 8.03 0 0 0 0 11.3l243.2 242.8 39.6 39.5c3.1 3.1 8.2 3.1 11.3 0l407.3-406.6c3.1-3.1 3.1-8.2 0-11.3z"></path></svg>
        </template>
        {{ $tag }} (共 {{ $articleData.length }} 篇)
      </a-tag>
      <a-tag
        v-else-if="$year"
        class="content"
        closable
        @close="goToLink('/archives.html')"
      >
        <template #icon>
          <svg class="icon" role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32z m-260 72h96v209.9L621.5 312 572 347.4V136z m220 752H232V136h280v296.9c0 3.3 1 6.6 3 9.3a15.9 15.9 0 0 0 22.3 3.7l83.8-59.9 81.4 59.4c2.7 2 6 3.1 9.4 3.1 8.8 0 16-7.2 16-16V136h64v752z"></path></svg>
        </template>
        {{ $year }}年 (共 {{ $articleData.length }} 篇)
      </a-tag>
      <a-tag
        v-else
        class="content"
      >
        <template #icon>
          <svg class="icon" role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32z m-260 72h96v209.9L621.5 312 572 347.4V136z m220 752H232V136h280v296.9c0 3.3 1 6.6 3 9.3a15.9 15.9 0 0 0 22.3 3.7l83.8-59.9 81.4 59.4c2.7 2 6 3.1 9.4 3.1 8.8 0 16-7.2 16-16V136h64v752z"></path></svg>
        </template>
        共 {{ articleData.length }} 篇，未完待续······
      </a-tag>
    </div>

    <!-- 时间轴主体 -->
    <div class="timeline-item" v-for="(item, year) in archiveData">
      <div class="year">
        <img class="chinese-zodiac" @click="goToLink('/archives.html', 'year', year.replace('年', ''))" :src="'/img/svg/chinese-zodiac/' + getChineseZodiac(year.replace('年', '')) + '.svg'" :title="getChineseZodiacAlias(year.replace('年', ''))" alt="生肖">
        <span>{{ year }}</span>
      </div>
      <div class="timeline-item-content">
        <div v-for="(articles, month) in item">
          <span class="month">
            {{ month }}
          </span>
          <div class="articles">
            <span v-for="article in articles" class="article">
              <svg v-if="article.categories.includes('Bug万象集')" @click="goToLink('/archives.html', 'category', article.categories[0])" role="img" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-bug" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" style="color: #f53f3f;"><title>Bug万象集</title><path d="M24 42c-6.075 0-11-4.925-11-11V18h22v13c0 6.075-4.925 11-11 11Zm0 0V23m11 4h8M5 27h8M7 14a4 4 0 0 0 4 4h26a4 4 0 0 0 4-4m0 28v-.5a6.5 6.5 0 0 0-6.5-6.5M7 42v-.5a6.5 6.5 0 0 1 6.5-6.5M17 14a7 7 0 1 1 14 0"></path></svg>
              
              <svg v-else-if="article.categories.includes('杂碎逆袭史')" @click="goToLink('/archives.html', 'category', article.categories[0])" role="img" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-bulb" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" style="color: #ff7d00;"><title>杂碎逆袭史</title><path d="M17 42h14m6-24c0 2.823-.9 5.437-2.43 7.568-1.539 2.147-3.185 4.32-3.77 6.897l-.623 2.756A1 1 0 0 1 29.2 36H18.8a1 1 0 0 1-.976-.779l-.624-2.756c-.584-2.576-2.23-4.75-3.77-6.897A12.94 12.94 0 0 1 11 18c0-7.18 5.82-13 13-13s13 5.82 13 13Z"></path></svg>
              
              <svg v-else-if="article.categories.includes('方案春秋志')" @click="goToLink('/archives.html', 'category', article.categories[0])" role="img" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-code" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" style="color: #165dff;"><title>方案春秋志</title><path d="M16.734 12.686 5.42 24l11.314 11.314m14.521-22.628L42.57 24 31.255 35.314M27.2 6.28l-6.251 35.453"></path></svg>
              
              <svg v-else @click="goToLink('/archives.html', 'category', article.categories[0])" role="img" viewBox="0 0 48 48" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="arco-icon arco-icon-bookmark" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" style="color: #00b42a;"><path d="M16 16h16M16 24h8"></path><path d="M24 41H8V6h32v17"></path><path d="M30 29h11v13l-5.5-3.5L30 42V29Z"></path></svg>
              <a :href="article.path" class="title" target="_blank">{{ article.title }}</a>
              <br>
              <ArticleMetadata :article="article" />
            </span>
          </div>
        </div>
      </div>
      <div id="main"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import articleData from '../../../../article-data.json'
import { formatDate, getQueryParam, goToLink } from '../utils.ts'

// 文章原始数据和归档数据
let $articleData
let archiveData

// 要筛选的分类、标签、年份
let $category
let $tag
let $year

initTimeline()

/**
 * 初始化时间轴
 */
function initTimeline() {
  $articleData = []
  archiveData = {}

  // 如果URL路径有category或tag或year参数, 默认筛选出指定category或tag或year的文章数据
  // 例如: /archives.html?category=Bug万象集
  // 例如: /archives.html?tag=JVM
  // 例如: /archives.html?year=2020
  $category = getQueryParam('category')
  $tag = getQueryParam('tag')
  $year = getQueryParam('year')
  if ($category && $category.trim() != '') {
    for (let i = 0; i < articleData.length; i++) {
      let article = articleData[i]
      if (article.categories && article.categories.includes($category)) {
        $articleData.push(article)
      }
    }
  } else if ($tag && $tag.trim() != '') {
    for (let i = 0; i < articleData.length; i++) {
      let article = articleData[i]
      if (article.tags && article.tags.includes($tag)) {
        $articleData.push(article)
      }
    }
  } else if ($year && $year.trim() != '') {
    for (let i = 0; i < articleData.length; i++) {
      let article = articleData[i]
      if (article.date && new Date(article.date).getFullYear() == $year) {
        $articleData.push(article)
      }
    }
  } else {
    $articleData.push(...articleData)
  }

  // 文章数据归档处理
  // 1.对文章数据进行降序排序
  $articleData.sort((a, b) => b.date.localeCompare(a.date))
  // 2.按年、月进行归档
  for (let i = 0; i < $articleData.length; i++) {
    const article = $articleData[i]
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

/**
 * 获取生肖名称
 */
function getChineseZodiacAlias(year) {
  switch(year % 12){
    case 0:
      return '猴年'
    case 1:
      return '鸡年'
    case 2:
      return '狗年'
    case 3:
      return '猪年'
    case 4:
      return '鼠年'
    case 5:
      return '牛年'
    case 6:
      return '虎年'
    case 7:
      return '兔年'
    case 8:
      return '龙年'
    case 9:
      return '蛇年'
    case 10:
      return '马年'
    case 11:
      return '羊年'
  }
}
</script>

<style scoped>
:deep(.arco-tag) {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
:deep(.arco-icon) {
  width: 1em;
  height: 1em;
}

.timeline-wrap {
  margin-top: 18px;
  word-break: break-all;
}

.timeline-wrap .timeline-header {
  padding-bottom: 20px;
}

.timeline-wrap .timeline-header .icon {
  fill: var(--vp-c-text-2);
  height: 18px;
  width: 18px;
}

.timeline-wrap .timeline-header .content {
  position: relative;
  left: -17px;
  font-size: 16px;
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
  cursor: pointer;
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
  cursor: pointer;
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