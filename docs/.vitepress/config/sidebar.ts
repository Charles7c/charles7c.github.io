import type { DefaultTheme } from 'vitepress';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { getChineseZodiac, getChineseZodiacAlias } from '../theme/utils.ts';
const sync = fg.sync;

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/categories/issues/': getItemsByDate("categories/issues"),
  '/categories/fragments/': getItemsByDate("categories/fragments"),
  '/categories/solutions/': getItemsByDate("categories/solutions"),
  '/categories/tools/': getItemsByDate("categories/tools"),

  '/courses/java/': getItems("courses/java"),
  '/courses/mysql/': getItems("courses/mysql"),
  '/courses/mybatis/': getItems("courses/mybatis"),
}

/**
 * 根据 某分类/YYYY/MM/dd/xxx.md 的目录格式, 获取侧边栏分组及分组下标题
 * 
 * /categories/issues/2022/07/20/xxx.md
 * 
 * @param path 扫描基础路径
 * @returns {DefaultTheme.SidebarItem[]}
 */
function getItemsByDate (path: string) {
  // 侧边栏年份分组数组
  let yearGroups: DefaultTheme.SidebarItem[] = [];
  // 置顶数组
  let topArticleItems: DefaultTheme.SidebarItem[] = [];

  // 1.获取所有年份目录
  sync(`docs/${path}/*`, {
    onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name }) => {
    let year = name;
    // 年份数组
    let articleItems: DefaultTheme.SidebarItem[] = [];

    // 2.获取所有月份目录
    sync(`docs/${path}/${year}/*`, {
      onlyDirectories: true,
      objectMode: true,
    }).forEach(({ name }) => {
      let month = name

      // 3.获取所有日期目录
      sync(`docs/${path}/${year}/${month}/*`, {
        onlyDirectories: true,
        objectMode: true,
      }).forEach(({ name }) => {
        let day = name;
        // 4.获取日期目录下的所有文章
        sync(`docs/${path}/${year}/${month}/${day}/*`, {
          onlyFiles: true,
          objectMode: true,
        }).forEach((article) => {
          const articleFile = matter.read(`${article.path}`);
          const { data } = articleFile;
          if (data.isTop) {
            // 向置顶分组前追加标题
            topArticleItems.unshift({
              text: data.title,
              link: `/${path}/${year}/${month}/${day}/${article.name.replace('.md', '')}`,
            });
          }

          // 向年份分组前追加标题
          articleItems.unshift({
            text: data.title,
            link: `/${path}/${year}/${month}/${day}/${article.name.replace('.md', '')}`,
          });
        })
      })
    })

    // 添加年份分组
    yearGroups.unshift({
      text: `<img class="chinese-zodiac" style="position: static; vertical-align: middle; padding-bottom: 3px;" src="/img/svg/chinese-zodiac/${getChineseZodiac(year.replace('年', ''))}.svg" title="${getChineseZodiacAlias(year.replace('年', ''))}" alt="生肖">
            ${year}年 (${articleItems.length}篇)`,
      items: articleItems,
      collapsed: true,
    });
  })

  if (topArticleItems.length > 0) {
    // 添加置顶分组
    yearGroups.unshift({
      text: `<svg style="display: inline-block; vertical-align: middle; padding-bottom: 3px;" viewBox="0 0 1920 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M367.488 667.904h423.744v47.232H367.488v-47.232zM320.256 204.352h137.28v68.992h-137.28v-68.992zM367.488 754.112h423.744v48H367.488v-48zM693.76 204.352h137.984v68.992H693.76v-68.992zM507.008 204.352h137.28v68.992h-137.28v-68.992z" p-id="10749" fill="#d81e06"></path><path d="M1792.512 0H127.488C57.472 0 0 57.152 0 127.616v768.768C0 966.72 57.088 1024 127.488 1024h1665.088c69.952 0 127.424-57.152 127.424-127.616V127.616C1920 57.216 1862.912 0 1792.512 0z m-528 175.104h446.976v54.016H1494.72l-24 101.248h206.976V689.6h-57.728V384.32h-289.472v308.224h-57.728v-362.24h140.224l20.992-101.248h-169.472v-53.952z m-996.032-11.2h614.272v167.232h-51.008v-17.28H320.256v17.28H268.48V163.904z m678.784 681.728h-744v-43.52h111.744V454.848h229.504v-48.704H221.248v-42.048h323.264v-39.744h54.016v39.744h331.52v41.984h-331.52v48.768h245.248v347.264h103.488v43.52z m203.264-94.528c0 59.52-30.72 89.28-92.224 89.28-25.472 0-46.016-0.512-61.504-1.472-2.496-22.976-6.528-45.248-12.032-66.752 22.976 5.504 46.72 8.256 71.232 8.256 24 0 35.968-11.52 35.968-34.496V247.872H971.2v-54.72h278.976v54.72H1150.4v503.232z m521.216 121.536c-67.008-55.488-137.28-108.032-210.752-157.504-4.992 9.984-10.496 19.008-16.512 27.008-41.472 57.024-113.28 101.504-215.232 133.504-9.472-16.512-21.504-34.496-35.968-54.016 94.528-27.008 161.28-64.512 200.256-112.512 34.496-44.992 51.776-113.024 51.776-204.032V421.12h57.728v82.496c0 62.528-6.72 115.776-20.224 159.744 84.48 54.016 161.472 107.008 230.976 158.976l-42.048 50.304z" p-id="10750" fill="#d81e06"></path><path d="M367.488 495.36h423.744v47.232H367.488V495.36zM367.488 581.632h423.744v47.232H367.488v-47.232z" p-id="10751" fill="#d81e06"></path></svg>
            我的置顶 (${topArticleItems.length}篇)`,
      items: topArticleItems,
      collapsed: false,
    });

    // 将最近年份分组展开
    yearGroups[1].collapsed = false;
  } else {
    // 将最近年份分组展开
    yearGroups[0].collapsed = false;
  }

  // 添加序号
  addOrderNumber(yearGroups);
  return yearGroups;
}

/**
 * 根据 某小课/序号-分组/序号-xxx.md 的目录格式, 获取侧边栏分组及分组下标题
 * 
 * courses/mybatis/01-MyBatis基础/01-xxx.md
 * 
 * @param path 扫描基础路径
 * @returns {DefaultTheme.SidebarItem[]}
 */
function getItems (path: string) {
  // 侧边栏分组数组
  let groups: DefaultTheme.SidebarItem[] = [];
  // 侧边栏分组下标题数组
  let items: DefaultTheme.SidebarItem[] = [];
  let total = 0;
  // 当分组内文章数量少于 2 篇或文章总数显示超过 20 篇时，自动折叠分组
  const groupCollapsedSize = 2;
  const titleCollapsedSize = 20;

  // 1.获取所有分组目录
  sync(`docs/${path}/*`, {
    onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name }) => {
    let groupName = name;
    // 2.获取分组下的所有文章
    sync(`docs/${path}/${groupName}/*`, {
      onlyFiles: true,
      objectMode: true,
    }).forEach((article) => {
      const articleFile = matter.read(`${article.path}`);
      const { data } = articleFile;
      // 向前追加标题
      items.push({
        text: data.title,
        link: `/${path}/${groupName}/${article.name.replace('.md', '')}`,
      });
      total += 1;
    })

    // 3.向前追加到分组
    // 当分组内文章数量少于 A 篇或文章总数显示超过 B 篇时，自动折叠分组
    groups.push({
      text: `${groupName.substring(groupName.indexOf('-') + 1)} (${items.length}篇)`,
      items: items,
      collapsed: items.length < groupCollapsedSize || total > titleCollapsedSize,
    })

    // 4.清空侧边栏分组下标题数组
    items = [];
  })

  // 添加序号
  addOrderNumber(groups);
  return groups;
}

/**
 * 添加序号
 * 
 * @param groups 分组数据
 */
function addOrderNumber(groups) {
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].items.length; j++) {
      const items = groups[i].items;
      const index = j + 1;
      let indexStyle = `<div class="text-color-gray mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
      if (index == 1) {
        indexStyle = `<div class="text-color-red mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
      } else if (index == 2) {
        indexStyle = `<div class="text-color-orange mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
      } else if (index == 3) {
        indexStyle = `<div class="text-color-yellow mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
      }
      items[j].text = `${indexStyle}${items[j].text}`;
    }
  }
}