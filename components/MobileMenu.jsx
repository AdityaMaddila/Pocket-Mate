"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Sparkles, Menu, X } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden relative">
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative overflow-hidden bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800/40 hover:border-blue-500/40 text-zinc-300 hover:text-white transition-all duration-300 rounded-xl group p-2.5 cursor-pointer backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl" />
        {isOpen ? (
          <X className="w-4 h-4 relative z-10 transition-transform duration-200 rotate-90" />
        ) : (
          <Menu className="w-4 h-4 relative z-10 transition-transform duration-200" />
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-56 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-3xl" />
          
          {/* Top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
          
          <div className="py-3 relative">
            <SignedIn>
              {/* Dashboard Link */}
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 px-4 py-3.5 text-zinc-300 hover:text-white hover:bg-zinc-800/40 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-zinc-900/40 rounded-xl p-2 border border-zinc-800/30 group-hover:border-blue-500/30 transition-colors">
                  <LayoutDashboard className="w-4 h-4 relative z-10" />
                </div>
                <span className="font-medium relative z-10">Dashboard</span>
              </Link>

              {/* Add Transaction Link */}
              <Link 
                href="/transaction/create" 
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 px-4 py-3.5 text-zinc-300 hover:text-white hover:bg-zinc-800/40 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-2 border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                  <PenBox className="w-4 h-4 relative z-10" />
                </div>
                <span className="font-medium relative z-10">Add Transaction</span>
                <Sparkles className="w-3 h-3 ml-auto opacity-70 relative z-10 text-blue-400" />
              </Link>

              {/* Separator */}
              <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />

              {/* User Profile Section */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-md" />
                    <div className="relative bg-zinc-900/50 rounded-full p-1.5 border border-zinc-800/40">
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-6 h-6",
                            userButtonPopoverCard: "bg-zinc-900 border-zinc-800",
                            userButtonPopoverActionButton: "text-zinc-300 hover:text-white hover:bg-zinc-800"
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-300 text-sm font-medium">Account</span>
                    <span className="text-zinc-500 text-xs">Manage profile</span>
                  </div>
                </div>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="px-4 py-3">
                <SignInButton mode="modal">
                  <Button
                    className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-4 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span className="font-semibold">Get Started</span>
                      <Sparkles className="w-3 h-3 opacity-70" />
                    </span>
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>
          
          {/* Bottom border glow */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MobileMenu;