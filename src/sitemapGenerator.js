require("@babel/register")

const router = require("./sitemapRoutes").default

const Sitemap = require("react-router-sitemap").default

function generateSitemap () {
  const date = new Date().toISOString().slice(0, 10)
  let sitemap = new Sitemap(router).build(process.env.REACT_APP_URL)
  for (let i = 0; i < sitemap.sitemaps[0].urls.length; i++) {
    sitemap.sitemaps[0].urls[i].lastmod = date
    sitemap.sitemaps[0].urls[i].priority = i ? 0.8 : 1
  }
  sitemap.save("./public/sitemap.xml")
}

generateSitemap()
