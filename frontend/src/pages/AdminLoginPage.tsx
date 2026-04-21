import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { Shield, Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, lastAuthError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.role === "admin") {
          toast.success("Welcome to the Admin Dashboard!");
          navigate("/admin");
        } else {
          toast.error("Access denied. Admin credentials required.");
          useAuthStore.getState().logout();
        }
      } else {
        toast.error(lastAuthError || "Invalid credentials");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-slate-800/50 border-slate-700 shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-2 w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-slate-400">
              MediCare Clinic Management System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@medicare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-medical border-0 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In to Dashboard
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-xs text-slate-500 text-center">
              <p>Default credentials: admin@medicare.com / admin123!</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Lock className="w-3 h-3" />
              <span>Secured with enterprise-grade encryption</span>
            </div>
          </CardFooter>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-500 text-sm mt-6"
        >
          © 2026 MediCare Clinic. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}