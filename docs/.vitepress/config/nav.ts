import type { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '我的分类',
    items: [
      { text: '分类1', link: '/categories/category1/index', activeMatch: '/categories/category1/' },
    ],
    activeMatch: '/categories/'
  },
  {
    text: '我的小册',
    items: [
      { text: '小册1', link: '/courses/course1/index', activeMatch: '/courses/course1/' },
    ],
    activeMatch: '/courses/'
  },
  {
    text: '我的标签',
    link: '/tags',
    activeMatch: '/tags'
  },
  {
    text: '我的归档',
    link: '/archives',
    activeMatch: '/archives'
  },
];
