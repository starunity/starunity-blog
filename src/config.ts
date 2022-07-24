export interface ILinkList {
  name: string
  url?: string | null
  linkItem: {
    text: string
    url: string
  }[]
}

export const NAVIGATOR: ILinkList = {
  name: "StarUnity's Blog",
  url: '/',
  linkItem: [
    { text: 'Posts', url: '/posts' },
    { text: 'RSS', url: '/rss.xml' },
    { text: 'GitHub', url: 'https://github.com/starunity' },
  ],
}

export const FIRST_PUBLICATION_YEAR = 2022
