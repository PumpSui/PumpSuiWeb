import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import SupportButton from "./components/SupportButton";

export type ButtonAction = "transfer" | "split" | "merge" | "burn" | "stake";

interface SupportCardProps {
  id: string;
  base64Image: string;
  name: string;
  amount: string;
  className?: string;
  onButtonClick: (action: ButtonAction, name: string, id: string) => void;
  isSelected?: boolean;
  isMultiSelectMode?: boolean;
  onCardClick?: (id: string) => void;
}

const SupportCard: React.FC<SupportCardProps> = React.memo(
  ({
    id,
    base64Image,
    name,
    amount,
    onButtonClick,
    className = "",
    isSelected = false,
    isMultiSelectMode = false,
    onCardClick,
  }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleButtonClick = useCallback(
      (action: ButtonAction) => {
        onButtonClick(action, name, id);
      },
      [onButtonClick, name, id]
    );

    const handleCardClick = useCallback(() => {
      if (isMultiSelectMode && onCardClick) {
        onCardClick(id);
      }
    }, [isMultiSelectMode, onCardClick, id]);

    const cardStyle = useMemo(
      () =>
        ({
          "--rotation": isFlipped && !isMultiSelectMode ? "180deg" : "0deg",
        } as React.CSSProperties),
      [isFlipped, isMultiSelectMode]
    );

    const frontSide = useMemo(
      () => (
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
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
                <feGaussianBlur
                  in="goldOutline"
                  stdDeviation="2"
                  result="blur"
                />
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
              href="/images/Supporter_Ticket_Bg.svg"
              x="0"
              y="0"
              width="2492"
              height="2492"
            />
            <image
              href="/images/Supporter_Ticket_Title.svg"
              x="0"
              y="0"
              width="2492"
              height="2492"
            />
            <image
              href="/images/Supporter_Ticket_Name.svg"
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
      ),
      [base64Image, name, amount]
    );

    const backSide = useMemo(
      () => (
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/Supporter_Ticket_Back.svg"
              alt="Ticket Background"
              fill
              sizes="(max-width: 500px) 100vw, 500px"
              priority
              style={{ objectFit: "fill" }}
            />

            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <div className="flex flex-col bg-opacity-80 rounded-lg p-8 lg:p-12 w-4/5 max-w-[300px] h-full">
                <SupportButton onClick={() => handleButtonClick("transfer")}>
                  Transfer
                </SupportButton>
                <SupportButton onClick={() => handleButtonClick("merge")}>
                  Merge
                </SupportButton>
                <SupportButton onClick={() => handleButtonClick("split")}>
                  Split
                </SupportButton>
                <SupportButton onClick={() => handleButtonClick("burn")}>
                  <p className="text-destructive">Burn</p>
                </SupportButton>
                <SupportButton
                  disabled
                  onClick={() => handleButtonClick("stake")}
                >
                  Stake
                </SupportButton>
              </div>
            </div>
          </div>
        </div>
      ),
      [handleButtonClick]
    );

    return (
      <div
        className={`relative w-full max-w-[500px] aspect-square ${className} ${
          isSelected ? "ring-4 ring-blue-500" : ""
        }`}
        onMouseEnter={useCallback(
          () => !isMultiSelectMode && setIsFlipped(true),
          [isMultiSelectMode]
        )}
        onMouseLeave={useCallback(
          () => !isMultiSelectMode && setIsFlipped(false),
          [isMultiSelectMode]
        )}
        onClick={handleCardClick}
      >
        <div
          className={`w-full h-full transition-all duration-700 [perspective:1000px]`}
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(var(--rotation))`,
            ...cardStyle,
          }}
        >
          {frontSide}
          {backSide}
        </div>
        {isMultiSelectMode && isSelected && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

SupportCard.displayName = "SupportCard";

export default SupportCard;
