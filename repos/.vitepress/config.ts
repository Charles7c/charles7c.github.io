import { defineConfig, type DefaultTheme } from 'vitepress'
import { sync } from "fast-glob"

export default defineConfig({
  lang: 'zh-CN',
  title: '查尔斯的知识库',
  description: '个人知识库，记录 & 分享个人碎片化、结构化、体系化的知识内容。',
  lastUpdated: true, // 显示最后更新时间

  // <head>内标签配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  // Markdown配置
  markdown: {
    theme: 'material-palenight',
    // lineNumbers: true
  },

  // 主题配置
  themeConfig: {
    logo: '/logo.jpg',
    outlineTitle: '目录', // 右侧边栏的大纲标题文本
    // 编辑链接
    editLink: {
      pattern: 'https://github.com/Charles7c/charles7c.github.io/edit/main/repos/:path',
      text: '在 GitHub 上编辑此页面'
    },
    lastUpdatedText: '最后更新', // 最后更新时间文本, 需配置 lastUpdated 为 true
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    // 版权标识
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Charles7c'
    },
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Charles7c/charles7c.github.io' }
    ],
    // 全文搜索
    algolia: {
      appId: 'DBZ0G9HBUY',
      apiKey: '00cef480a543003d05d9808110ea5f65',
      indexName: 'charles7c'
    },

    // 导航栏
    nav: nav(),

    // 侧边栏
    sidebar: {
     '/issues/': getItems("issues"),
     '/fragments/': getItems("fragments"),
     '/about/': [
        {
          items: [
            { text: '关于笔者', link: '/about/me' }
          ]
        }
      ]
    }
  }
})

/**
 * 获取导航栏
 */
function nav() {
  return [
    {
      text: 'Bug万象集',
      link: '/issues/index'
    },
    {
      text: '"杂碎"逆袭史',
      link: '/fragments/index'
    },
    {
      text: '关于知识库',
      link: '/about/index'
    }
  ]
}

/**
 * 获取侧边栏分组及分组下标题
 * 
 * @param path 扫描基础路径
 * @returns {DefaultTheme.SidebarGroup[]}
 */
function getItems (path: string) {
  // 侧边栏分组数组
  let groups: DefaultTheme.SidebarGroup[] = []
  // 侧边栏分组下标题数组
  let items: DefaultTheme.SidebarItem[] = []

  // 1.获取所有年份目录
  sync(`repos/${path}/*`, {
    onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name }) => {
    let year = name
    for (let i = 1; i <= 12; i++) {
      let month = i < 10 ? `0${i}` : i
      // 2.获取所有月份目录下的文章
      sync(`repos/${path}/${year}/${month}/*`, {
        objectMode: true,
      }).forEach(({ name }) => {
        // 向前追加标题
        items.unshift({
          text: name,
          link: `/${path}/${year}/${month}/${name}`,
        })
      })

      // 3.向前追加分组
      if (items.length > 0) {
        // 去除标题名中的日期前缀和扩展名
        for (let i = 0; i < items.length; i++) {
          let text = items[i].text
          items[i].text = text.replace('.md', '').substring(text.indexOf('.') + 1)
        }
        groups.unshift({
          text: `${year}年${month}月 (${items.length}篇)`,
          collapsible: true,
          collapsed: true,
          items: items
        })
      }

      // 4.清空侧边栏分组下标题数组
      items = []
    }
  })

  // 5.将第一个侧边栏分组的标题展开
  groups[0].collapsed = false
  return groups
}