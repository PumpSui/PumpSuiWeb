import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRealDate = (date: number) => {
  const timestamp = typeof date === "string" ? parseInt(date) : date;
  const realTimestamp = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  return new Date(realTimestamp).toLocaleString();
};

export const daysToTimestamp = (days: number): number => {
  const millisecondsInADay = 24 * 60 * 60 * 1000; 
  return days * millisecondsInADay;
}

// utils/debounce.ts
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}
