export const defaultCategories = [
  // Income Categories
  {
    id: "salary",
    name: "Salary",
    type: "INCOME",
    color: "#22c55e", // green-500
    icon: "Wallet",
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "INCOME",
    color: "#06b6d4", // cyan-500
    icon: "Laptop",
  },
  {
    id: "investments",
    name: "Investments",
    type: "INCOME",
    color: "#6366f1", // indigo-500
    icon: "TrendingUp",
  },
  {
    id: "business",
    name: "Business",
    type: "INCOME",
    color: "#ec4899", // pink-500
    icon: "Building",
  },
  {
    id: "rental",
    name: "Rental",
    type: "INCOME",
    color: "#f59e0b", // amber-500
    icon: "Home",
  },
  {
    id: "other-income",
    name: "Other Income",
    type: "INCOME",
    color: "#64748b", // slate-500
    icon: "Plus",
  },
  {
    id: "royalties",
    name: "Royalties",
    type: "INCOME",
    color: "#10b981", // emerald-500
    icon: "Gem",
  },
  {
    id: "dividends",
    name: "Dividends",
    type: "INCOME",
    color: "#0ea5e9", // sky-500
    icon: "DollarSign",
  },
  {
    id: "grants",
    name: "Grants",
    type: "INCOME",
    color: "#c084fc", // purple-400
    icon: "BookOpen",
  },
  {
    id: "refunds",
    name: "Refunds",
    type: "INCOME",
    color: "#facc15", // yellow-400
    icon: "Undo",
  },
  {
    id: "bonus",
    name: "Bonus",
    type: "INCOME",
    color: "#f43f5e", // rose-500
    icon: "Star",
  },

  // Expense Categories
  {
    id: "housing",
    name: "Housing",
    type: "EXPENSE",
    color: "#ef4444", // red-500
    icon: "Home",
    subcategories: ["Rent", "Mortgage", "Property Tax", "Maintenance"],
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "EXPENSE",
    color: "#f97316", // orange-500
    icon: "Car",
    subcategories: ["Fuel", "Public Transport", "Maintenance", "Parking"],
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "EXPENSE",
    color: "#84cc16", // lime-500
    icon: "Shopping",
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "EXPENSE",
    color: "#06b6d4", // cyan-500
    icon: "Zap",
    subcategories: ["Electricity", "Water", "Gas", "Internet", "Phone"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    type: "EXPENSE",
    color: "#8b5cf6", // violet-500
    icon: "Film",
    subcategories: ["Movies", "Games", "Streaming Services"],
  },
  {
    id: "food",
    name: "Food",
    type: "EXPENSE",
    color: "#f43f5e", // rose-500
    icon: "UtensilsCrossed",
  },
  {
    id: "shopping",
    name: "Shopping",
    type: "EXPENSE",
    color: "#ec4899", // pink-500
    icon: "ShoppingBag",
    subcategories: ["Clothing", "Electronics", "Home Goods"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    type: "EXPENSE",
    color: "#14b8a6", // teal-500
    icon: "HeartPulse",
    subcategories: ["Medical", "Dental", "Pharmacy", "Insurance"],
  },
  {
    id: "education",
    name: "Education",
    type: "EXPENSE",
    color: "#6366f1", // indigo-500
    icon: "GraduationCap",
    subcategories: ["Tuition", "Books", "Courses"],
  },
  {
    id: "personal",
    name: "Personal Care",
    type: "EXPENSE",
    color: "#d946ef", // fuchsia-500
    icon: "Smile",
    subcategories: ["Haircut", "Gym", "Beauty"],
  },
  {
    id: "travel",
    name: "Travel",
    type: "EXPENSE",
    color: "#0ea5e9", // sky-500
    icon: "Plane",
  },
  {
    id: "insurance",
    name: "Insurance",
    type: "EXPENSE",
    color: "#64748b", // slate-500
    icon: "Shield",
    subcategories: ["Life", "Home", "Vehicle"],
  },
  {
    id: "gifts",
    name: "Gifts & Donations",
    type: "EXPENSE",
    color: "#f472b6", // pink-400
    icon: "Gift",
  },
  {
    id: "bills",
    name: "Bills & Fees",
    type: "EXPENSE",
    color: "#fb7185", // rose-400
    icon: "Receipt",
    subcategories: ["Bank Fees", "Late Fees", "Service Charges"],
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    type: "EXPENSE",
    color: "#22d3ee", // cyan-300
    icon: "Repeat",
    subcategories: ["Netflix", "Spotify", "Cloud Storage"],
  },
  {
    id: "pets",
    name: "Pets",
    type: "EXPENSE",
    color: "#fbbf24", // amber-300
    icon: "Dog",
    subcategories: ["Food", "Vet", "Toys"],
  },
  {
    id: "taxes",
    name: "Taxes",
    type: "EXPENSE",
    color: "#f87171", // red-400
    icon: "FileText",
    subcategories: ["Income Tax", "GST", "Other Taxes"],
  },
  {
    id: "events",
    name: "Events",
    type: "EXPENSE",
    color: "#a855f7", // purple-500
    icon: "Calendar",
    subcategories: ["Weddings", "Parties", "Ceremonies"],
  },
  {
    id: "tools",
    name: "Tools & Software",
    type: "EXPENSE",
    color: "#0f766e", // teal-700
    icon: "Wrench",
    subcategories: ["SaaS", "Dev Tools", "Licenses"],
  },
  {
    id: "other-expense",
    name: "Other Expenses",
    type: "EXPENSE",
    color: "#94a3b8", // slate-400
    icon: "MoreHorizontal",
  },
];

export const categoryColors = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});
