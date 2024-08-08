import React from "react";
import { ButtonProps } from "@/components/ui/button";
import Image from "next/image";

const SupportButton: React.FC<ButtonProps> = ({
  children,
}) => {
  return (
    <div className="relative inline-block my-2">
      <div className="absolute inset-0 min-h-10 flex justify-center items-center hover:cursor-pointer hover:scale-125">
        <Image
          src={"/images/Supporter_Ticket_Button.png"}
          alt="Button background"
          layout="fill"
          objectFit="contain"
          className="w-full h-full"
        />
        <span className="z-10 text-orange-200 font-bold">
          {children}
        </span>
      </div>
    </div>
  );
};

export default SupportButton;
