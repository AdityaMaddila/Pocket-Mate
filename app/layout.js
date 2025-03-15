import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
const inter= Inter({subsets: ["latin"]});

export const metadata = {
  title: "Pocket Mate",
  description: "One stop financial management solution",  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider>
      <body className={`${inter.className}`}>
        <Header />

        <main className="min-h-screen bg-[#121212]">{children}</main>
        <Footer />
      </body>
      </ClerkProvider>
    </html>
  );
}
