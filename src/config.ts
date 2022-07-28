export interface ILinkList {
  name: string
  url?: string | null
  linkItem: {
    text: string
    url: string
  }[]
}

export const SITE = {
  title: "StarUnity's Blog",
  description: "StarUnity's Blog",
  defaultLanguage: 'en',
}

export const NAVIGATOR: ILinkList = {
  name: SITE.title,
  url: '/',
  linkItem: [
    { text: 'Posts', url: '/posts' },
    { text: 'RSS', url: '/rss.xml' },
    { text: 'GitHub', url: 'https://github.com/starunity' },
  ],
}

export const FIRST_PUBLICATION_YEAR = 2022
