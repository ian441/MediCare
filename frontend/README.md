# 🏥 MediCare Clinic

A modern, fully functional multi-page health clinic website for a premium multi-specialty clinic based in **Nairobi, Kenya**.

Built with **React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + Zustand**.

![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

### 🩺 Core Pages
- **Home** — Hero CTA, live stats, testimonials carousel, services grid, doctor spotlight
- **About Us** — Clinic history, mission, values, and team
- **Services** — 14+ medical services with descriptions, pricing (KSh), and booking
- **Our Doctors** — Profiles with specialties, availability, and direct booking
- **Appointments** — Multi-step booking system (Service → Doctor → Date/Time → Details → Confirm)
- **Patient Portal** — Login-protected dashboard with vitals, records, prescriptions
- **Telemedicine** — Simulated video consultation room with camera/mic toggles and chat
- **Pharmacy** — E-pharmacy with search, cart, checkout, and delivery tracking
- **Blog / Health Resources** — Health articles and tips
- **Contact & Emergency** — Contact form, Google Maps embed, emergency hotline

### 🔧 Functional Features
- **Symptom Checker** — Multi-step questionnaire recommending conditions and doctors
- **Patient Portal** with demo login (`patient@medicare.ke` / `password123`)
- **Pharmacy Cart** — Add medicines, adjust quantities, checkout with delivery
- **Live Chat Widget** — Floating chat with pre-written responses
- **Emergency Button** — Floating SOS button with one-click call simulation
- **Admin Panel** — Role switcher to view admin statistics
- **Dark Mode** — Toggle between light and dark themes

### 🇰🇪 Kenyan Context
- Currency in **KSh** (Kenyan Shillings)
- Local phone numbers and Nairobi addresses
- Swahili greetings throughout the UI

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| TypeScript 5 | Type safety |
| Tailwind CSS 3 | Styling |
| shadcn/ui | Component library |
| Zustand | State management |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Router 6 | Client-side routing |
| React Hook Form + Zod | Form validation |
| localStorage | Data persistence (mock backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:8080**.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/          # Shared components
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.tsx        # Responsive navigation
│   ├── Footer.tsx        # Site footer
│   ├── LiveChat.tsx      # Floating chat widget
│   └── EmergencyButton.tsx # SOS button
├── data/                # Mock data
│   ├── doctors.ts
│   ├── services.ts
│   ├── medicines.ts
│   ├── blog.ts
│   └── testimonials.ts
├── pages/               # Route pages
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── ServicesPage.tsx
│   ├── DoctorsPage.tsx
│   ├── AppointmentsPage.tsx
│   ├── PatientPortal.tsx
│   ├── TelemedicinePage.tsx
│   ├── PharmacyPage.tsx
│   ├── BlogPage.tsx
│   ├── ContactPage.tsx
│   └── SymptomChecker.tsx
├── stores/              # Zustand state management
│   ├── authStore.ts
│   ├── appointmentStore.ts
│   └── cartStore.ts
├── App.tsx              # Root component & routing
├── index.css            # Global styles & design tokens
└── main.tsx             # Entry point
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Patient | `patient@medicare.ke` | `password123` |

You can also register a new account from the Patient Portal.

---

## 📄 License

MIT
