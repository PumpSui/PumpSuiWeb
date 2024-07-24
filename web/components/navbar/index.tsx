"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { ConnectButton } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";

import "@mysten/dapp-kit/dist/index.css";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed bg-background top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex pl-4 py-6 justify-between items-center gap-10">
        <div className="flex-shrink-0 w-56 h-14 relative">
          <Image
            onClick={() => router.push("/")}
            className="hover:cursor-pointer object-contain"
            src="/images/pumpSuiLogo.png"
            alt="logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        <div className="hidden md:flex relative flex-1 md:flex-grow-0 items-center min-h-10">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search project..."
            className="w-full rounded-3xl bg-secondary pl-8 md:w-[200px] lg:w-[320px] min-h-10"
          />
        </div>

        <div className="hidden md:flex ml-auto items-center gap-10">
          <div className="bg-secondary flex items-center min-h-14 px-3 rounded-3xl">
            <Button variant="link" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button variant="link" onClick={() => router.push("/create")}>
              Create
            </Button>
            <Button variant="link" onClick={() => router.push("/assets")}>
              Assets
            </Button>
          </div>
          <div className="bg-secondary flex justify-end items-center min-h-14 pl-3 rounded-l-3xl">
            <ConnectButton />
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button
              variant="link"
              className="w-full text-left"
              onClick={() => router.push("/")}
            >
              Home
            </Button>
            <Button
              variant="link"
              className="w-full text-left"
              onClick={() => router.push("/create")}
            >
              Create
            </Button>
            <Button
              variant="link"
              className="w-full text-left"
              onClick={() => router.push("/assets")}
            >
              Assets
            </Button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <ConnectButton />
            </div>
          </div>
          <div className="mt-3 px-2 relative">
            <Search className="absolute left-5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search project..."
              className="w-full rounded-3xl bg-secondary pl-10 pr-4 py-2"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
