"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Bot } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ← sirf yeh add hua

type Mode = "signin" | "signup";

interface FormData {
  name: string;
  email: string;
  password: string;
  remember: boolean;
}

const initial: FormData = {
  name: "",
  email: "",
  password: "",
  remember: false,
};

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth(); // ← sirf yeh add hua

  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState<FormData>(initial);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setForm(initial);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Signup — direct axios (AuthContext mein sirf login hai)
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/register`,
          { name: form.name, email: form.email, password: form.password },
          { withCredentials: true }
        );
        toast.success("Account has been created. Please log in", {
          position: "top-left",
        });
        switchMode("signin");
      } else {
        // Signin — AuthContext ka login use karo (cookie set + user state update)
        await login(form.email, form.password);
        toast.success("Login Successful", { position: "top-left" });
        router.replace("/admin/dashbord");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Something went wrong. Please try again.";
      setError(message);
      toast.error(message, { position: "top-left" });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen w-full flex">
      {/* RIGHT PANEL - full width on mobile */}
      <div className="w-full flex items-center justify-center bg-white p-6 sm:p-10">
        <div className="w-full max-w-sm border border-gray-500 px-10 py-10 rounded-2xl shadow-lg hover:scale-103 transition-transform duration-300">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#c8f135] rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-900" />
            </div>
            <span className="font-bold text-gray-900">AI Chatbot</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {mode === "signin" ? "Welcome Back!" : "Create Account"}
            </h1>
            <p className="text-sm text-gray-400">
              {mode === "signin"
                ? "Sign in to access your admin dashboard."
                : "Register to manage support tickets."}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  mode === m
                    ? "bg-[#c8f135] text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name - signup only */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@mail.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me - signin only */}
            {mode === "signin" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={form.remember}
                    onCheckedChange={(v) =>
                      setForm((prev) => ({ ...prev, remember: v as boolean }))
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">
                    Remember me
                  </Label>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}