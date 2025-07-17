import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Sparkles } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full z-50 bg-zinc-950/30 backdrop-blur-xl border-b-0">
      {/* Subtle glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-2xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-90 transition-opacity">
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="Pocket Mate" 
                width={32} 
                height={32} 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Pocket Mate
              </span>
              <span className="text-xs text-zinc-400 leading-none hidden sm:block">Smart Finance</span>
            </div>
          </Link>


          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <SignedIn>
              {/* Dashboard Button - Hidden on mobile, shown on tablet+ */}
              <Link href="/dashboard" className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="relative overflow-hidden bg-zinc-900/30 hover:bg-zinc-800/40 border border-zinc-800/30 hover:border-blue-500/30 text-zinc-300 hover:text-white transition-all duration-300 rounded-xl group px-3 sm:px-5 py-2 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <LayoutDashboard className="w-4 h-4 sm:mr-2 relative z-10" />
                  <span className="relative z-10 hidden lg:inline">Dashboard</span>
                </Button>
              </Link>

              {/* Mobile Dashboard Button - Icon only */}
              <Link href="/dashboard" className="sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative overflow-hidden bg-zinc-900/30 hover:bg-zinc-800/40 border border-zinc-800/30 hover:border-blue-500/30 text-zinc-300 hover:text-white transition-all duration-300 rounded-xl group p-2 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <LayoutDashboard className="w-4 h-4 relative z-10" />
                </Button>
              </Link>

              {/* Add Transaction Button - Responsive sizing */}
              <Link href="/transaction/create">
                <Button
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-3 sm:px-6 py-2 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <PenBox className="w-4 h-4 sm:mr-2 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Add Transaction</span>
                  <span className="relative z-10 sm:hidden">Add</span>
                  <Sparkles className="w-3 h-3 ml-1 sm:ml-2 relative z-10 opacity-70" />
                </Button>
              </Link>

              {/* User Button with custom styling */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-lg" />
                <div className="relative bg-zinc-900/30 rounded-full p-1 border border-zinc-800/30">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7 sm:w-8 sm:h-8",
                        userButtonPopoverCard: "bg-zinc-900 border-zinc-800",
                        userButtonPopoverActionButton: "text-zinc-300 hover:text-white hover:bg-zinc-800"
                      }
                    }}
                  />
                </div>
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-4 sm:px-8 py-2 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                    Login
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 opacity-70" />
                  </span>
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </header>
  );
};

export default Header;