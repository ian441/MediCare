import { Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function EmergencyButton() {
  return (
    <motion.a
      href="tel:+254700000000"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-3 rounded-full shadow-lg animate-pulse-emergency font-heading font-bold text-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Call Emergency"
    >
      <Phone className="w-5 h-5" />
      <span className="hidden sm:inline">Emergency: 0700 000 000</span>
      <span className="sm:hidden">SOS</span>
    </motion.a>
  );
}
