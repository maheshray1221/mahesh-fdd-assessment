"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function TicketForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(initialForm);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/feedback`,form);

      toast.success(res.data.message);
      setFormState("success");
      setForm(initialForm);
    } catch (err:any) {
      toast.error("Failed submit feedback!");
      setErrorMsg(err.message);
      setFormState("error");
    }
  };

  //  Success State
  if (formState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8 flex flex-col items-center gap-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-bold">Ticket Submitted!</h2>
            <p className="text-muted-foreground text-sm">
              Our AI is triaging your request. You'll hear back soon.
            </p>
            <Button
              variant="outline"
              onClick={() => setFormState("idle")}
              className="mt-2"
            >
              Submit Another
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="mt-2"
            >
              back to home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-1 justify-between">
            <Badge variant="secondary" className="text-xs">
              Support
            </Badge>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="mt-2"
            >
             X
            </Button>
          </div>
          
          <CardTitle className="text-2xl">Submit a Ticket</CardTitle>
          <CardDescription>
            Describe your issue and our AI will triage it instantly.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={formState === "loading"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={formState === "loading"}
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Brief summary of your issue"
                value={form.subject}
                onChange={handleChange}
                required
                disabled={formState === "loading"}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message
                <span className="text-muted-foreground text-xs ml-2">
                  ({form.message.length}/1000)
                </span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Describe your issue in detail..."
                value={form.message}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={5}
                disabled={formState === "loading"}
                className="resize-none"
              />
            </div>

            {/* Error Message */}
            {formState === "error" && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg || "Failed to submit. Please try again."}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={formState === "loading"}
            >
              {formState === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Ticket
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
