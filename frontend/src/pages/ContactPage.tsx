import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, Siren } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly. Asante! 🙏");
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-20">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Contact & Emergency
          </motion.h1>
          <p className="text-lg opacity-80">We're here for you — reach out anytime</p>
        </div>
      </section>

      {/* Emergency banner */}
      <section className="bg-destructive text-destructive-foreground py-6">
        <div className="container flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Siren className="w-8 h-8" />
          <div>
            <p className="font-heading font-bold text-lg">Medical Emergency?</p>
            <p className="text-sm opacity-80">Call our 24/7 emergency line immediately</p>
          </div>
          <a href="tel:+254700000000">
            <Button variant="secondary" size="lg" className="font-bold">
              <Phone className="w-5 h-5 mr-2" /> 0700 000 000
            </Button>
          </a>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold">Get in <span className="gradient-medical-text">Touch</span></h2>
            <div className="space-y-4">
              {[
                { icon: Phone, label: "Phone", value: "0700 000 000 / 0711 111 111", href: "tel:+254700000000" },
                { icon: Mail, label: "Email", value: "info@medicare.ke", href: "mailto:info@medicare.ke" },
                { icon: MapPin, label: "Location", value: "MediCare Clinic, Waiyaki Way, Westlands, Nairobi, Kenya" },
                { icon: Clock, label: "Hours", value: "Mon-Sat: 7:00 AM - 9:00 PM | Emergency: 24/7" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-muted-foreground hover:text-primary">{item.value}</a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                title="MediCare Clinic"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.27145816834!2d36.8028!3d-1.2641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17366e0e4f1d%3A0x5bf0f1b1c738e4c3!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact form */}
          <Card>
            <CardContent className="p-8">
              <h2 className="font-heading font-bold text-xl mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required /></div>
                <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required /></div>
                <div><Label>Message</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" rows={5} required /></div>
                <Button type="submit" className="w-full gradient-medical border-0 text-primary-foreground">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
