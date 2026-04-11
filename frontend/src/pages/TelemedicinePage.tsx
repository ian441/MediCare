import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TelemedicinePage() {
  const [inCall, setInCall] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [msg, setMsg] = useState("");

  const sendMsg = () => {
    if (!msg.trim()) return;
    setMessages((m) => [...m, { from: "You", text: msg }]);
    setMsg("");
    setTimeout(() => setMessages((m) => [...m, { from: "Dr. Amina", text: "Thank you for sharing. Let me check that for you." }]), 1500);
  };

  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-20">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <Video className="inline w-10 h-10 mr-2" /> Telemedicine
          </motion.h1>
          <p className="text-lg opacity-80">Consult with our doctors from anywhere via secure video call</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl">
          {!inCall ? (
            <Card>
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-24 h-24 rounded-full gradient-medical flex items-center justify-center mx-auto">
                  <Video className="w-12 h-12 text-primary-foreground" />
                </div>
                <h2 className="font-heading font-bold text-2xl">Ready for Your Video Consultation?</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Connect face-to-face with our qualified doctors from the comfort of your home. Ideal for follow-ups, minor ailments, and health advice.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-accent rounded-lg"><p className="font-semibold text-primary">KSh 1,500</p><p className="text-muted-foreground">Starting from</p></div>
                  <div className="p-4 bg-accent rounded-lg"><p className="font-semibold text-primary">15-30 min</p><p className="text-muted-foreground">Session duration</p></div>
                  <div className="p-4 bg-accent rounded-lg"><p className="font-semibold text-primary">Secure</p><p className="text-muted-foreground">End-to-end encrypted</p></div>
                </div>
                <Button size="lg" className="gradient-medical border-0 text-primary-foreground" onClick={() => setInCall(true)}>
                  Start Demo Video Call
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Video area */}
              <div className="relative bg-foreground rounded-2xl overflow-hidden" style={{ height: "500px" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {videoOn ? (
                    <div className="text-center text-primary-foreground">
                      <div className="w-32 h-32 rounded-full gradient-medical flex items-center justify-center mx-auto mb-4 animate-float">
                        <span className="text-4xl font-heading font-bold">AW</span>
                      </div>
                      <p className="font-heading font-semibold text-lg">Dr. Amina Wanjiku</p>
                      <p className="text-sm opacity-60">General & Family Medicine</p>
                      <p className="text-xs opacity-40 mt-2">🔴 Demo call in progress...</p>
                    </div>
                  ) : (
                    <p className="text-primary-foreground opacity-50">Camera is off</p>
                  )}
                </div>
                {/* Self view */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                  {videoOn ? "You" : <VideoOff className="w-5 h-5" />}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button variant={micOn ? "outline" : "destructive"} size="icon" className="w-14 h-14 rounded-full" onClick={() => setMicOn(!micOn)}>
                  {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </Button>
                <Button variant={videoOn ? "outline" : "destructive"} size="icon" className="w-14 h-14 rounded-full" onClick={() => setVideoOn(!videoOn)}>
                  {videoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>
                <Button variant="outline" size="icon" className="w-14 h-14 rounded-full" onClick={() => setChatOpen(!chatOpen)}>
                  <MessageSquare className="w-6 h-6" />
                </Button>
                <Button variant="destructive" size="icon" className="w-14 h-14 rounded-full" onClick={() => setInCall(false)}>
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </div>

              {/* Chat */}
              {chatOpen && (
                <Card>
                  <CardContent className="p-4">
                    <div className="h-40 overflow-y-auto space-y-2 mb-3">
                      {messages.length === 0 && <p className="text-sm text-muted-foreground text-center">Start typing to chat with the doctor...</p>}
                      {messages.map((m, i) => (
                        <div key={i} className={`text-sm ${m.from === "You" ? "text-right" : ""}`}>
                          <span className="font-semibold">{m.from}: </span>{m.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg()} placeholder="Type a message..." />
                      <Button size="icon" onClick={sendMsg} className="gradient-medical border-0 text-primary-foreground"><Send className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
