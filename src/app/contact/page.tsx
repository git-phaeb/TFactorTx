"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<null | { type: "success" | "error"; text: string }>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!firstName || !lastName || !email || !message) {
      setStatus({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message");
      }
      setStatus({ type: "success", text: "Message sent successfully." });
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setStatus({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tighter">Contact Us</h1>
          <p className="text-muted-foreground mt-2">We usually reply within 1-2 business days.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">First name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Last name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className="w-full min-h-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {status && (
            <div className={`${status.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"} border rounded-md px-3 py-2 text-sm`}>
              {status.text}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting} className="h-10 !h-10">
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">Back to home</Link>
          </div>
        </form>
      </div>
    </div>
  );
}


