import DefaultTheme from 'vitepress/theme'
import { sync } from 'fast-glob'
import matter from 'gray-matter'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/categories/issues/': getItemsByDate("categories/issues"),
  '/categories/fragments/': getItemsByDate("categories/fragments"),
  '/categories/solutions/': getItemsByDate("categories/solutions"),

  '/courses/java/': getItems("courses/java"),
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
  // 侧边栏年份分组数组
  let yearGroups: DefaultTheme.SidebarGroup[] = []

  // 置顶数组
  let topArticleItems: DefaultTheme.SidebarItem[] = []

  // 1.获取所有年份目录
  sync(`docs/${path}/*`, {
    onlyDirectories: true,
    objectMode: true
  }).forEach(({ name }) => {
    let year = name
    // 年份数组
    let articleItems: DefaultTheme.SidebarItem[] = []

    // 2.获取所有月份目录
    sync(`docs/${path}/${year}/*`, {
      onlyDirectories: true,
      objectMode: true
    }).forEach(({ name }) => {
      let month = name

      // 3.获取所有日期目录
      sync(`docs/${path}/${year}/${month}/*`, {
        onlyDirectories: true,
        objectMode: true
      }).forEach(({ name }) => {
        let day = name
        // 4.获取日期目录下的所有文章
        sync(`docs/${path}/${year}/${month}/${day}/*`, {
          onlyFiles: true,
          objectMode: true
        }).forEach((article) => {
          const articleFile = matter.read(`${article.path}`)
          const { data } = articleFile
          if (data.isTop) {
            // 向置顶分组前追加标题
            topArticleItems.unshift({
              text: data.title,
              link: `/${path}/${year}/${month}/${day}/${article.name.replace('.md', '')}`
            })
          }

          // 向年份分组前追加标题
          articleItems.unshift({
            text: data.title,
            link: `/${path}/${year}/${month}/${day}/${article.name.replace('.md', '')}`
          })
        })
      })
    })

    // 添加年份分组
    yearGroups.unshift({
      text: `${year}年 (共 ${articleItems.length} 篇)`,
      collapsible: true,
      collapsed: true,
      items: articleItems
    })
  })

  if (topArticleItems.length > 0) {
    // 添加置顶分组
    yearGroups.unshift({
      text: `📑 我的置顶 (共 ${topArticleItems.length} 篇)`,
      collapsible: true,
      collapsed: false,
      items: topArticleItems
    })

    // 将最近年份分组展开
    yearGroups[1].collapsed = false
  } else {
    // 将最近年份分组展开
    yearGroups[0].collapsed = false
  }
  return yearGroups
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
  sync(`docs/${path}/*`, {
    onlyDirectories: true,
    objectMode: true
  }).forEach(({ name }) => {
    let groupName = name
    // 2.获取分组下的所有文章
    sync(`docs/${path}/${groupName}/*`, {
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
        collapsed: false,
        items: items
      })
    }

    // 4.清空侧边栏分组下标题数组
    items = []
  })
  return groups
}