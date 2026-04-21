import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Check,
  X,
  Menu,
  ChevronRight,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Activity,
  Bell,
  User,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { BlogPost, blogPosts as initialBlogPosts } from "@/data/blog";
import { Event, events as initialEvents } from "@/data/events";


// Dashboard Stats Component
function DashboardOverview() {
  const stats = [
    { title: "Today's Appointments", value: "24", change: "+2%", icon: CalendarDays, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r from-${stat.color.replace('text-', '')}-50 to-${stat.color.replace('text-', '')}-100`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// NEW Events Management Component - FIXED
function EventsManagement() {
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "",
    image: "",
    isFeatured: false,
  });

  const filteredEvents = eventsList.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      category: "",
      image: "",
      isFeatured: false,
    });
    setEditingEvent(null);
  };

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time || "",
        location: event.location,
        description: event.description,
        category: event.category,
        image: event.image,
        isFeatured: event.isFeatured || false,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEventsList(eventsList.map((e) => (e.id === editingEvent.id ? { ...e, ...formData } : e)));
      toast.success("Event updated successfully!");
    } else {
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        ...formData,
      };
      setEventsList([newEvent, ...eventsList]);
      toast.success("Event created successfully!");
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEventsList(eventsList.filter((e) => e.id !== id));
      toast.success("Event deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-medical border-0 text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Event title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 8:00 AM - 4:00 PM"
                  />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Event location"
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event description"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health Camp">Health Camp</SelectItem>
                      <SelectItem value="Vaccination">Vaccination</SelectItem>
                      <SelectItem value="Awareness">Awareness</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Screening">Screening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
                />
                <Label htmlFor="isFeatured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Featured Event (show badge)
                </Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gradient-medical border-0 text-primary-foreground">
                  {editingEvent ? "Update Event" : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                      {event.isFeatured && (
                        <Badge className="gradient-medical text-xs font-bold">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.date} • {event.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handleOpenDialog(event)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Blog Management Component
function BlogManagement() {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    readTime: "",
    image: "",
  });

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      readTime: "",
      image: "",
    });
    setEditingBlog(null);
  };

  const handleOpenDialog = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        category: blog.category,
        readTime: blog.readTime,
        image: blog.image,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      setBlogs(blogs.map((b) => (b.id === editingBlog.id ? { ...b, ...formData } : b)));
      toast.success("Blog post updated successfully!");
    } else {
      const newBlog: BlogPost = {
        id: `blog-${Date.now()}`,
        ...formData,
        date: new Date().toISOString().split("T")[0],
      };
      setBlogs([newBlog, ...blogs]);
      toast.success("Blog post created successfully!");
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(blogs.filter((b) => b.id !== id));
      toast.success("Blog post deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-medical border-0 text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div>
                <Label>Excerpt</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short description"
                  required
                />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Blog content"
                  rows={6}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Author</Label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Dr. Name"
                    required
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prevention">Prevention</SelectItem>
                      <SelectItem value="Chronic Disease">Chronic Disease</SelectItem>
                      <SelectItem value="Children's Health">Children's Health</SelectItem>
                      <SelectItem value="Mental Health">Mental Health</SelectItem>
                      <SelectItem value="Nutrition">Nutrition</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Read Time</Label>
                  <Input
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="5 min"
                    required
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gradient-medical border-0 text-primary-foreground">
                  {editingBlog ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {blog.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{blog.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-lg">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      By {blog.author} • {new Date(blog.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handleOpenDialog(blog)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(blog.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



// Payment Transcripts Management Component
function PaymentManagement() {
  const [payments, setPayments] = useState<PaymentTranscript[]>(initialPaymentTranscripts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-secondary/20 text-secondary",
      pending: "bg-yellow-500/20 text-yellow-600",
      failed: "bg-destructive/20 text-destructive",
      refunded: "bg-blue-500/20 text-blue-600",
    };
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-muted"}>
        {status}
      </Badge>
    );
  };

  const handleDownloadTranscript = (payment: PaymentTranscript) => {
    const content = `
PAYMENT TRANSCRIPT
==================

Order ID: ${payment.orderId}
Transaction ID: ${payment.transactionId}
Date: ${payment.date}

Customer Details:
- Name: ${payment.patientName}
- Email: ${payment.patientEmail}

Order Items:
${payment.items.map((item) => `- ${item}`).join("\n")}

Payment Details:
- Amount: KES ${payment.amount.toLocaleString()}
- Method: ${payment.paymentMethod}
- Status: ${payment.status.toUpperCase()}

==================
Generated by MediCare Admin System
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${payment.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript downloaded successfully!");
  };

  const handleUpdateStatus = (id: string, newStatus: PaymentTranscript["status"]) => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    toast.success(`Payment status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-secondary">
              KES {totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              KES {pendingAmount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {payments.filter((p) => p.status === "completed").length}
            </p>
            <p className="text-xs text-muted-foreground">Successful</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {payments.filter((p) => p.status === "failed").length}
            </p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Transcripts</CardTitle>
          <CardDescription>Online payment transaction records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.orderId}</p>
                      <p className="text-xs text-muted-foreground">{payment.transactionId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.patientName}</p>
                      <p className="text-xs text-muted-foreground">{payment.patientEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-32">
                      <p className="text-sm truncate">{payment.items.join(", ")}</p>
                      <p className="text-xs text-muted-foreground">{payment.items.length} item(s)</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">KES {payment.amount.toLocaleString()}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadTranscript(payment)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {payment.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(payment.id, "completed")}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(payment.id, "failed")}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Sidebar Component
function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "Events Management", icon: Calendar },
    { id: "blogs", label: "Blog Management", icon: FileText },

  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white z-50 flex flex-col
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">MediCare</h2>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Admin User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || "admin@medicare.com"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 space-y-1">
          <button
            onClick={() => {}}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}

// Main Admin Page Component
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "events":
        return <EventsManagement />;
      case "blogs":
        return <BlogManagement />;

      default:
        return <DashboardOverview />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "events":
        return "Events Management";
      case "blogs":
        return "Blog Management";

      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {getPageTitle()}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {user?.name || "Admin"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

