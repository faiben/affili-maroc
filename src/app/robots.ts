import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://affilimaroc.ma";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/tableau-de-bord", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
