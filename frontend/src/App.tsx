import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import DoctorsPage from "@/pages/DoctorsPage";
import AppointmentsPage from "@/pages/AppointmentsPage";
import AdminPage from "@/pages/AdminPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import EventsPage from "@/pages/EventsPage";
import ContactPage from "@/pages/ContactPage";
import SymptomChecker from "@/pages/SymptomChecker";
import NotFound from "@/pages/NotFound";
import { useAuthStore } from "@/stores/authStore";

// Protected Admin Route Component
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

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
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/blog" element={<BlogPage />} >
              <Route path=":id/read-more" element={<BlogDetailPage />} />
            </Route>
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

