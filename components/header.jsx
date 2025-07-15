"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenBox, Loader2 } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (path) => {
    startTransition(() => router.push(path));
  };

  return (
    <>
      {/* Loader Overlay */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isPending ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Loader2 className="h-10 w-10 text-white animate-spin" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-zinc-700/30 backdrop-blur-md bg-gradient-to-r from-zinc-900/60 via-zinc-800/40 to-zinc-900/60 shadow-lg">
        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="Pocket Mate Logo"
              width={40}
              height={40}
              className="object-contain h-10 w-10"
            />
            <span className="text-xl font-semibold text-white tracking-wide">
              Pocket Mate
            </span>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            <SignedIn>
              <Button
                onClick={() => handleNavigation("/dashboard")}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-zinc-700/50 transition-colors duration-200 border border-zinc-700/40 backdrop-blur-sm"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden md:inline font-medium">Dashboard</span>
              </Button>

              <Button
                onClick={() => handleNavigation("/transaction/create")}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-zinc-700/50 transition-colors duration-200 border border-zinc-700/40 backdrop-blur-sm"
              >
                <PenBox className="w-5 h-5" />
                <span className="hidden md:inline font-medium">Add Transaction</span>
              </Button>
            </SignedIn>

            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button className="bg-black hover:bg-zinc-700/50 text-white px-5 py-2 rounded-lg transition-colors border border-zinc-700/40 shadow-md hover:shadow-lg">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-11 h-11 rounded-full border border-zinc-600 shadow-inner hover:shadow-md transition-shadow duration-200",
                  },
                }}
              />
            </SignedIn>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
