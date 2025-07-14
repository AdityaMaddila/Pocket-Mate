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
    startTransition(() => {
      router.push(path);
    });
  };

  return (
    <>
      {/* Loader Overlay with smooth fade */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
          isPending ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Loader2 className="h-10 w-10 text-white animate-spin" />
      </div>

      <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-gradient-to-r from-zinc-900/40 via-zinc-800/30 to-zinc-900/40 border-b border-zinc-600/30 shadow-[0_4px_30px_rgba(0,0,0,0.15)] transition-all duration-300">
        <nav className="max-w mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Pocket-mate logo"
              width={160}
              height={50}
              className="object-contain h-12 w-auto"
            />
          </Link>

          {/* Navigation / Auth Controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            <SignedIn>
              {/* Dashboard Button */}
              <Button
                onClick={() => handleNavigation("/dashboard")}
                className="flex items-center gap-2 text-white text-base px-4 py-2 hover:bg-zinc-700/50 transition-colors duration-200 rounded-md"
              >
                <LayoutDashboard size={20} />
                <span className="hidden md:inline font-medium">Dashboard</span>
              </Button>

              {/* Add Transaction Button */}
              <Button
                onClick={() => handleNavigation("/transaction/create")}
                className="flex items-center gap-2 text-white text-base px-4 py-2 hover:bg-zinc-700/50 transition-colors duration-200 rounded-md"
              >
                <PenBox size={20} />
                <span className="hidden md:inline font-medium">Add Transaction</span>
              </Button>
            </SignedIn>

            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button className="bg-black hover:bg-zinc-700/50 text-white text-base px-5 py-2 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg">
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
