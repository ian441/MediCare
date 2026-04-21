import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Tag, Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { events, type Event } from "@/data/events";
import { format, isPast, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");

  const upcomingEvents = events.filter((event) => {
    const eventDate = parseISO(event.date);
    return !isPast(eventDate);
  });

  const pastEvents = events.filter((event) => {
    const eventDate = parseISO(event.date);
    return isPast(eventDate);
  });

  const activeEvents = selectedTab === "upcoming" ? upcomingEvents : pastEvents;

  const filteredEvents = activeEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(events.map((e) => e.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent"
          >
            Hospital Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-center max-w-3xl mx-auto mb-12 opacity-90"
          >
            Stay updated with our upcoming health camps, workshops, vaccination drives, and community outreach programs
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/appointments">
              <Button size="lg" className="text-lg px-8 gradient-medical border-0 hover:opacity-90">
                Register for Event
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 border-white/50 bg-white/10 backdrop-blur-sm">
              Download Calendar
            </Button>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-black/10" />
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search events by name, location or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-0 w-full lg:w-auto">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
              <TabsTrigger value="upcoming" className="data-[state=active]:gradient-medical data-[state=active]:text-primary-foreground">
                Upcoming ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                Past ({pastEvents.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-24">
            <Calendar className="w-24 h-24 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-muted-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Try adjusting your search or check back later for new events
            </p>
            <Link to="/">
              <Button className="gradient-medical border-0">
                Back to Home
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {event.isFeatured && (
                      <Badge className="absolute top-4 left-4 gradient-medical text-xs font-bold uppercase tracking-wider">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                    </div>
                    <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{format(parseISO(event.date), "MMM dd, yyyy")}</span>
                        {event.time && (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">{event.description}</p>

                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

