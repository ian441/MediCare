import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-4xl font-heading font-bold text-muted-foreground mb-4">Blog Post Not Found</h1>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-medical text-primary-foreground py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Link>
          </Button>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>
          <Badge variant="secondary" className="text-sm px-4 py-2 mb-4">
            {post.category}
          </Badge>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Meta Info */}
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6 pb-8 px-0">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://images.unsplash.com/photo-1633336959119-8a68d2b330af?w=150" />
                      <AvatarFallback>
                        {post.author.split(" ")[0][0]}
                        {post.author.split(" ")[1]?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author}</p>
                      <p>{new Date(post.date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <article className="prose prose-headings:font-heading prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-li:marker:text-primary max-w-none">
              <div className="max-w-3xl mx-auto prose-max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} />
              </div>
            </article>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

