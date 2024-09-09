"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface CustomProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor: string;
  threshhold?: number;
  showThreshholdText?: boolean;
  isBegin?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CustomProgressProps
>(
  (
    {
      className,
      value,
      indicatorColor,
      threshhold,
      showThreshholdText,
      isBegin,
      ...props
    },
    ref
  ) => (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-5 w-full overflow-hidden rounded-full bg-gray-800",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={`h-full w-full flex-1 transition-all ${indicatorColor}`}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        ></ProgressPrimitive.Indicator>

        {threshhold && (
          <div
            className={`absolute top-0 left-0 h-full ${isBegin?'bg-green-400':'bg-red-400'} rounded-3xl`}
            style={{
              width: "4px",
              left: `${threshhold}%`,
            }}
          ></div>
        )}
      </ProgressPrimitive.Root>
      {showThreshholdText && (
        <p
          className={`absolute text-xs font-bold ${
            isBegin ? "text-green-400" : "text-red-400"
          }`}
          style={{
            top: "100%",
            left: `${threshhold}%`,
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          {isBegin ? "Begin!!!" : `${threshhold}%`}
        </p>
      )}
    </div>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
