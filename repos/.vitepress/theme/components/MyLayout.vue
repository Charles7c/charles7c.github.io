<template>
  <Layout>
    <template #layout-bottom>
      <Copyright />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from "vitepress/theme"
import Copyright from "./Copyright.vue"

const { Layout } = DefaultTheme
</script>

<style scoped>
</style>