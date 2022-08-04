<template>
  <div class="timeline-wrapper">
    <el-timeline>
      <el-timeline-item 
        v-for="year in archiveDataObj.yearList"
        :key="year"
        type="primary"
        hollow
        placement="top"
      >
        <div class="year">{{ year }}年</div>
        <div v-for="article in archiveDataObj.archiveData[year]">
          <el-card shadow="never">
            <a :href="article.path" class="title" target="_blank">{{ article.title }}</a>
            <div class="meta-wrapper">
              <div class="meta-item">
                <span class="meta-icon author">
                  <svg role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><title>原创作者</title><path d="M858.5 763.6c-18.9-44.8-46.1-85-80.6-119.5-34.5-34.5-74.7-61.6-119.5-80.6-0.4-0.2-0.8-0.3-1.2-0.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-0.4 0.2-0.8 0.3-1.2 0.5-44.8 18.9-85 46-119.5 80.6-34.5 34.5-61.6 74.7-80.6 119.5C146.9 807.5 137 854 136 901.8c-0.1 4.5 3.5 8.2 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c0.1 4.4 3.6 7.8 8 7.8h60c4.5 0 8.1-3.7 8-8.2-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg>
                </span>
                <span class="meta-content">
                  <a :href="frontmatter?.authorLink ?? theme.articleMetadataConfig.authorLink" title="进入作者主页">{{ article?.author ?? theme.articleMetadataConfig.author }}</a>
                </span>
              </div>
              <div class="meta-item">
                <span class="meta-icon date">
                  <svg role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><title>发布时间</title><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path></svg>
                </span>
                <time class="meta-content">{{ formatDate(article.date) }}</time>
              </div>
              <div class="meta-item" v-if="theme.articleMetadataConfig?.showPv ?? false">
                <span class="meta-icon pv">
                  <svg role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><title>阅读数</title><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3-7.7 16.2-7.7 35.2 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766z"></path><path d="M508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176z m0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>
                </span>
                <span id="pv" class="meta-content"></span>
              </div>
            </div>
          </el-card>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import articleData from '../../../../article-data.json'
import { formatDate } from '../utils.ts'
import '../styles/article-meta-data.css'

const { theme } = useData()

// 所有归档文章数据
const archiveDataObj = computed(() => initArchiveData(articleData))
console.log(archiveDataObj.value.yearList)

/**
 * 初始化归档数据
 * [{2020: [article1, article2, ...], ...}]
 */
function initArchiveData(articleData) {
  const archiveData: any = {}
  const yearList = []
  for (let i = 0; i < articleData.length; i++) {
    const article = articleData[i]
    const year = new Date(article.date).getFullYear()

    if (!archiveData[year]) {
      archiveData[year] = []
      yearList.push(year)
    }

    archiveData[year].push(article)
    // 文章按发布时间降序排序
    archiveData[year].sort((a, b) => b.date.localeCompare(a.date))
  }
  yearList.sort((a, b) => b - a)
  return {'archiveData': archiveData, 'yearList': yearList}
}
</script>

<style scoped>
:deep(.el-card) {
  --el-card-border-color: var(--vp-c-divider-light);
  --el-card-bg-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
}

a.title {
  font-size: 15px;
  font-weight: 400;
  color: var(--vp-c-text-1);
}

ul li {
  list-style: none;
}

.timeline-wrapper {
  word-break:break-all;
}

.year {
  color: #409EFF;
  position: absolute;
  left: -60px;
  top: 1px;
}
.item {
  color: var(--vp-c-text-1);
  margin-left: 25px;
  font-size: 15px;
  span {
    padding-left: 10px;
  }
}
</style>