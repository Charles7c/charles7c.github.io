import { defineConfig } from 'vitepress'
import { metaData } from './config/constants'
import { head } from './config/head'
import { themeConfig } from './config/theme'

export default defineConfig({
  lang: metaData.lang,
  title: metaData.title,
  description: metaData.description,

  head, // <head>内标签配置
  themeConfig, // 主题配置
  
  lastUpdated: true, // 显示最后更新时间

  // Markdown配置
  markdown: {
    theme: 'one-dark-pro', // Shiki主题, 所有主题参见: https://github.com/shikijs/shiki/blob/main/docs/themes.md
    lineNumbers: true // 启用行号
  }
})