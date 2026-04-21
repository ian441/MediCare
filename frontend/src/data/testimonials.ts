export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  service: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Mary Wambui", text: "MediCare Clinic saved my life during an emergency. The doctors were so fast and professional. I'm forever grateful!", rating: 5, service: "Emergency Care", avatar: "MW" },
  { id: "t3", name: "Sarah Atieno", text: "Dr. Achieng guided me through my entire pregnancy. I felt so safe and cared for. My baby was delivered healthy and happy!", rating: 5, service: "Maternal Health", avatar: "SA" },
  { id: "t4", name: "David Kimani", text: "The executive health check-up was thorough and well-organized. Found an issue early that could have been serious. Thank you!", rating: 5, service: "Health Check-ups", avatar: "DK" },
  { id: "t5", name: "Lucy Njoroge", text: "My son loves Dr. Njeri! She makes every visit fun and stress-free. The pediatric care here is world-class.", rating: 5, service: "Pediatrics", avatar: "LN" },
  { id: "t6", name: "Hassan Ali", text: "After my knee surgery, the physiotherapy team had me walking again in weeks. Outstanding rehabilitation program!", rating: 4, service: "Physiotherapy", avatar: "HA" },
];
