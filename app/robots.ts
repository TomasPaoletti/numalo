import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://numeraloapp.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/info", "/contact", "/terms", "/privacy", "/register", "/login", "/raffle/"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
