"use client";

import { Button } from "../ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";

const Navbar = () => {
  return (
    <nav className="flex my-12 justify-between items-center gap-10">
      <Image
        className="flex-shrink-0 ml-5"
        src="/images/Pump.png"
        alt="logo"
        width={260}
        height={1}
        quality={80}
      />
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
          <Button variant="link">Home</Button>
          <Button variant="link">Create</Button>
          <Button variant="link">Profile</Button>
        </div>
        <div className="bg-secondary flex justify-end items-center min-h-14 pl-3 rounded-l-3xl">
          <Button variant="link">Connect Wallet</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
