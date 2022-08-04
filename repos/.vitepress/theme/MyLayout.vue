<template>
  <Layout>
    <template #doc-after>
      <Comment v-if="!(theme.commentConfig?.hideComments ?? false)" />
    </template>
    <template #layout-bottom>
      <Footer v-if="(theme.footerConfig?.showFooter ?? true) && (frontmatter?.showFooter ?? true)" />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Comment from './components/Comment.vue'
import Footer from './components/Footer.vue'

const { Layout } = DefaultTheme
const { theme, frontmatter } = useData()
</script>

<style scoped>
</style>