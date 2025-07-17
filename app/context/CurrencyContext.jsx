"use client";

import { createContext, useContext, useEffect, useState } from "react";

// ✅ Export this function so it can be used outside this file
export const getCurrencySymbol = (currency) => {
  switch (currency) {
    case "INR":
      return "₹";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return "$";
  }
};

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const res = await fetch("/api/user/currency");
        const data = await res.json();
        if (data.currency) setCurrency(data.currency);
      } catch (error) {
        console.error("Error fetching currency:", error);
      }
    };
    fetchCurrency();
  }, []);

  const updateCurrency = async (newCurrency) => {
    setCurrency(newCurrency);
    try {
      await fetch("/api/user/currency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currency: newCurrency }),
      });
    } catch (error) {
      console.error("Error updating currency:", error);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: updateCurrency,
        symbol: getCurrencySymbol(currency),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
