import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Replace with the actual production URL once known
  const baseUrl = 'https://supipiguesthouse.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'], // We don't want search engines crawling admin panels
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
