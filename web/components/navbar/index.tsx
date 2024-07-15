"use client";

import { Button } from "../ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import {
  ConnectButton,
} from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="fixed bg-background top-0 left-0 right-0 z-50 flex pl-4 py-6 justify-between items-center gap-10 shadow-md">
      <div className="flex-shrink-0 w-56 h-14 relative">
        <Image
          onClick={() => {
            router.push("/");
          }}
          className="hover:cursor-pointer object-fill"
          src="/images/pumpSuiLogo.png"
          alt="logo"
          layout="fill"
          quality={80}
        />
      </div>

      <div className="relative flex-1 md:flex-grow-0 flex items-center min-h-10">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search project..."
          className="w-full rounded-3xl bg-secondary pl-8 md:w-[200px] lg:w-[320px] min-h-10"
        />
      </div>
      <div className="flex ml-auto items-center gap-10">
        <div className="bg-secondary flex items-center min-h-14 px-3 rounded-3xl">
          <Button
            variant="link"
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </Button>
          <Button
            variant="link"
            onClick={() => {
              router.push("/create");
            }}
          >
            Create
          </Button>
          <Button
            variant="link"
            onClick={() => {
              router.push("/assets");
            }}
          >
            Assets
          </Button>
        </div>
        <div className="bg-secondary flex justify-end items-center min-h-14 pl-3 rounded-l-3xl">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
