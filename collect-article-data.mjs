import glob  from 'fast-glob'
import matter from 'gray-matter'
import fs from 'node:fs/promises'

const articleData = await Promise.all(
  glob.sync('./repos/**/*.md', {
    onlyFiles: true,
    objectMode: true,
    ignore: ['./repos/**/index.md', './repos/**/tags.md', './repos/**/archives.md', './repos/**/me.md'], // without !
  }).map(async (article) => {
    const file = matter.read(`${article.path}`)
    const { data, path } = file
    return {
      ...data,
      path: path.replace(/\.md$/, '.html').replace('./repos/', '')
    }
  })
)

await fs.writeFile('./article-data.json', JSON.stringify(articleData), 'utf-8')