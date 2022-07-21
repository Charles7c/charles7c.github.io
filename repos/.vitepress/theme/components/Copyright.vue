<template>
  <footer v-if="theme.footerConfig.showFooter" class="VPFooter">
    <div class="container">
      <p class="message" v-html="theme.footerConfig.message"></p>
      <p class="copyright" v-html="theme.footerConfig.copyright"></p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<style scoped>
.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-divider-light);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}
.VPFooter.has-sidebar {
  display: none;
}
@media (min-width: 768px) {
  .VPFooter {
    padding: 32px;
  }
}
.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}
.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
.message   { order: 2; }
.copyright { order: 1; }

p {
  margin: 0;
}
</style>