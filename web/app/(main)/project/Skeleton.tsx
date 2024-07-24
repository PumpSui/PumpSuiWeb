// components/Skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-64 w-full" />
    <div className="flex gap-x-10">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-96" />
    </div>
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);
