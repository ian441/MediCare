import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/data/blog";
import { BookOpen, Clock, User } from "lucide-react";

export default function BlogPage() {
  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-20">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <BookOpen className="inline w-10 h-10 mr-2" /> Health Resources
          </motion.h1>
          <p className="text-lg opacity-80">Stay informed with the latest health tips and medical insights</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-4xl space-y-8">
          {blogPosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className="grid md:grid-cols-3">
                  <img src={post.image} alt={post.title} className="w-full h-48 md:h-full object-cover" />
                  <CardContent className="md:col-span-2 p-6">
                    <span className="text-xs font-semibold text-primary bg-accent px-3 py-1 rounded-full">{post.category}</span>
                    <h2 className="font-heading font-bold text-xl mt-3 mb-2">{post.title}</h2>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <p className="text-sm text-muted-foreground mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span>
                      <span>{new Date(post.date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
