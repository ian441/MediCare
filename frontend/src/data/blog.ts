export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "malaria-prevention",
    title: "Malaria Prevention: Protecting Your Family in Kenya",
    excerpt: "Learn practical tips to protect your family from malaria during the rainy season.",
    content: "Malaria remains one of the most common health threats in Kenya. Here are evidence-based strategies to protect your family...",
    author: "Dr. Amina Wanjiku",
    date: "2026-03-28",
    category: "Prevention",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=400&fit=crop",
  },
  {
    id: "diabetes-management",
    title: "Living Well with Diabetes: A Kenyan Guide",
    excerpt: "Managing diabetes with local foods and lifestyle changes that work for you.",
    content: "Diabetes management doesn't have to mean giving up your favorite Kenyan dishes...",
    author: "Dr. James Omondi",
    date: "2026-03-20",
    category: "Chronic Disease",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  },
  {
    id: "child-vaccinations",
    title: "KEPI Vaccination Schedule: What Every Parent Should Know",
    excerpt: "A complete guide to Kenya's childhood immunization program.",
    content: "The Kenya Expanded Programme on Immunization (KEPI) ensures every child is protected...",
    author: "Dr. Grace Njeri",
    date: "2026-03-15",
    category: "Children's Health",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1632053002928-1919605ee6f7?w=600&h=400&fit=crop",
  },
  {
    id: "mental-health-stigma",
    title: "Breaking the Mental Health Stigma in Kenya",
    excerpt: "It's okay not to be okay. Understanding mental health in our communities.",
    content: "Mental health is just as important as physical health. In Kenya, we are making strides in destigmatizing mental illness...",
    author: "Dr. Daniel Kiprop",
    date: "2026-03-10",
    category: "Mental Health",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&h=400&fit=crop",
  },
];
