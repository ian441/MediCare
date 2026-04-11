import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/authStore";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { toast } from "sonner";
import { Calendar, FileText, Pill, Activity, LogOut, Shield, User } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Welcome back! 🎉");
    } else {
      toast.error("Invalid credentials. Try patient@medicare.ke / password123");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patient@medicare.ke" /></div>
      <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" /></div>
      <Button type="submit" className="w-full gradient-medical border-0 text-primary-foreground">Sign In</Button>
      <p className="text-xs text-center text-muted-foreground">Demo: patient@medicare.ke / password123</p>
    </form>
  );
}

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useAuthStore((s) => s.register);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(email, name, password)) {
      toast.success("Account created successfully! 🎉");
    } else {
      toast.error("Email already registered.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
      <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
      <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" /></div>
      <Button type="submit" className="w-full gradient-medical border-0 text-primary-foreground">Create Account</Button>
    </form>
  );
}

function Dashboard() {
  const { user, logout, switchRole } = useAuthStore();
  const { appointments, cancelAppointment } = useAppointmentStore();
  const navigate = useNavigate();

  const vitals = [
    { label: "Blood Pressure", value: "120/80 mmHg", status: "Normal" },
    { label: "Heart Rate", value: "72 bpm", status: "Normal" },
    { label: "Blood Sugar", value: "95 mg/dL", status: "Normal" },
    { label: "BMI", value: "24.1", status: "Healthy" },
  ];

  const labResults = [
    { test: "Complete Blood Count", date: "2026-03-20", status: "Normal", file: "cbc_report.pdf" },
    { test: "Lipid Panel", date: "2026-03-15", status: "Borderline", file: "lipid_report.pdf" },
    { test: "Liver Function Test", date: "2026-02-28", status: "Normal", file: "lft_report.pdf" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl">Habari, {user?.name}! 👋</h1>
          <p className="text-muted-foreground">Welcome to your Patient Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => switchRole(user?.role === "admin" ? "patient" : "admin")}>
            <Shield className="w-4 h-4 mr-1" />
            {user?.role === "admin" ? "Switch to Patient" : "Switch to Admin"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => { logout(); toast.info("Logged out"); }}>
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </div>

      {user?.role === "admin" && (
        <Card className="border-secondary">
          <CardContent className="p-6">
            <h2 className="font-heading font-bold text-lg mb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-secondary" /> Admin Panel</h2>
            <p className="text-sm text-muted-foreground mb-4">You are viewing as admin. Total appointments: {appointments.length}. Total registered users: {JSON.parse(localStorage.getItem("medicare_registered_users") || "[]").length + 1}.</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-accent rounded-lg"><p className="font-bold text-2xl text-primary">{appointments.filter(a => a.status === "upcoming").length}</p><p className="text-xs text-muted-foreground">Upcoming</p></div>
              <div className="p-4 bg-accent rounded-lg"><p className="font-bold text-2xl text-secondary">{appointments.filter(a => a.status === "completed").length}</p><p className="text-xs text-muted-foreground">Completed</p></div>
              <div className="p-4 bg-accent rounded-lg"><p className="font-bold text-2xl text-destructive">{appointments.filter(a => a.status === "cancelled").length}</p><p className="text-xs text-muted-foreground">Cancelled</p></div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="appointments">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="appointments"><Calendar className="w-4 h-4 mr-1 hidden sm:inline" /> Appointments</TabsTrigger>
          <TabsTrigger value="records"><FileText className="w-4 h-4 mr-1 hidden sm:inline" /> Records</TabsTrigger>
          <TabsTrigger value="vitals"><Activity className="w-4 h-4 mr-1 hidden sm:inline" /> Vitals</TabsTrigger>
          <TabsTrigger value="prescriptions"><Pill className="w-4 h-4 mr-1 hidden sm:inline" /> Rx</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-lg">Your Appointments</h2>
            <Button size="sm" className="gradient-medical border-0 text-primary-foreground" onClick={() => navigate("/appointments")}>Book New</Button>
          </div>
          {appointments.map((appt) => (
            <Card key={appt.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="font-semibold">{appt.service}</p>
                  <p className="text-sm text-muted-foreground">{appt.doctor} • {appt.date} at {appt.time}</p>
                  {appt.notes && <p className="text-xs text-muted-foreground mt-1">Note: {appt.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appt.status === "upcoming" ? "bg-accent text-primary" :
                    appt.status === "completed" ? "bg-secondary/20 text-secondary" :
                    "bg-destructive/20 text-destructive"
                  }`}>{appt.status}</span>
                  {appt.status === "upcoming" && (
                    <Button size="sm" variant="destructive" onClick={() => { cancelAppointment(appt.id); toast.info("Appointment cancelled"); }}>Cancel</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="records" className="mt-6 space-y-4">
          <h2 className="font-heading font-bold text-lg">Lab Results & Records</h2>
          {labResults.map((lab) => (
            <Card key={lab.test}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{lab.test}</p>
                  <p className="text-sm text-muted-foreground">{lab.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${lab.status === "Normal" ? "text-secondary" : "text-yellow-600"}`}>{lab.status}</span>
                  <Button size="sm" variant="outline" onClick={() => toast.info("PDF download simulated for: " + lab.file)}>Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="vitals" className="mt-6">
          <h2 className="font-heading font-bold text-lg mb-4">Health Vitals</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {vitals.map((v) => (
              <Card key={v.label}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">{v.label}</p>
                  <p className="text-2xl font-heading font-bold text-primary mt-1">{v.value}</p>
                  <p className="text-xs text-secondary font-semibold">{v.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6 space-y-4">
          <h2 className="font-heading font-bold text-lg">Active Prescriptions</h2>
          <Card>
            <CardContent className="p-4">
              <p className="font-semibold">Metformin 500mg</p>
              <p className="text-sm text-muted-foreground">Twice daily with meals • Dr. Omondi • Expires: June 2026</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.success("Refill request submitted!")}>Request Refill</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="font-semibold">Amlodipine 5mg</p>
              <p className="text-sm text-muted-foreground">Once daily in the morning • Dr. Omondi • Expires: May 2026</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.success("Refill request submitted!")}>Request Refill</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function PatientPortal() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-16">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <User className="inline w-10 h-10 mr-2" /> Patient Portal
          </motion.h1>
        </div>
      </section>
      <section className="py-12">
        <div className="container max-w-4xl">
          {isAuthenticated ? (
            <Dashboard />
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="mt-6"><LoginForm /></TabsContent>
                  <TabsContent value="register" className="mt-6"><RegisterForm /></TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
