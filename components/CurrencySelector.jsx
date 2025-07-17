"use client";

import { useCurrency } from "@/app/context/CurrencyContext";
import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const currencies = [
  { code: "INR", label: "₹ INR" },
  { code: "USD", label: "$ USD" },
  { code: "EUR", label: "€ EUR" },
  { code: "GBP", label: "£ GBP" },
];

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-between w-36 bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 hover:border-zinc-600/80 px-4 py-2 text-sm font-medium text-zinc-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-zinc-700/70 group"
      >
        <span className="group-hover:text-white transition-colors duration-200">
          {currencies.find((c) => c.code === currency)?.label || "Select"}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 text-zinc-400 group-hover:text-zinc-300 transition-colors duration-200" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-36 origin-top-right rounded-xl bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 shadow-xl ring-1 ring-zinc-700/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {currencies.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => {
                  setCurrency(code);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700/50 hover:text-white transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                  currency === code ? "bg-zinc-700/50 text-white" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};