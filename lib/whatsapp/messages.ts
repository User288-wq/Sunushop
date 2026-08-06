import { db } from '@/lib/firebase/firestore';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

export type WhatsAppMessage = {
  id?: string;
  senderJid: string;
  receiverJid?: string;
  text: string;
  fromMe: boolean;
  messageType: string;
  messageId: string;
  status: 'sent' | 'delivered' | 'read' | 'pending' | 'failed';
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

const COLLECTION = 'whatsapp_messages';

// Sauvegarder un message
export async function saveWhatsAppMessage(data: Omit<WhatsAppMessage, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      timestamp: data.timestamp || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Erreur sauvegarde message:', error);
    return { id: null, success: false, error };
  }
}

// Récupérer les messages d'un contact
export async function getMessagesByContact(jid: string, limitCount: number = 50) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('senderJid', '==', jid),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const messages: WhatsAppMessage[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as WhatsAppMessage);
    });
    return messages;
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    return [];
  }
}

// Récupérer tous les messages
export async function getAllMessages(limitCount: number = 100) {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const messages: WhatsAppMessage[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as WhatsAppMessage);
    });
    return messages;
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    return [];
  }
}

// Mettre à jour le statut d'un message
export async function updateMessageStatus(messageId: string, status: WhatsAppMessage['status']) {
  try {
    const docRef = doc(db, COLLECTION, messageId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    return { success: false, error };
  }
}

// Supprimer un message
export async function deleteMessage(messageId: string) {
  try {
    await deleteDoc(doc(db, COLLECTION, messageId));
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression message:', error);
    return { success: false, error };
  }
}

// Vérifier si un message existe
export async function messageExists(messageId: string) {
  try {
    const docRef = doc(db, COLLECTION, messageId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Erreur vérification message:', error);
    return false;
  }
}
