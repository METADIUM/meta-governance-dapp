const domain = process.env.REACT_APP_URL

module.exports = {
  policy: [
    {
      userAgent: '*',
      allow: '/'
    }
  ],
  sitemap: `${domain}/sitemap.xml`
}
