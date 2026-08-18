export type AutoReplyRule = {
  id: string;
  keywords: string[];
  response: string;
  enabled: boolean;
  matchType: 'exact' | 'contains' | 'startsWith';
};

// Règles par défaut
const defaultRules: AutoReplyRule[] = [
  {
    id: '1',
    keywords: ['bonjour', 'hello', 'salut', 'hi'],
    response: '👋 Bonjour ! Bienvenue sur SunuShop. Comment puis-je vous aider ?',
    enabled: true,
    matchType: 'contains'
  },
  {
    id: '2',
    keywords: ['prix', 'tarif', 'combien', 'coût'],
    response: '💰 Nos prix sont disponibles sur notre site : https://www.sunu-shop.org',
    enabled: true,
    matchType: 'contains'
  },
  {
    id: '3',
    keywords: ['commande', 'acheter', 'produit'],
    response: '🛍️ Pour passer commande, visitez https://www.sunu-shop.org ou envoyez-nous votre liste !',
    enabled: true,
    matchType: 'contains'
  },
  {
    id: '4',
    keywords: ['livraison', 'delivery', 'délai'],
    response: '🚚 La livraison est effectuée sous 24-48h. Suivez votre commande sur notre site.',
    enabled: true,
    matchType: 'contains'
  },
  {
    id: '5',
    keywords: ['merci', 'thanks', 'ok'],
    response: '🙏 Merci à vous ! N\'hésitez pas à nous contacter pour toute question.',
    enabled: true,
    matchType: 'contains'
  },
  {
    id: '6',
    keywords: ['catalogue', 'stock', 'disponible'],
    response: '📋 Consultez notre catalogue en ligne : https://www.sunu-shop.org',
    enabled: true,
    matchType: 'contains'
  },
  {
    id: '7',
    keywords: ['paiement', 'payer', 'payment'],
    response: '💳 Nous acceptons Wave, Orange Money, CinetPay et paiement à la livraison.',
    enabled: true,
    matchType: 'contains'
  },
  {
    id: '8',
    keywords: ['contact', 'téléphone', 'appel'],
    response: '📞 Vous pouvez nous joindre au +221 77 350 95 59 ou sur WhatsApp.',
    enabled: true,
    matchType: 'contains'
  },
];

// Stockage des règles (en mémoire pour le moment)
let rules: AutoReplyRule[] = [...defaultRules];

// Fonctions de gestion des règles
export function getRules(): AutoReplyRule[] {
  return rules;
}

export function getEnabledRules(): AutoReplyRule[] {
  return rules.filter(rule => rule.enabled);
}

export function addRule(rule: Omit<AutoReplyRule, 'id'>): AutoReplyRule {
  const newRule = {
    ...rule,
    id: Date.now().toString(),
  };
  rules.push(newRule);
  return newRule;
}

export function updateRule(id: string, updates: Partial<AutoReplyRule>): AutoReplyRule | null {
  const index = rules.findIndex(r => r.id === id);
  if (index === -1) return null;
  rules[index] = { ...rules[index], ...updates };
  return rules[index];
}

export function deleteRule(id: string): boolean {
  const index = rules.findIndex(r => r.id === id);
  if (index === -1) return false;
  rules.splice(index, 1);
  return true;
}

export function toggleRule(id: string): AutoReplyRule | null {
  const rule = rules.find(r => r.id === id);
  if (!rule) return null;
  rule.enabled = !rule.enabled;
  return rule;
}

// Fonction principale : trouver une réponse pour un message
export function findAutoReply(message: string): string | null {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Si le message est vide ou trop court
  if (normalizedMessage.length < 2) return null;
  
  // Parcourir toutes les règles actives
  const enabledRules = getEnabledRules();
  for (const rule of enabledRules) {
    for (const keyword of rule.keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      
      switch (rule.matchType) {
        case 'exact':
          if (normalizedMessage === normalizedKeyword) {
            return rule.response;
          }
          break;
        case 'startsWith':
          if (normalizedMessage.startsWith(normalizedKeyword)) {
            return rule.response;
          }
          break;
        case 'contains':
        default:
          if (normalizedMessage.includes(normalizedKeyword)) {
            return rule.response;
          }
          break;
      }
    }
  }
  
  return null;
}

// Fonction pour initialiser les règles depuis Firestore (à implémenter)
export async function loadRulesFromFirestore() {
  // TODO: Charger les règles depuis Firestore
  // return getRules();
}

// Fonction pour sauvegarder les règles dans Firestore (à implémenter)
export async function saveRulesToFirestore() {
  // TODO: Sauvegarder les règles dans Firestore
  // return true;
}
