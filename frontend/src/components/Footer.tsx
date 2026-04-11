import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Heart } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Doctors", href: "/doctors" },
  { label: "Appointments", href: "/appointments" },
  { label: "Patient Portal", href: "/portal" },
  { label: "Pharmacy", href: "/pharmacy" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  "General Medicine", "Emergency Care", "Cardiology", "Pediatrics",
  "Gynecology", "Telemedicine", "Lab Services", "Mental Health",
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-medical flex items-center justify-center">
                <span className="font-heading font-bold text-lg">M</span>
              </div>
              <span className="font-heading font-bold text-xl">MediCare Clinic</span>
            </div>
            <p className="text-sm opacity-70 mb-4">
              Your trusted multi-specialty healthcare partner in Nairobi, providing compassionate, world-class medical care since 2010.
            </p>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <a href="tel:+254700000000" className="flex items-center gap-2 hover:opacity-100"><Phone className="w-4 h-4" /> 0700 000 000</a>
              <a href="mailto:info@medicare.ke" className="flex items-center gap-2 hover:opacity-100"><Mail className="w-4 h-4" /> info@medicare.ke</a>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Westlands, Nairobi, Kenya</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Mon-Sat: 7AM-9PM | Emergency: 24/7</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Find Us</h3>
            <div className="rounded-lg overflow-hidden mb-4">
              <iframe
                title="MediCare Clinic Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.27145816834!2d36.8028!3d-1.2641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17366e0e4f1d%3A0x5bf0f1b1c738e4c3!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs bg-primary/20 text-primary-foreground">KMPDB Certified</span>
              <span className="px-3 py-1 rounded-full text-xs bg-secondary/20 text-primary-foreground">NHIF Accredited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 flex flex-col sm:flex-row justify-between items-center text-xs opacity-60">
          <p>© 2026 MediCare Clinic. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-destructive fill-destructive" /> in Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  );
}
