"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 tracking-tight"
        >
          TicketAI
        </Link>

        {/* Right - Support Button */}
        <Link href="/submit-ticket">
          <Button
            variant="outline"
            className="rounded-full border border-gray-900 text-gray-900 bg-transparent hover:bg-gray-900 hover:text-white transition-all duration-200 px-5 text-sm font-medium"
          >
            Get Support
          </Button>
        </Link>
      </nav>

      {/* HERO */}
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        <div className="bg-[#e8e5e0] rounded-3xl px-10 py-14 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          {/* LEFT CONTENT */}
          <div className="flex-1 max-w-lg z-10">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gray-800 rounded-full p-1.5">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  4M+ User
                </p>
                <p className="text-xs text-gray-500">Our success Stories</p>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              AI Support
            </h1>

            {/* Divider */}
            <div className="w-full h-px bg-gray-400 mb-6" />

            {/* Subheading */}
            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-sm">
              All-in-one AI that takes notes, searches apps, and builds
              workflows, right where you work.
            </p>

            {/* Social Proof */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-full bg-gray-400 overflow-hidden flex items-center justify-center">
                <span className="text-white text-xs font-medium">JD</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  95% users are satisfied
                </span>
              </div>
              <div className="w-px h-6 bg-gray-400 mx-1" />
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">4.9</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/submit-ticket">
                <Button className="rounded-full bg-gray-900 text-white hover:bg-gray-700 px-6 py-2.5 text-sm font-medium">
                  Get Help, Fast.
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT - Image Placeholder */}
          <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-[380px]">
            <Image
              src="/undraw_peekaboo_5o8i.svg"
              alt="hero"
              width={500}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
