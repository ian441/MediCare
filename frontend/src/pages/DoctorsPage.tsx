import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { doctors } from "@/data/doctors";
import { Star, GraduationCap, Globe, Calendar } from "lucide-react";

export default function DoctorsPage() {
  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-20">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Our Doctors
          </motion.h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Meet our team of experienced, caring specialists dedicated to your health
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid md:grid-cols-2 gap-8">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-48 sm:h-auto shrink-0">
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-bold text-lg">{doc.name}</h3>
                      </div>
                      <p className="text-sm text-primary font-semibold mb-1">{doc.title} — {doc.specialty}</p>
                      <div className="flex items-center gap-1 text-sm mb-3">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{doc.rating}</span>
                        <span className="text-muted-foreground">({doc.reviews} reviews)</span>
                        <span className="text-muted-foreground ml-2">• {doc.experience} yrs exp</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{doc.bio}</p>
                      <div className="flex flex-wrap gap-2 mb-3 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground"><GraduationCap className="w-3 h-3" />{doc.education}</span>
                        <span className="flex items-center gap-1 text-muted-foreground"><Globe className="w-3 h-3" />{doc.languages.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div className="flex gap-1">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <span key={day} className={`text-xs px-2 py-0.5 rounded ${doc.availability.includes(day) ? "bg-secondary/20 text-secondary font-semibold" : "bg-muted text-muted-foreground"}`}>
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-primary">KSh {doc.fee.toLocaleString()}/visit</p>
                        <Link to="/appointments">
                          <Button size="sm" className="gradient-medical border-0 text-primary-foreground">Book Now</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
