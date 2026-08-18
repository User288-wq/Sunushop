import axios from 'axios';

const META_API_URL = 'https://graph.facebook.com/v18.0';

export interface SocialProduct {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  productUrl: string;
  category?: string;
}

export interface MetaPostResponse {
  id: string;
  post_id?: string;
  share_url?: string;
}

class MetaService {
  private accessToken: string;
  private pageId: string;
  private instagramId: string;

  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN || '';
    this.pageId = process.env.FACEBOOK_PAGE_ID || '';
    this.instagramId = process.env.INSTAGRAM_BUSINESS_ID || '';
  }

  // ============================================================
  // 1. Publier sur Facebook
  // ============================================================

  async postToFacebook(product: SocialProduct): Promise<MetaPostResponse | null> {
    try {
      console.log(`📱 Publication Facebook: ${product.title}`);

      if (!this.accessToken || !this.pageId) {
        console.log('⚠️ Token Facebook manquant');
        return null;
      }

      const message = this.generateMessage(product);

      const response = await axios.post(
        `${META_API_URL}/${this.pageId}/feed`,
        {
          message: message,
          link: product.productUrl,
          access_token: this.accessToken,
        }
      );

      console.log(`✅ Posté sur Facebook: ${response.data.id}`);
      return {
        id: response.data.id,
        share_url: `https://www.facebook.com/${this.pageId}/posts/${response.data.id}`,
      };
    } catch (error: any) {
      console.error('❌ Erreur Facebook:', error.response?.data || error.message);
      return null;
    }
  }

  // ============================================================
  // 2. Publier sur Instagram (avec fallback)
  // ============================================================

  async postToInstagram(product: SocialProduct): Promise<MetaPostResponse | null> {
    try {
      console.log(`📱 Publication Instagram: ${product.title}`);

      // Vérifier si Instagram Business est configuré
      if (!this.accessToken || !this.instagramId) {
        console.log('⚠️ Instagram Business non configuré');
        // Fallback: générer un lien de partage
        return {
          id: 'link_only',
          share_url: `https://www.instagram.com/create/story?text=${encodeURIComponent(this.generateCaption(product))}`,
        };
      }

      // Tentative de publication réelle
      try {
        // Étape 1: Créer un container de média
        const containerResponse = await axios.post(
          `${META_API_URL}/${this.instagramId}/media`,
          {
            image_url: product.imageUrl,
            caption: this.generateCaption(product),
            access_token: this.accessToken,
          }
        );

        const containerId = containerResponse.data.id;
        console.log(`📦 Container créé: ${containerId}`);

        // Étape 2: Publier le container
        const publishResponse = await axios.post(
          `${META_API_URL}/${this.instagramId}/media_publish`,
          {
            creation_id: containerId,
            access_token: this.accessToken,
          }
        );

        console.log(`✅ Posté sur Instagram: ${publishResponse.data.id}`);
        return {
          id: publishResponse.data.id,
          share_url: `https://www.instagram.com/p/${publishResponse.data.id}`,
        };
      } catch (apiError: any) {
        console.log('⚠️ Publication directe impossible, fallback sur le lien');
        return {
          id: 'link_only',
          share_url: `https://www.instagram.com/create/story?text=${encodeURIComponent(this.generateCaption(product))}`,
        };
      }
    } catch (error: any) {
      console.error('❌ Erreur Instagram:', error.message);
      return {
        id: 'link_only',
        share_url: `https://www.instagram.com/create/story?text=${encodeURIComponent(this.generateCaption(product))}`,
      };
    }
  }

  // ============================================================
  // 3. Générer un message pour Facebook
  // ============================================================

  generateMessage(product: SocialProduct): string {
    return `
🛍️ ${product.title}

💰 ${product.price.toLocaleString()} FCFA

📝 ${product.description || 'Découvrez ce produit sur SunuShop !'}

🔗 ${product.productUrl}

#SunuShop #ModeSenegalaise #DakarShop #ShoppingSn
    `.trim();
  }

  // ============================================================
  // 4. Générer une légende pour Instagram
  // ============================================================

  generateCaption(product: SocialProduct): string {
    return `
🛍️ ${product.title}

💰 ${product.price.toLocaleString()} FCFA

${product.description || 'Découvrez ce produit sur SunuShop !'}

🔗 Lien dans la bio

#SunuShop #ModeSenegalaise #DakarShop #ShoppingSn
    `.trim();
  }

  // ============================================================
  // 5. Partager sur tous les réseaux
  // ============================================================

  async shareAll(product: SocialProduct): Promise<{
    facebook: MetaPostResponse | null;
    instagram: MetaPostResponse | null;
  }> {
    const [facebook, instagram] = await Promise.all([
      this.postToFacebook(product),
      this.postToInstagram(product),
    ]);

    return { facebook, instagram };
  }

  // ============================================================
  // 6. Générer des liens de partage
  // ============================================================

  generateShareLinks(product: SocialProduct): {
    facebook: string;
    instagram: string;
    whatsapp: string;
    twitter: string;
  } {
    const url = encodeURIComponent(product.productUrl);
    const title = encodeURIComponent(`${product.title} - ${product.price.toLocaleString()} FCFA`);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`,
      instagram: `https://www.instagram.com/create/story?text=${title}%20${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
    };
  }

  // ============================================================
  // 7. Vérifier le statut des pages
  // ============================================================

  async verifyPages(): Promise<{
    facebook: boolean;
    instagram: boolean;
  }> {
    const result = { facebook: false, instagram: false };

    if (!this.accessToken) return result;

    try {
      if (this.pageId) {
        const fbResponse = await axios.get(
          `${META_API_URL}/${this.pageId}`,
          { params: { access_token: this.accessToken } }
        );
        result.facebook = true;
      }
    } catch (error) {}

    try {
      if (this.instagramId) {
        const igResponse = await axios.get(
          `${META_API_URL}/${this.instagramId}`,
          { params: { access_token: this.accessToken } }
        );
        result.instagram = true;
      }
    } catch (error) {}

    return result;
  }
}

export const metaService = new MetaService();
