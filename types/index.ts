export interface Produit {
  id: string;
  boutiqueId: string;
  titre: string;
  description: string;
  prix: number;
  videoURL?: string;
  photos: string[];
  stock: number;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PanierItem {
  produitId: string;
  titre: string;
  prix: number;
  quantite: number;
  photo: string;
  boutiqueId: string;
  boutiqueNom: string;
}
