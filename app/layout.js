import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
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

        <main className="min-h-screen">{children}</main>
        <footer className="text-center text-sm bg-blue-50 py-12">
          <div className="container mx-auto text-center text-sm text-Black-900">
          <p>© 2025 Pocket Mate</p>

          </div>
          
          </footer>
      </body>
      </ClerkProvider>
    </html>
  );
}
