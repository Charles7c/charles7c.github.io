import DefaultTheme from 'vitepress/theme'
import { nav } from './nav'
import { sidebar } from './sidebar'

export const themeConfig: DefaultTheme.Config = {
  logo: '/logo.png',
  outlineTitle: '目录', // 右侧边栏的大纲标题文本配置
  lastUpdatedText: '最后更新', // 最后更新时间文本配置, 需先配置lastUpdated为true
  // 文档页脚文本配置
  docFooter: {
    prev: '上一篇',
    next: '下一篇'
  },
  // 编辑链接配置
  editLink: {
    pattern: 'https://github.com/Charles7c/charles7c.github.io/edit/main/repos/:path',
    text: '不妥之处，敬请雅正'
  },
  // 页脚配置
  footer: {
    message: `<a href="https://beian.miit.gov.cn/" target="_blank">京ICP备20003712号-2</a>`, // 备案信息
    copyright: `Copyright © 2019-${new Date().getFullYear()} Charles7c` // 版权信息
  },
  // 全文搜索配置
  algolia: {
    appId: 'DBZ0G9HBUY',
    apiKey: '00cef480a543003d05d9808110ea5f65',
    indexName: 'charles7c'
  },
  // 导航栏右侧社交链接配置
  socialLinks: [
    { icon: 'github', link: 'https://github.com/Charles7c/charles7c.github.io' }
  ],
  nav, // 导航栏配置
  sidebar // 侧边栏配置
}