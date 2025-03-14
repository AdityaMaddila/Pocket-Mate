import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";

const Header = () => {
  return (
    <div className="fixed top-0 w-full backdrop-blur-md z-50 border-b shadow-md ">
      <nav className="container mx-auto px-4 pb-1 pt-1 flex items-center justify-between gradient">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="Pocket-mate logo"
            height={60}
            width={200}
            className="h-15 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href={"/dashboard"} className="text-white flex items-center gap-2">
              <Button className="flex items-center gap-2">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href={"/transactions/create"} className="text-white flex items-center gap-2">
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12 rounded-full", // Increased size here
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;