import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";
const Header = async () => {
  await checkUser();
  return (
    <div className="fixed top-0 w-full backdrop-blur-md z-50 shadow-md ">
      <nav className="container mx-auto px-4 pb-1 pt-1 flex items-center justify-between ">
        <div className="">  
          <Link href="/">
            <Image
              src={"/logo.png"}
              alt="Pocket-mate logo"
              height={60}
              width={200}
              className="h-15 w-auto object-contain"
              />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href={"/dashboard"} className="text-white flex items-center gap-2">
              <Button className="flex items-center gap-2 button ">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href={"/transaction/create"} className="text-white flex items-center gap-2">
              <Button className="flex items-center gap-2 button">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button className="button">Login</Button>
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