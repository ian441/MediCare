import { motion } from "framer-motion";
import { Award, Heart, Users, Target, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  { icon: Heart, title: "Compassion", desc: "We treat every patient with dignity, empathy, and genuine care." },
  { icon: Shield, title: "Excellence", desc: "We maintain the highest standards in medical practice and patient safety." },
  { icon: Users, title: "Inclusivity", desc: "Quality healthcare accessible to all, regardless of background." },
  { icon: Target, title: "Innovation", desc: "We embrace modern technology to deliver better health outcomes." },
  { icon: Clock, title: "Reliability", desc: "Available when you need us, with 24/7 emergency services." },
  { icon: Award, title: "Integrity", desc: "Transparent, honest, and ethical in every interaction." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-20">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            About MediCare Clinic
          </motion.h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Nairobi's trusted multi-specialty clinic, providing world-class healthcare since 2010.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-6">Our <span className="gradient-medical-text">Story</span></h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Founded in 2010 by a team of visionary Kenyan doctors, MediCare Clinic began as a small family practice in Westlands, Nairobi. Our founders believed that every Kenyan deserves access to quality, compassionate healthcare — regardless of their economic status.</p>
              <p>Over the past 16 years, we have grown into one of Nairobi's most trusted multi-specialty clinics, serving over 50,000 patients. Our state-of-the-art facility houses 20+ specialized departments, a 24/7 emergency unit, modern diagnostic lab, and a fully stocked pharmacy.</p>
              <p>We are proud to be NHIF-accredited, KMPDB-certified, and recognized by leading insurance providers. Our telemedicine platform extends our care beyond Nairobi's borders, reaching patients across Kenya and East Africa.</p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop"
              alt="MediCare Clinic facility"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Our <span className="gradient-medical-text">Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <v.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-heading font-semibold text-lg mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">Certifications & Accreditations</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {["KMPDB Certified", "NHIF Accredited", "WHO Standards", "ISO 9001:2015", "Kenya Red Cross Partner"].map((cert) => (
              <div key={cert} className="px-6 py-3 rounded-full border-2 border-primary/20 text-primary font-semibold text-sm">
                ✓ {cert}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
