export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  category: string;
  image: string;
  isFeatured?: boolean;
}

export const events: Event[] = [
  {
    id: "health-camp-2026",
    title: "Free Community Health Camp",
    date: "2026-05-15",
    time: "8:00 AM - 4:00 PM",
    location: "MediCare Clinic, Westlands",
    description: "Join us for free medical check-ups, consultations, vaccinations, health screenings, and workshops on diabetes management and maternal health. NHIF accepted.",
    category: "Health Camp",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG-kOW2T6-oBZPFewaHfjsXWsF9QCfsbYcSg&s",
    isFeatured: true,
  },
  {
    id: "vaccination-drive",
    title: "Childhood Vaccination Drive",
    date: "2026-04-25",
    time: "9:00 AM - 1:00 PM",
    location: "MediCare Clinic, Westlands",
    description: "KEPI vaccination day for children under 5. All vaccines available including MMR, DPT, Polio, and Pneumococcal. Free counseling for parents.",
    category: "Vaccination",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkKEqlafVZ8kxVBXwejOKGKczPqERkA5Ss-w&s",
    isFeatured: true,
  },
  {
    id: "diabetes-awareness",
    title: "World Diabetes Day Seminar",
    date: "2026-05-20",
    time: "2:00 PM - 5:00 PM",
    location: "MediCare Conference Hall",
    description: "Educational seminar with Dr. James Omondi featuring latest diabetes management techniques, local diet tips, free blood sugar testing, and NHIF consultation.",
    category: "Awareness",
    image: "https://www.fjmu.edu.pk/wp-content/uploads/2022/11/314500485_552694450195776_2914979494966300772_n-1200x600.jpg",
  },
  {
    id: "maternal-health-workshop",
    title: "Safe Motherhood Workshop",
    date: "2026-06-08",
    time: "10:00 AM - 12:00 PM",
    location: "MediCare Clinic, Westlands",
    description: "Interactive session on antenatal care, safe delivery, newborn care, and postnatal health. Free ultrasound screening for first 20 attendees.",
    category: "Maternal Health",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
  },
  {
    id: "cancer-screening",
    title: "Free Cancer Screening Camp",
    date: "2026-05-30",
    time: "7:00 AM - 3:00 PM",
    location: "MediCare Clinic Parking Lot",
    description: "Breast, cervical, and prostate cancer screening using latest technology. Consultations with oncologist specialists. Sponsored by NHIF.",
    category: "Screening",
    image: "https://healthsciences.uonbi.ac.ke/sites/default/files/2019-12/74906722_3200683453338537_3187474047030001664_o.jpg",
  },
];

