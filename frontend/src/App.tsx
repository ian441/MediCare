import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import DoctorsPage from "@/pages/DoctorsPage";
import AppointmentsPage from "@/pages/AppointmentsPage";
import PatientPortal from "@/pages/PatientPortal";
import TelemedicinePage from "@/pages/TelemedicinePage";
import BlogPage from "@/pages/BlogPage";
import PharmacyPage from "@/pages/PharmacyPage";
import ContactPage from "@/pages/ContactPage";
import SymptomChecker from "@/pages/SymptomChecker";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/patient-portal" element={<PatientPortal />} />
            <Route path="/telemedicine" element={<TelemedicinePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/pharmacy" element={<PharmacyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}
