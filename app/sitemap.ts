import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sunu-shop.org";

  const routes = [
    "",
    "/preinscription",
    "/vendre",
    "/panier",
    "/dashboard",
    "/chat",
    "/whatsapp",
    "/whatsapp/admin",
    "/livreur/dashboard",
    "/stock/dashboard",
    "/commission/dashboard",
    "/analytics",
    "/payment",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
