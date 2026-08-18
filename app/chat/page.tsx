"use client";

import { useState, useEffect, useRef } from "react";
import { useWhatsApp } from "@/context/WhatsAppContext";

type Message = {
  id: string;
  key?: { id: string; remoteJid: string; fromMe: boolean };
  message?: {
    conversation?: string;
    extendedTextMessage?: { text: string };
    imageMessage?: { caption?: string };
  };
  messageTimestamp: number;
  pushName?: string;
  fromMe?: boolean;
  text?: string;
};

type Contact = {
  jid: string;
  name?: string;
  pushName?: string;
  profilePicUrl?: string;
};

export default function ChatPage() {
  const { unreadCount, isConnected } = useWhatsApp();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger les contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/whatsapp/contacts");
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
        if (data.contacts.length > 0 && !selectedContact) {
          setSelectedContact(data.contacts[0].jid);
        }
      }
    } catch (error) {
      console.error("Erreur contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les messages d'un contact
  const fetchMessages = async (contact: string) => {
    try {
      const res = await fetch(`/api/whatsapp/chat?contact=${encodeURIComponent(contact)}&limit=100`);
      const data = await res.json();
      if (data.success) {
        // Formater les messages
        const formattedMessages = data.messages.map((msg: any) => ({
          ...msg,
          text: msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                msg.message?.imageMessage?.caption ||
                '',
          fromMe: msg.key?.fromMe || false,
          id: msg.key?.id || msg.id,
        }));
        setMessages(formattedMessages.reverse());
      }
    } catch (error) {
      console.error("Erreur messages:", error);
    }
  };

  // Envoyer un message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedContact || sending) return;

    setSending(true);
    try {
      const number = selectedContact.replace("@s.whatsapp.net", "");
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: number,
          message: messageText,
        }),
      });

      if (res.ok) {
        // Ajouter le message localement
        const newMessage = {
          id: Date.now().toString(),
          text: messageText,
          fromMe: true,
          messageTimestamp: Date.now() / 1000,
          pushName: "Moi",
        };
        setMessages(prev => [...prev, newMessage as any]);
        setMessageText("");
      }
    } catch (error) {
      console.error("Erreur envoi:", error);
    } finally {
      setSending(false);
    }
  };

  // Défiler vers le bas des messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Charger les contacts au départ
  useEffect(() => {
    fetchContacts();
  }, []);

  // Charger les messages quand un contact est sélectionné
  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact);
      // Rafraîchir toutes les 10 secondes
      const interval = setInterval(() => fetchMessages(selectedContact), 10000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  // Filtrer les contacts
  const filteredContacts = contacts.filter(contact => {
    const name = contact.pushName || contact.name || contact.jid;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "À l'instant";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const selectedContactData = contacts.find(c => c.jid === selectedContact);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Liste des contacts */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">💬 Conversations</h2>
          <div className="relative mt-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => {
            const name = contact.pushName || contact.name || contact.jid.replace("@s.whatsapp.net", "");
            return (
              <button
                key={contact.jid}
                onClick={() => setSelectedContact(contact.jid)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-100 ${
                  selectedContact === contact.jid ? "bg-green-50 border-l-4 border-l-green-500" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl text-green-600 flex-shrink-0">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-800 truncate">{name}</p>
                  <p className="text-sm text-gray-500 truncate">{contact.jid.replace("@s.whatsapp.net", "")}</p>
                </div>
              </button>
            );
          })}
          {filteredContacts.length === 0 && (
            <p className="text-gray-500 text-center py-8">Aucun contact trouvé</p>
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {/* En-tête du chat */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg text-green-600">
            {selectedContactData ? selectedContactData.pushName?.charAt(0).toUpperCase() || "?" : "?"}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {selectedContactData ? selectedContactData.pushName || selectedContactData.name || "Inconnu" : "Sélectionnez un contact"}
            </p>
            <p className="text-sm text-green-600">
              {isConnected ? "🟢 En ligne" : "🔴 Hors ligne"}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => selectedContact && fetchMessages(selectedContact)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
          {messages.map((msg, index) => {
            const isFromMe = msg.fromMe || msg.key?.fromMe;
            return (
              <div
                key={msg.id || index}
                className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isFromMe
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <p className="text-sm break-words">{msg.text || msg.message?.conversation || "Message sans texte"}</p>
                  <p className={`text-xs mt-1 ${isFromMe ? "text-green-200" : "text-gray-400"}`}>
                    {formatTime(msg.messageTimestamp || Date.now() / 1000)}
                    {isFromMe && " ✅"}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <form onSubmit={sendMessage} className="bg-white border-t border-gray-200 p-4 flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={selectedContact ? "Écrire un message..." : "Sélectionnez un contact pour commencer"}
            disabled={!selectedContact || !isConnected}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={!selectedContact || !isConnected || sending || !messageText.trim()}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${
              !selectedContact || !isConnected || sending || !messageText.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {sending ? "..." : "📤 Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
}
