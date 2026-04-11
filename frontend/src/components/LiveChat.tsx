import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickReplies = [
  { q: "What are your working hours?", a: "We're open Mon-Sat 7AM-9PM. Our Emergency unit is open 24/7, including Sundays and holidays." },
  { q: "How do I book an appointment?", a: "You can book online through our Appointments page, call us at 0700 000 000, or walk in. Online booking is fastest!" },
  { q: "Do you accept NHIF?", a: "Yes! MediCare Clinic is fully NHIF-accredited. We also accept most major insurance providers." },
  { q: "Where are you located?", a: "We're located in Westlands, Nairobi, along Waiyaki Way. Plenty of parking available!" },
  { q: "Do you offer telemedicine?", a: "Yes! You can consult our doctors via video call from anywhere. Visit our Telemedicine page to get started." },
];

interface Message {
  from: "user" | "bot";
  text: string;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Habari! 👋 Welcome to MediCare Clinic. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleQuickReply = (q: string, a: string) => {
    setMessages((m) => [...m, { from: "user", text: q }, { from: "bot", text: a }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    
    const match = quickReplies.find((r) => userMsg.toLowerCase().includes(r.q.toLowerCase().split(" ").slice(0, 3).join(" ").toLowerCase()));
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: match?.a || "Asante for your message! A member of our team will get back to you shortly. For urgent matters, please call 0700 000 000." }]);
    }, 800);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border rounded-2xl shadow-xl overflow-hidden flex flex-col"
            style={{ maxHeight: "70vh" }}
          >
            {/* Header */}
            <div className="gradient-medical p-4 text-primary-foreground flex justify-between items-center">
              <div>
                <h3 className="font-heading font-bold">MediCare Support</h3>
                <p className="text-xs opacity-80">Typically replies in minutes</p>
              </div>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "300px" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    msg.from === "user"
                      ? "gradient-medical text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1">
                {quickReplies.slice(0, 3).map((r) => (
                  <button
                    key={r.q}
                    onClick={() => handleQuickReply(r.q, r.a)}
                    className="text-xs px-3 py-1.5 rounded-full border text-primary hover:bg-accent transition-colors"
                  >
                    {r.q.split("?")[0]}?
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="text-sm"
              />
              <Button size="icon" onClick={handleSend} className="gradient-medical border-0 text-primary-foreground shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-medical text-primary-foreground shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Live Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
