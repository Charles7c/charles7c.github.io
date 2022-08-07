<template>
  <div class="timeline-wrap">
    <!-- <div class="timeline-header">
      <span>{{ title }}</span>
    </div> -->
    <div class="timeline-item" v-for="(item, year) in archiveData">
      <div class="year">
        <span>{{ year }}</span>
      </div>
      <div class="timeline-item-content">
        <div v-for="(articles, month) in item">
          <span class="month">{{ month }}</span>
          <div class="articles">
            <span v-for="article in articles" class="article">
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
</script>

<style scoped>
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
  padding: 0 0 0px 20px;
  border-left: 1px solid #84b9e5;
  line-height: 1;
  position: relative;
}

.timeline-wrap .timeline-item:not(:last-child) {
  padding-bottom: 20px;
}

.timeline-wrap .timeline-item:before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  position: absolute;
  left: -5px;
  top: 0px;
  border: 1px solid #84b9e5;
  border-radius: 50%;
  background: #fff;
  background: #84b9e5;
}

.timeline-wrap .timeline-item .year {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0.6em;
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
}

.timeline-wrap .timeline-item .timeline-item-content {
  font-size: 14px;
}

.timeline-wrap .timeline-item .articles {
  line-height: 1;
  padding: 7px 0 0 7px;
}

.timeline-wrap .timeline-item .articles .article {
  display: block;
  position: relative;
  margin-bottom: 20px;
  line-height: 1.5;
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