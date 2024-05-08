<template>
  <ClientOnly>
    <Layout>
      <template #doc-footer-before>
        <Copyright
          v-if="(frontmatter?.aside ?? true) && (frontmatter?.showArticleMetadata ?? true) && !(frontmatter.authorLink)"
          :key="md5(page.relativePath)" />
      </template>
      <template #doc-after>
        <Comment v-if="(theme.commentConfig?.showComment ?? true) && (frontmatter?.showComment ?? true)"
          :commentConfig="theme.commentConfig" :key="md5(page.relativePath)" />
      </template>
      <template #layout-bottom>
        <Footer v-if="!hasSidebar && (theme.footerConfig?.showFooter ?? true) && (frontmatter?.showFooter ?? true)" />
      </template>
    </Layout>
  </ClientOnly>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import DefaultTheme from 'vitepress/theme';
  import { useData } from 'vitepress';
  import md5 from 'blueimp-md5';
  import Copyright from './components/layout/Copyright.vue';
  import Comment from './components/layout/Comment.vue';
  import Footer from './components/layout/Footer.vue';

  const { Layout } = DefaultTheme;
  const { page, theme, frontmatter } = useData();
  const hasSidebar = computed(() => {
    return (
      frontmatter.value.aside !== false && frontmatter.value.layout !== 'home'
    )
  });
</script>

<style scoped></style>