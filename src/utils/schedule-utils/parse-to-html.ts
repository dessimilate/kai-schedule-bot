import { JSDOM } from 'jsdom'

export const parseToHtml = (html: string) => new JSDOM(html).window.document
