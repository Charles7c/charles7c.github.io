import DefaultTheme from 'vitepress/theme'
import { sync } from "fast-glob"

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/issues/': getItems("issues"),
  '/fragments/': getItems("fragments"),
  '/solutions/': getItems("solutions")
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