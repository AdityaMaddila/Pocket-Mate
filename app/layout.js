import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { CurrencyProvider } from "./context/CurrencyContext"; // ✅ Import

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pocket Mate",
  description: "One stop financial management solution",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <CurrencyProvider> {/* ✅ Wrap here */}
            <Header />
            <main className="min-h-screen bg-[#121212] ">{children}</main>
            <Toaster richColors />
            <Footer />
          </CurrencyProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
