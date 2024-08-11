import React, { MouseEvent } from "react";
import Image from "next/image";

interface SupportButtonProps {
  children: React.ReactNode;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const SupportButton: React.FC<SupportButtonProps> = ({
  children,
  onClick,
  disabled,
}) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(event);
    }
  };
  return (
    <div className="relative inline-block my-1 scale-50 xl:scale-75 h-full">
      <div
        className={`absolute inset-0 min-h-10 flex justify-center items-center ${
          disabled && disabled ? "" : "hover:cursor-pointer hover:scale-125"
        } `}
        onClick={handleClick}
      >
        <Image
          src={"/images/Supporter_Ticket_Button.png"}
          alt="Button background"
          fill
          style={{ objectFit: "fill" }}
          sizes="100%"
          className={`w-full h-full ${
            disabled && disabled ? "contrast-50 brightness-50" : ""
          }`}
        />
        <span
          className={`z-10  font-bold ${
            disabled && disabled ? "text-gray-500" : "text-orange-200"
          } text-xl`}
        >
          {children}
        </span>
      </div>
    </div>
  );
};

export default SupportButton;
