import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { services } from "@/data/services";
import { doctors } from "@/data/doctors";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

const steps = ["Service", "Doctor", "Date & Time", "Your Details", "Confirm"];

export default function AppointmentsPage() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addAppointment = useAppointmentStore((s) => s.addAppointment);
  const navigate = useNavigate();

  const filteredDoctors = selectedService
    ? doctors.filter((d) => {
        const svc = services.find((s) => s.id === selectedService);
        return svc && (d.specialty === svc.name || d.specialty.includes(svc.name.split(" ")[0]) || svc.category === "Primary Care");
      })
    : doctors;

  const displayDoctors = filteredDoctors.length > 0 ? filteredDoctors : doctors;

  const canNext = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedDoctor;
    if (step === 2) return !!date && !!time;
    if (step === 3) return !!name && !!email && !!phone;
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const svc = services.find((s) => s.id === selectedService);
      const doc = doctors.find((d) => d.id === selectedDoctor);
      const appointmentData = {
        service: svc?.name || "",
        doctor: doc?.name || "",
        date: date ? format(date, "yyyy-MM-dd") : "",
        time,
        patientName: name,
        patientEmail: email,
        patientPhone: phone,
        notes,
        timestamp: new Date().toISOString(),
      };

      const webhookUrl = import.VITE_MAKE_WEBHOOK_URL as string;
      if (!webhookUrl) {
        throw new Error("Webhook URL not configured");
      }
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      addAppointment({
        service: appointmentData.service,
        doctor: appointmentData.doctor,
        date: appointmentData.date,
        time: appointmentData.time,
        patientName: name,
        patientEmail: email,
        patientPhone: phone,
        notes,
      });
      toast.success("Appointment booked successfully! 🎉", { description: "Confirmation sent to your email & SMS." });
      navigate("/portal");
    } catch (error) {
      toast.error("Booking failed. Please try again or contact us directly.", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-20">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Book an Appointment
          </motion.h1>
          <p className="text-lg opacity-80">Quick, easy, and secure online booking</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-3xl">
          {/* Progress */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < step ? "gradient-medical text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`ml-2 text-sm hidden sm:inline ${i === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <Card>
            <CardContent className="p-6 sm:p-8">
              {/* Step 0: Service */}
              {step === 0 && (
                <div>
                  <h2 className="font-heading font-bold text-xl mb-4">Select a Service</h2>
                  <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {services.map((svc) => (
                      <button
                        key={svc.id}
                        onClick={() => setSelectedService(svc.id)}
                        className={`text-left p-4 rounded-lg border-2 transition-all ${
                          selectedService === svc.id ? "border-primary bg-accent" : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <svc.icon className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <p className="font-medium text-sm">{svc.name}</p>
                            <p className="text-xs text-muted-foreground">{svc.priceRange}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Doctor */}
              {step === 1 && (
                <div>
                  <h2 className="font-heading font-bold text-xl mb-4">Choose a Doctor</h2>
                  <div className="grid gap-3">
                    {displayDoctors.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc.id)}
                        className={`text-left p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                          selectedDoctor === doc.id ? "border-primary bg-accent" : "border-border hover:border-primary/30"
                        }`}
                      >
                        <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.specialty} • KSh {doc.fee.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div>
                  <h2 className="font-heading font-bold text-xl mb-4">Pick Date & Time</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-2 block">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left", !date && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(d) => d < new Date() || d.getDay() === 0}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="mb-2 block">Time</Label>
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`px-3 py-2 rounded-md text-sm border transition-all ${
                              time === t ? "border-primary bg-accent font-semibold" : "border-border hover:border-primary/30"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {step === 3 && (
                <div>
                  <h2 className="font-heading font-bold text-xl mb-4">Your Details</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mary Wambui" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. mary@email.com" />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0712 345 678" />
                    </div>
                    <div>
                      <Label>Notes (optional)</Label>
                      <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional information..." />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <div>
                  <h2 className="font-heading font-bold text-xl mb-4">Confirm Booking</h2>
                  <div className="space-y-3 bg-muted p-6 rounded-lg">
                    <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{services.find(s => s.id === selectedService)?.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{doctors.find(d => d.id === selectedDoctor)?.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{date ? format(date, "PPP") : ""}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{time}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium">{name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="font-medium">{phone}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{email}</span></div>
                    <hr className="border-border" />
                    <div className="flex justify-between font-bold"><span>Estimated Fee</span><span className="text-primary">KSh {doctors.find(d => d.id === selectedDoctor)?.fee.toLocaleString()}</span></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Payment will be collected at the clinic. M-Pesa and card accepted.</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                {step < 4 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="gradient-medical border-0 text-primary-foreground">
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="gradient-medical border-0 text-primary-foreground">
                    {isSubmitting ? "Sending..." : "Confirm Booking"} <Check className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
