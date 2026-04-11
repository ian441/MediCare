import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, ShoppingCart, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Doctors", href: "/doctors" },
  { label: "Appointments", href: "/appointments" },
  { label: "Telemedicine", href: "/telemedicine" },
  { label: "Pharmacy", href: "/pharmacy" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((s) => s.itemCount());
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      {/* Top bar */}
      <div className="gradient-medical text-primary-foreground text-sm py-1.5 hidden md:block">
        <div className="container flex justify-between items-center">
          <span>🏥 Karibu MediCare Clinic — Your Health, Our Priority</span>
          <div className="flex items-center gap-4">
            <a href="tel:+254700000000" className="flex items-center gap-1 hover:underline">
              <Phone className="w-3 h-3" /> Emergency: 0700 000 000
            </a>
            <span>📍 Westlands, Nairobi</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-md" : "bg-background"}`}>
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-medical flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-lg">M</span>
            </div>
            <span className="font-heading font-bold text-xl">
              <span className="gradient-medical-text">MediCare</span>
              <span className="text-foreground"> Clinic</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.href
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-md hover:bg-muted transition-colors" aria-label="Toggle theme">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/pharmacy" className="relative p-2 rounded-md hover:bg-muted transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link to={isAuthenticated ? "/portal" : "/portal"}>
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                <User className="w-4 h-4" />
                {isAuthenticated ? user?.name?.split(" ")[0] : "Patient Portal"}
              </Button>
            </Link>

            <Link to="/appointments">
              <Button size="sm" className="hidden sm:flex gradient-medical border-0 text-primary-foreground hover:opacity-90">
                Book Now
              </Button>
            </Link>

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-md hover:bg-muted" aria-label="Menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t bg-background"
            >
              <nav className="container py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/appointments">
                  <Button className="w-full mt-2 gradient-medical border-0 text-primary-foreground">Book Appointment</Button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
