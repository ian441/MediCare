import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users, Award, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/data/services";
import { doctors } from "@/data/doctors";
import { testimonials } from "@/data/testimonials";
import { blogPosts } from "@/data/blog";
import { useState } from "react";

const stats = [
  { label: "Patients Served", value: "50,000+", icon: Users },
  { label: "Specialist Doctors", value: "25+", icon: Award },
  { label: "Years of Service", value: "16+", icon: Clock },
  { label: "Patient Satisfaction", value: "4.9★", icon: Star },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HomePage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-medical opacity-5" />
        <div className="container py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
              <motion.p variants={fadeUp} custom={0} className="text-secondary font-semibold mb-2">🏥 Karibu — Welcome to MediCare</motion.p>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
                Your Health, Our <span className="gradient-medical-text">Priority</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground mb-8 max-w-lg">
                Nairobi's premier multi-specialty clinic delivering compassionate, world-class healthcare. Book an appointment today and experience the MediCare difference.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Link to="/appointments">
                  <Button size="lg" className="gradient-medical border-0 text-primary-foreground text-lg px-8 hover:opacity-90">
                    Book Appointment <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="text-lg px-8">Our Services</Button>
                </Link>
              </motion.div>
              <motion.p variants={fadeUp} custom={4} className="mt-4 text-sm text-muted-foreground">
                Demo login: <code className="bg-muted px-2 py-0.5 rounded text-xs">patient@medicare.ke / password123</code>
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=700&h=500&fit=crop"
                  alt="MediCare Clinic - Modern healthcare facility"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-medical flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">24/7 Emergency</p>
                    <p className="text-xs text-muted-foreground">Always here for you</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 gradient-medical">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-primary-foreground"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="text-3xl font-heading font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our <span className="gradient-medical-text">Services</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive healthcare services tailored to every patient's needs</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.slice(0, 8).map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-transparent hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:gradient-medical transition-all">
                      <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="font-heading font-semibold mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                    <p className="text-xs font-semibold text-primary">{service.priceRange}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services">
              <Button variant="outline" size="lg">View All Services <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Doctor Spotlight */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Meet Our <span className="gradient-medical-text">Doctors</span></h2>
            <p className="text-muted-foreground">Experienced specialists committed to your health</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="h-48 overflow-hidden">
                    <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-heading font-semibold">{doc.name}</h3>
                    <p className="text-sm text-primary mb-1">{doc.specialty}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{doc.rating}</span>
                      <span className="text-muted-foreground">({doc.reviews} reviews)</span>
                    </div>
                    <Link to="/appointments" className="block mt-3">
                      <Button size="sm" variant="outline" className="w-full">Book Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/doctors"><Button variant="outline">View All Doctors <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">What Our <span className="gradient-medical-text">Patients</span> Say</h2>
          </div>
          <div className="max-w-2xl mx-auto relative">
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-lg mb-6 italic text-muted-foreground">"{testimonials[testimonialIdx].text}"</p>
                <div className="w-12 h-12 rounded-full gradient-medical flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">
                  {testimonials[testimonialIdx].avatar}
                </div>
                <p className="font-heading font-semibold">{testimonials[testimonialIdx].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[testimonialIdx].service}</p>
              </CardContent>
            </Card>
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="outline" size="icon" onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === testimonialIdx ? "bg-primary" : "bg-border"}`} />
              ))}
              <Button variant="outline" size="icon" onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Health <span className="gradient-medical-text">Resources</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-all">
                  <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
                  <CardContent className="p-5">
                    <span className="text-xs font-semibold text-primary">{post.category}</span>
                    <h3 className="font-heading font-semibold mt-1 mb-2 line-clamp-2 text-sm">{post.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                      <span>{post.readTime} read</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/blog"><Button variant="outline">Read More <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-medical text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">Book an appointment today and let our expert team take care of you. Afya yako ni kipaumbele chetu.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/appointments">
              <Button size="lg" variant="secondary" className="text-lg px-8">Book Appointment</Button>
            </Link>
            <Link to="/symptom-checker">
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Symptom Checker
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
