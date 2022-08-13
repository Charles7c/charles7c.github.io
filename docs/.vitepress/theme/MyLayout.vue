<template>
  <Layout>
    <template #doc-after>
      <Comment v-if="(theme.commentConfig?.showComment ?? true) && (frontmatter?.showComment ?? true)" :commentConfig="theme.commentConfig" :key="md5(page.relativePath)" />
    </template>
    <template #layout-bottom>
      <Footer v-if="(theme.footerConfig?.showFooter ?? true) && (frontmatter?.showFooter ?? true)" />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import md5 from 'blueimp-md5'
import Comment from './components/Comment.vue'
import Footer from './components/Footer.vue'

const { Layout } = DefaultTheme
const { page, theme, frontmatter } = useData()
</script>

<style scoped>
</style>