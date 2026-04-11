import { create } from "zustand";

export interface User {
  email: string;
  name: string;
  role: "patient" | "admin";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, name: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: "patient" | "admin") => void;
}

const DEMO_CREDENTIALS = { email: "patient@medicare.ke", password: "password123", name: "Demo Patient" };

export const useAuthStore = create<AuthState>((set, get) => {
  const stored = localStorage.getItem("medicare_user");
  const initialUser = stored ? JSON.parse(stored) : null;
  
  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    login: (email, password) => {
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        const user: User = { email, name: DEMO_CREDENTIALS.name, role: "patient" };
        localStorage.setItem("medicare_user", JSON.stringify(user));
        set({ user, isAuthenticated: true });
        return true;
      }
      // Check registered users
      const users = JSON.parse(localStorage.getItem("medicare_registered_users") || "[]");
      const found = users.find((u: any) => u.email === email && u.password === password);
      if (found) {
        const user: User = { email: found.email, name: found.name, role: "patient" };
        localStorage.setItem("medicare_user", JSON.stringify(user));
        set({ user, isAuthenticated: true });
        return true;
      }
      return false;
    },
    register: (email, name, password) => {
      const users = JSON.parse(localStorage.getItem("medicare_registered_users") || "[]");
      if (users.find((u: any) => u.email === email)) return false;
      users.push({ email, name, password });
      localStorage.setItem("medicare_registered_users", JSON.stringify(users));
      const user: User = { email, name, role: "patient" };
      localStorage.setItem("medicare_user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return true;
    },
    logout: () => {
      localStorage.removeItem("medicare_user");
      set({ user: null, isAuthenticated: false });
    },
    switchRole: (role) => {
      const user = get().user;
      if (user) {
        const updated = { ...user, role };
        localStorage.setItem("medicare_user", JSON.stringify(updated));
        set({ user: updated });
      }
    },
  };
});
