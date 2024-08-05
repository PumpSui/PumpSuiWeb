'use client';
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
