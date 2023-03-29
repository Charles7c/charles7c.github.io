import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
// import { pagefindPlugin } from 'vitepress-plugin-pagefind';

export default defineConfig({
  plugins: [
    // pagefindPlugin({
      // btnPlaceholder: '搜索',
      // placeholder: '搜索文档',
      // emptyText: '空空如也',
      // heading: '共 {{searchResult}} 条结果'
    // }),
    Components({
      dirs: ['.vitepress/theme/components'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [ArcoResolver({ sideEffect: true, resolveIcons: true })]
    }),
  ],
  ssr: { noExternal: ['@arco-design/web-vue'] },
  resolve: {
    alias: {
      'mermaid': 'mermaid/dist/mermaid.esm.mjs',
    },
  },
});
