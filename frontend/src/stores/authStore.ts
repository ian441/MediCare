import { create } from "zustand";
import {
  getApiBaseUrl,
  getErrorMessage,
  parseJsonSafe,
  useLocalAuthOnly,
} from "@/lib/api";

export interface User {
  id?: string;
  email: string;
  name: string;
  role: "patient" | "admin";
  /** How this session was established — used for admin stats and token checks */
  authSource?: "api" | "local";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: "patient" | "admin") => void;
  lastAuthError: string | null;
}

const STORAGE_USER = "medicare_user";
const STORAGE_REGISTERED = "medicare_registered_users";
const STORAGE_ACCESS = "medicare_access_token";
const STORAGE_REFRESH = "medicare_refresh_token";

const DEMO_CREDENTIALS = {
  email: "patient@medicare.ke",
  password: "password123",
  name: "Demo Patient",
};

const ADMIN_CREDENTIALS = {
  email: "admin@medicare.com",
  password: "admin123!",
  name: "System Administrator",
};

function mapApiRole(role: string): "patient" | "admin" {
  return role === "ADMIN" ? "admin" : "patient";
}

function splitFullName(full: string): { firstName: string; lastName: string } {
  const t = full.trim();
  if (!t) return { firstName: "User", lastName: "Patient" };
  const i = t.indexOf(" ");
  if (i === -1) return { firstName: t, lastName: "Patient" };
  return {
    firstName: t.slice(0, i),
    lastName: t.slice(i + 1).trim() || "Patient",
  };
}

function persistApiSession(
  user: User,
  token: string,
  refreshToken: string,
) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_ACCESS, token);
  localStorage.setItem(STORAGE_REFRESH, refreshToken);
}

function persistLocalUser(user: User) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  localStorage.removeItem(STORAGE_ACCESS);
  localStorage.removeItem(STORAGE_REFRESH);
}

function clearSession() {
  localStorage.removeItem(STORAGE_USER);
  localStorage.removeItem(STORAGE_ACCESS);
  localStorage.removeItem(STORAGE_REFRESH);
}

function readInitialUser(): User | null {
  const raw = localStorage.getItem(STORAGE_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function isSessionValid(user: User | null): boolean {
  if (!user) return false;
  if (user.authSource === "local") return true;
  return !!localStorage.getItem(STORAGE_ACCESS);
}

function localLogin(
  email: string,
  password: string,
  set: (p: Partial<AuthState>) => void,
): boolean {
  // Check admin credentials
  if (
    email === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const user: User = {
      email,
      name: ADMIN_CREDENTIALS.name,
      role: "admin",
      authSource: "local",
    };
    persistLocalUser(user);
    set({ user, isAuthenticated: true, lastAuthError: null });
    return true;
  }

  // Check demo patient credentials
  if (
    email === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  ) {
    const user: User = {
      email,
      name: DEMO_CREDENTIALS.name,
      role: "patient",
      authSource: "local",
    };
    persistLocalUser(user);
    set({ user, isAuthenticated: true, lastAuthError: null });
    return true;
  }

  // Check registered users
  const users = JSON.parse(
    localStorage.getItem(STORAGE_REGISTERED) || "[]",
  ) as { email: string; password: string; name: string; role?: string }[];
  const found = users.find((u) => u.email === email && u.password === password);
  if (found) {
    const user: User = {
      email: found.email,
      name: found.name,
      role: (found.role as "patient" | "admin") || "patient",
      authSource: "local",
    };
    persistLocalUser(user);
    set({ user, isAuthenticated: true, lastAuthError: null });
    return true;
  }
  return false;
}

function localRegister(
  email: string,
  name: string,
  password: string,
  set: (p: Partial<AuthState>) => void,
): boolean {
  const users = JSON.parse(
    localStorage.getItem(STORAGE_REGISTERED) || "[]",
  ) as { email: string; name: string; password: string }[];
  if (users.find((u) => u.email === email)) return false;
  users.push({ email, name, password });
  localStorage.setItem(STORAGE_REGISTERED, JSON.stringify(users));
  const user: User = { email, name, role: "patient", authSource: "local" };
  persistLocalUser(user);
  set({ user, isAuthenticated: true, lastAuthError: null });
  return true;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialUser = readInitialUser();

  return {
    user: isSessionValid(initialUser) ? initialUser : null,
    isAuthenticated: isSessionValid(initialUser),
    lastAuthError: null,

    login: async (email, password) => {
      set({ lastAuthError: null });
      if (useLocalAuthOnly()) {
        const ok = localLogin(email, password, set);
        if (!ok) set({ lastAuthError: "Invalid credentials." });
        return ok;
      }

      const base = getApiBaseUrl();
      try {
        const res = await fetch(`${base}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const body = await parseJsonSafe(res);
        if (res.ok && body && typeof body === "object" && "data" in body) {
          const data = (body as { data: {
            token: string;
            refreshToken: string;
            user: {
              id: string;
              email: string;
              firstName: string;
              lastName: string;
              role: string;
            };
          } }).data;
          const name =
            `${data.user.firstName} ${data.user.lastName}`.trim();
          const user: User = {
            id: data.user.id,
            email: data.user.email,
            name,
            role: mapApiRole(data.user.role),
            authSource: "api",
          };
          persistApiSession(user, data.token, data.refreshToken);
          set({ user, isAuthenticated: true, lastAuthError: null });
          return true;
        }
        const msg = getErrorMessage(body, "Login failed.");
        set({ lastAuthError: msg });
        return false;
      } catch {
        const ok = localLogin(email, password, set);
        if (!ok) {
          set({
            lastAuthError:
              "Could not reach the API and local credentials did not match.",
          });
        }
        return ok;
      }
    },

    register: async (email, name, password) => {
      set({ lastAuthError: null });
      if (useLocalAuthOnly()) {
        const ok = localRegister(email, name, password, set);
        if (!ok) set({ lastAuthError: "Email already registered." });
        return ok;
      }

      const { firstName, lastName } = splitFullName(name);
      const base = getApiBaseUrl();
      try {
        const res = await fetch(`${base}/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
          }),
        });
        const body = await parseJsonSafe(res);
        if (res.ok && body && typeof body === "object" && "data" in body) {
          const data = (body as { data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            token: string;
            refreshToken: string;
          } }).data;
          const displayName =
            `${data.firstName} ${data.lastName}`.trim();
          const user: User = {
            id: data.id,
            email: data.email,
            name: displayName,
            role: mapApiRole(data.role),
            authSource: "api",
          };
          persistApiSession(user, data.token, data.refreshToken);
          set({ user, isAuthenticated: true, lastAuthError: null });
          return true;
        }
        const msg = getErrorMessage(body, "Registration failed.");
        set({ lastAuthError: msg });
        return false;
      } catch {
        const ok = localRegister(email, name, password, set);
        if (!ok) {
          set({
            lastAuthError:
              "Could not reach the API and local registration failed (email may already exist).",
          });
        }
        return ok;
      }
    },

    logout: () => {
      const base = getApiBaseUrl();
      if (!useLocalAuthOnly() && get().user?.authSource === "api") {
        void fetch(`${base}/api/v1/auth/logout`, { method: "POST" }).catch(
          () => undefined,
        );
      }
      clearSession();
      set({ user: null, isAuthenticated: false, lastAuthError: null });
    },

    switchRole: (role) => {
      const user = get().user;
      if (user) {
        const updated = { ...user, role };
        const access = localStorage.getItem(STORAGE_ACCESS);
        const refresh = localStorage.getItem(STORAGE_REFRESH);
        if (user.authSource === "api" && access && refresh) {
          persistApiSession(updated, access, refresh);
        } else {
          localStorage.setItem(STORAGE_USER, JSON.stringify(updated));
        }
        set({ user: updated });
      }
    },
  };
});
