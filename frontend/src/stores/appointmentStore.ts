import { create } from "zustand";

export interface Appointment {
  id: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, "id" | "status">) => void;
  cancelAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: JSON.parse(localStorage.getItem("medicare_appointments") || JSON.stringify([
    { id: "demo-1", service: "General & Family Medicine", doctor: "Dr. Amina Wanjiku", date: "2026-04-10", time: "09:00", patientName: "Demo Patient", patientEmail: "patient@medicare.ke", patientPhone: "0712345678", status: "upcoming" },
    { id: "demo-2", service: "Cardiology", doctor: "Dr. James Omondi", date: "2026-03-25", time: "14:00", patientName: "Demo Patient", patientEmail: "patient@medicare.ke", patientPhone: "0712345678", status: "completed", notes: "Blood pressure normal. Continue current medication." },
  ])),
  addAppointment: (appt) => {
    set((state) => {
      const newAppt: Appointment = { ...appt, id: `appt-${Date.now()}`, status: "upcoming" };
      const updated = [...state.appointments, newAppt];
      localStorage.setItem("medicare_appointments", JSON.stringify(updated));
      return { appointments: updated };
    });
  },
  cancelAppointment: (id) => {
    set((state) => {
      const updated = state.appointments.map((a) => a.id === id ? { ...a, status: "cancelled" as const } : a);
      localStorage.setItem("medicare_appointments", JSON.stringify(updated));
      return { appointments: updated };
    });
  },
}));
