import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/data/services";
import { Clock, DollarSign } from "lucide-react";

export default function ServicesPage() {
  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-20">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Our Services
          </motion.h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Comprehensive healthcare services for every need — from preventive care to specialized treatments
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="h-full hover:shadow-lg transition-all group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:gradient-medical transition-all">
                        <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-secondary">{service.category}</span>
                        <h3 className="font-heading font-semibold text-lg">{service.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{service.longDescription}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{service.priceRange}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{service.duration}</span>
                    </div>
                    <Link to="/appointments">
                      <Button className="w-full gradient-medical border-0 text-primary-foreground hover:opacity-90">Book Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
