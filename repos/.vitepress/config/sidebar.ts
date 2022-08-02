import DefaultTheme from 'vitepress/theme'
import { sync } from "fast-glob"

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/categories/issues/': getItemsByDate("categories/issues"),
  '/categories/fragments/': getItemsByDate("categories/fragments"),
  '/categories/solutions/': getItemsByDate("categories/solutions"),
  '/courses/mybatis/': getItems("courses/mybatis")
}

/**
 * 根据 某分类/YYYY/MM/dd/xxx.md 的目录格式, 获取侧边栏分组及分组下标题
 * 
 * /categories/issues/2022/07/20/xxx.md
 * 
 * @param path 扫描基础路径
 * @returns {DefaultTheme.SidebarGroup[]}
 */
function getItemsByDate (path: string) {
  // 侧边栏分组数组
  let groups: DefaultTheme.SidebarGroup[] = []
  // 侧边栏分组下标题数组
  let items: DefaultTheme.SidebarItem[] = []

  // 1.获取所有年份目录
  sync(`repos/${path}/*`, {
    onlyDirectories: true,
    objectMode: true
  }).forEach(({ name }) => {
    let year = name
    // 2.获取所有月份目录
    sync(`repos/${path}/${year}/*`, {
      onlyDirectories: true,
      objectMode: true
    }).forEach(({ name }) => {
      let month = name
      // 3.获取所有日期目录
      sync(`repos/${path}/${year}/${month}/*`, {
        onlyDirectories: true,
        objectMode: true
      }).forEach(({ name }) => {
        let day = name
        // 4.获取日期目录下的所有文章
        sync(`repos/${path}/${year}/${month}/${day}/*`, {
          onlyFiles: true,
          objectMode: true
        }).forEach(({ name }) => {
          // 向前追加标题
          items.unshift({
            text: name,
            link: `/${path}/${year}/${month}/${day}/${name}`
          })
        })
      })

      // 5.向前追加到分组
      if (items.length > 0) {
        // 去除标题名中的扩展名
        for (let i = 0; i < items.length; i++) {
          let text = items[i].text
          items[i].text = text.replace('.md', '')
        }
        groups.unshift({
          text: `${year}年${month}月 (${items.length}篇)`,
          collapsible: true,
          collapsed: true,
          items: items
        })
      }

      // 6.清空侧边栏分组下标题数组
      items = []
    })
  })

  // 7.将第一个侧边栏分组的标题展开
  groups[0].collapsed = false
  return groups
}

/**
 * 根据 某小课/序号-分组/序号-xxx.md 的目录格式, 获取侧边栏分组及分组下标题
 * 
 * courses/mybatis/01-MyBatis基础/01-xxx.md
 * 
 * @param path 扫描基础路径
 * @returns {DefaultTheme.SidebarGroup[]}
 */
function getItems (path: string) {
  // 侧边栏分组数组
  let groups: DefaultTheme.SidebarGroup[] = []
  // 侧边栏分组下标题数组
  let items: DefaultTheme.SidebarItem[] = []

  // 1.获取所有分组目录
  sync(`repos/${path}/*`, {
    onlyDirectories: true,
    objectMode: true
  }).forEach(({ name }) => {
    let groupName = name
    // 2.获取分组下的所有文章
    sync(`repos/${path}/${groupName}/*`, {
      onlyFiles: true,
      objectMode: true
    }).forEach(({ name }) => {
      // 向前追加标题
      items.push({
        text: name,
        link: `/${path}/${groupName}/${name}`
      })
    })

    // 3.向前追加到分组
    if (items.length > 0) {
      // 去除标题名中的前缀和扩展名
      for (let i = 0; i < items.length; i++) {
        let text = items[i].text
        items[i].text = text.replace('.md', '').substring(text.indexOf('-') + 1)
      }
      groups.push({
        text: `${groupName.substring(groupName.indexOf('-') + 1)} (${items.length}篇)`,
        collapsible: true,
        collapsed: true,
        items: items
      })
    }

    // 4.清空侧边栏分组下标题数组
    items = []
  })

  // 5.将第一个侧边栏分组的标题展开
  groups[0].collapsed = false
  return groups
}