import DefaultTheme from 'vitepress/theme'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: 'Bug万象集',
    link: '/issues/index',
    activeMatch: '/issues/' // 当前页面处于匹配路径下时, 对应导航菜单将突出显示
  },
  {
    text: '"杂碎"逆袭史',
    link: '/fragments/index',
    activeMatch: '/fragments/'
  },
  {
    text: '方案春秋志',
    link: '/solutions/index',
    activeMatch: '/solutions/'
  },
  {
    text: '关于',
    items: [
      { text: '关于知识库', link: '/about/index' },
      { text: '关于笔者', link: '/about/me' }
    ],
    activeMatch: '/about/'
  }
]