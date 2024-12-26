/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.SITE_UR || "http://client.happybooktravel.com",
  changefreq: "daily",
  priority: 1,
  generateRobotsTxt: true,
  // alternateRefs: [
  //   {
  //     href: process.env.SITE_URL || "http://client.happybooktravel.com",
  //     hreflang: "vi",
  //   },
  // ],
  additionalPaths: async (config) => [await config.transform(config, "/")],
  // Default transformation function
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      // alternateRefs: config.alternateRefs ?? [],
    };
  },
  exclude: ["/server-sitemap-index.xml"], // <= exclude here
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: [
      `${
        process.env.SITE_URL || "http://client.happybooktravel.com"
      }/server-sitemap-index.xml`,
    ],
  },
};
