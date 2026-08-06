import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export type IncomingWhatsAppMessage = {
  messageId: string;
  from: string;
  text: string;
  fromMe: boolean;
  timestamp?: number;
  instance?: string;
  raw?: unknown;
};

export async function saveWhatsAppMessage(msg: IncomingWhatsAppMessage) {
  const db = adminDb();
  const phone = msg.from.replace(/\D/g, "");
  const convRef = db.collection("conversations").doc(phone);
  const msgRef = convRef.collection("messages").doc(msg.messageId);

  const batch = db.batch();

  batch.set(
    msgRef,
    {
      id: msg.messageId,
      from: phone,
      text: msg.text,
      fromMe: msg.fromMe,
      timestamp: msg.timestamp ?? Date.now(),
      instance: msg.instance ?? "sunushop",
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  batch.set(
    convRef,
    {
      phone,
      lastMessage: msg.text || "(média)",
      lastAt: msg.timestamp ?? Date.now(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await batch.commit();
  return { phone, messageId: msg.messageId };
}
