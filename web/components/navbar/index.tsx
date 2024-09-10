"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { ConnectButton } from "@mysten/dapp-kit";
import { useRouter, usePathname } from "next/navigation";

import "@mysten/dapp-kit/dist/index.css";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bg-background top-0 left-0 right-0 z-50 shadow-md border-b-2 border-gray-800 px-24 py-14">
      <div className="flex justify-between items-center gap-10">
        <div onClick={() => router.push("/")} className="cursor-pointer">
          <p className="text-5xl text-[#CFFF0A] font-bold font-jaro">B o m e n t</p>
        </div>

        <div className="hidden md:flex ml-auto items-center gap-10">
          <div className="bg-secondary flex items-center p-1 rounded-lg">
            <Button 
              variant="ghost" 
              size={"lg"}
              onClick={() => router.push("/")}
              className={isActive("/") ? "bg-black text-primary" : ""}
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              size={"lg"}
              onClick={() => router.push("/create")}
              className={isActive("/create") ? "bg-black text-primary" : ""}
            >
              Create
            </Button>
            <Button 
              variant="ghost" 
              size={"lg"}
              onClick={() => router.push("/assets")}
              className={isActive("/assets") ? "bg-black text-primary" : ""}
            >
              Assets
            </Button>
            <Button 
              variant="ghost" 
              size={"lg"}
              onClick={() => router.push("/doc")}
              className={isActive("/doc") ? "bg-black text-primary" : ""}
            >
              Doc
            </Button>
          </div>
          <div className="outline outline-1 outline-secondary flex justify-end items-center min-h-14 rounded-xl">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
