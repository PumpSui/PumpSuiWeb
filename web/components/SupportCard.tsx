import React from "react";

interface SupportCardSVGProps {
  base64Image: string;
  name: string;
  amount: string;
  className?: string;
}

const SupportCard: React.FC<SupportCardSVGProps> = ({
  base64Image,
  name,
  amount,
  className = "",
}) => {
  return (
    <div className={`w-full max-w-[500px] aspect-square ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 2492 2492"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="golden-outline">
            <feFlood floodColor="#FFD700" floodOpacity="1" result="gold" />
            <feComposite
              in="gold"
              in2="SourceAlpha"
              operator="in"
              result="goldOutline"
            />
            <feGaussianBlur in="goldOutline" stdDeviation="2" result="blur" />
            <feMorphology
              in="SourceAlpha"
              radius="2"
              operator="dilate"
              result="thickOutline"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="thickOutline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <image
          href={base64Image}
          x="682"
          y="548"
          height="978"
          width="1128"
          preserveAspectRatio="none"
        />
        <image
          href={"/images/Supporter_Ticket_Bg.svg"}
          x="0"
          y="0"
          width="2492"
          height="2492"
        />
        <image
          href={"/images/Supporter_Ticket_Title.svg"}
          x="0"
          y="0"
          width="2492"
          height="2492"
        />
        <image
          href={"/images/Supporter_Ticket_Name.svg"}
          x="0"
          y="0"
          width="2492"
          height="2492"
        />

        <text
          x="50%"
          y="1570"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Arial, sans-serif"
          fontSize="100"
          fontWeight="bold"
          fill="#352f18"
          filter="url(#golden-outline)"
        >
          {name}
        </text>
        <text
          x="1022"
          y="1836"
          textAnchor="left"
          dominantBaseline="central"
          fontFamily="Arial, sans-serif"
          fontSize="72"
          fontWeight="bold"
          fill="black"
        >
          {amount}
        </text>
      </svg>
    </div>
  );
};

export default SupportCard;
