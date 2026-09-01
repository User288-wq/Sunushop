import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sunu-shop.org";

  // Récupérer les produits depuis l'API
  let products: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success) {
      products = data.products || [];
    }
  } catch (error) {
    console.error("Erreur récupération produits:", error);
  }

  // Pages statiques
  const staticPages = [
    { path: "", priority: 1 },
    { path: "/preinscription", priority: 0.8 },
    { path: "/vendre", priority: 0.9 },
    { path: "/panier", priority: 0.8 },
    { path: "/dashboard", priority: 0.7 },
    { path: "/chat", priority: 0.7 },
    { path: "/whatsapp", priority: 0.7 },
    { path: "/whatsapp/admin", priority: 0.6 },
    { path: "/livreur/dashboard", priority: 0.6 },
    { path: "/stock/dashboard", priority: 0.6 },
    { path: "/commission/dashboard", priority: 0.6 },
    { path: "/analytics", priority: 0.6 },
    { path: "/payment", priority: 0.6 },
    { path: "/vendeurs", priority: 0.8 },
    { path: "/expansion", priority: 0.7 },
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: page.priority,
  }));

  // Pages produits dynamiques
  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/produit/${product.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...productUrls];
}
