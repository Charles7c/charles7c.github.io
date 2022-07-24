<template>
  <div v-if="frontmatter?.aside ?? true" class="meta-wrapper">
    <div class="meta-item">
      <span class="meta-icon">
        <svg t="1658631419379" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5313" width="200" height="200"><path d="M621.8 601.2c86.8-49.5 146.1-141.9 146.1-249 0-158.9-128.8-287.7-287.7-287.7S192.5 193.3 192.5 352.2c0 107.1 59.2 199.5 146.1 249-150 54.5-259.7 192.7-272.3 358.3h63.9c16.2-178.9 166.9-319.6 350-319.6s333.8 140.7 350 319.6h63.9c-12.6-165.6-122.3-303.8-272.3-358.3z m-365.4-249c0-123.4 100.4-223.7 223.8-223.7S704 228.8 704 352.2 603.6 575.9 480.2 575.9 256.4 475.6 256.4 352.2z" p-id="5314" fill="#8A8F8D"></path></svg>
      </span>
      <span class="meta-content">
        <a :href="frontmatter?.authorLink ?? theme.articleMetadataConfig.authorLink">{{ frontmatter?.author ?? theme.articleMetadataConfig.author }}</a>
      </span>
    </div>
    <div class="meta-item">
      <span class="meta-icon">
        <svg t="1658631488653" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7904" width="200" height="200"><path d="M512.006169 1024c-136.761166 0-265.330233-53.260979-362.04388-149.962289S0 648.754997 0 511.993831s53.260979-265.330233 149.962289-362.031542S375.245003 0 512.006169 0s265.330233 53.248642 362.04388 149.962289S1024.012337 375.232665 1024.012337 511.993831s-53.260979 265.34257-149.962288 362.04388S648.767335 1024 512.006169 1024z m0-960.474223c-247.280473 0-448.468054 201.187581-448.468054 448.468054s201.187581 448.468054 448.468054 448.468054 448.468054-201.175243 448.468054-448.468054S759.286642 63.525777 512.006169 63.525777z" p-id="7905" fill="#8A8F8D"></path><path d="M786.688225 599.82448H512.006169a31.769057 31.769057 0 0 1 0-63.538115h274.682056a31.769057 31.769057 0 0 1 0 63.538115z" p-id="7906" fill="#8A8F8D"></path><path d="M512.006169 598.88683a31.769057 31.769057 0 0 1-31.769058-31.769057V292.435716a31.769057 31.769057 0 0 1 63.538115 0v274.682057A31.769057 31.769057 0 0 1 512.006169 598.88683z" p-id="7907" fill="#8A8F8D"></path></svg>
      </span>
      <time class="meta-content" :datetime="isoDatetime">{{ datetime }}</time>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useData } from 'vitepress'

const { theme, frontmatter } = useData()
const date = computed(() => new Date(frontmatter.value.date))
const isoDatetime = computed(() => date.value.toISOString())
const datetime = ref('')

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
  color: #8a8f8d;
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
  height: 14px;
  width: 14px;
}
.meta-content a {
  font-weight: 400;
  color: #8a8f8d;
}
.meta-content a:hover {
  color: var(--vp-c-brand);
}
</style>