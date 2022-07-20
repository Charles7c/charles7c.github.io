import type { DefaultTheme } from 'vitepress'
import { nav } from './nav'
import { sidebar } from './sidebar'

export const themeConfig: DefaultTheme.Config = {
  logo: '/logo.jpg',
  outlineTitle: '目录', // 右侧边栏的大纲标题文本
  lastUpdatedText: '最后更新', // 最后更新时间文本, 需配置 lastUpdated 为 true
  docFooter: {
    prev: '上一页',
    next: '下一页'
  },
  // 编辑链接
  editLink: {
    pattern: 'https://github.com/Charles7c/charles7c.github.io/edit/main/repos/:path',
    text: '在 GitHub 上编辑此页面'
  },
  // 版权标识
  footer: {
    message: 'Released under the MIT License.',
    copyright: `Copyright © 2019-${new Date().getFullYear()} Charles7c`
  },
  // 全文搜索
  algolia: {
    appId: 'DBZ0G9HBUY',
    apiKey: '00cef480a543003d05d9808110ea5f65',
    indexName: 'charles7c'
  },
  // 社交链接
  socialLinks: [
    { icon: 'github', link: 'https://github.com/Charles7c/charles7c.github.io' }
  ],
  nav, // 导航栏
  sidebar // 侧边栏
}