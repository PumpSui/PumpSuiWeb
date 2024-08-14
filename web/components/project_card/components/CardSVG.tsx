import React, { useEffect, useRef, useState } from "react";
import {
  card_background,
  card_frame,
  card_rocket_dark,
  card_rocket_light,
  card_title,
} from "../cardSvgImage";
import { Progress } from "@/components/ui/progress";
import { ProjectRecord } from "@/type";

interface TruncatedTextProps {
  content: string;
  x: number | string;
  y: number | string;
  maxWidth: number;
  fontSize: number;
  fill: string;
  fontWeight?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  content,
  x,
  y,
  maxWidth,
  fontSize,
  fill,
  fontWeight = "normal",
}) => {
  const textRef = useRef<SVGTextElement>(null);
  const [truncatedText, setTruncatedText] = useState(content);

  useEffect(() => {
    if (textRef.current) {
      const textElement = textRef.current;
      const textWidth = textElement.getComputedTextLength();

      if (textWidth > maxWidth) {
        let low = 0;
        let high = content.length;
        let mid;

        while (low < high) {
          mid = Math.floor((low + high + 1) / 2);
          textElement.textContent = content.slice(0, mid) + "...";

          if (textElement.getComputedTextLength() <= maxWidth) {
            low = mid;
          } else {
            high = mid - 1;
          }
        }

        setTruncatedText(content.slice(0, low) + "...");
      }
    }
  }, [content, maxWidth]);

  return (
    <text
      ref={textRef}
      x={x}
      y={y}
      fontSize={fontSize}
      fill={fill}
      fontWeight={fontWeight}
      textAnchor="middle"
    >
      {truncatedText}
    </text>
  );
};

interface CardSVGProps {
  projectImg: string;
  className?: string;
  project: ProjectRecord;
  getRealDate: (time: number) => string;
}

const CardSVG: React.FC<CardSVGProps> = ({
  projectImg,
  project,
  getRealDate,
}) => (
  <div className={`relative w-[480px] h-[540px]`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="480"
      height="540"
      viewBox="0 0 570 640"
    >
      <defs>
        <filter id="adjustImage">
          <feComponentTransfer>
            <feFuncR type="linear" slope="3" intercept="0" />
            <feFuncG type="linear" slope="3" intercept="0" />
            <feFuncB type="linear" slope="3" intercept="0" />
          </feComponentTransfer>

          <feColorMatrix type="saturate" values="2" />
        </filter>
      </defs>
      <image
        id="project_image"
        x="140"
        y="90"
        width="312"
        height="312"
        xlinkHref={projectImg}
      />
      <image
        id="card_background"
        x="88"
        y="67"
        width="418"
        height="538"
        xlinkHref={card_background}
      />
      <image
        id="card_frame"
        x="32"
        y="39"
        width="529"
        height="589"
        xlinkHref={card_frame}
      />
      <image
        id="card_title"
        x="117"
        y="348"
        width="360"
        height="91"
        xlinkHref={card_title}
      />
      <g id="rocket_group">
        <image
          id="rocket"
          x="18"
          y="6"
          width="116"
          height="202"
          xlinkHref={card_rocket_light}
          filter={project.start_time_ms < Date.now()? "url(#adjustImage)" : ""}
        />
        <image
          id="rokect_dark"
          x="43"
          y="40"
          width="69"
          height="104"
          xlinkHref={card_rocket_dark}
          display={project.start_time_ms > Date.now() ? "block" : "none"}
        />
      </g>
      <TruncatedText
        content={`@${project.creator}`}
        x={285}
        y={130}
        maxWidth={180}
        fontSize={16}
        fill="#e7bf48"
      />
      <TruncatedText
        content={`${project.name}`}
        x={"52%"}
        y={"62%"}
        maxWidth={200}
        fontSize={30}
        fontWeight="bold"
        fill="#413103"
      />
    </svg>
    <div className="absolute bottom-[15%] left-[5%] right-0 px-16">
      <div className="flex flex-col gap-y-2 items-center">
        <div className={"flex w-3/4 gap-x-5 justify-between items-center"}>
          <p className="font-bold text-orange-400">PROGRESS:</p>
          <Progress
            value={(1 - project.remain / project.total_supply) * 100}
            className="w-full self-center min-h-4"
            indicatorColor="bg-gradient-to-b from-yellow-300 to-orange-500 rounded-lg shadow-2xl transform"
            threshhold={project.threshold_ratio}
          />
        </div>
        <div className="flex justify-between w-3/4">
          <p className="font-bold text-orange-400">START:</p>
          <p className="text-sm">{getRealDate(project.start_time_ms)}</p>
        </div>
        <div className="flex justify-between items-center w-3/4">
          <p className="font-bold text-orange-400">END:</p>
          <p className="text-sm">{getRealDate(project.end_time_ms)}</p>
        </div>
      </div>
    </div>
  </div>
);

export default CardSVG;
