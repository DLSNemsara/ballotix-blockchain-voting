import React from "react";
import { Skeleton } from "../components/ui/skeleton";
import { Progress } from "../components/ui/progress";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Progress bar at top */}
      <div className="fixed top-0 right-0 left-0 z-50">
        <Progress value={33} className="h-1" />
      </div>

      {/* Main content */}
      <div className="container px-4 py-8 mx-auto">
        {/* Title skeleton */}
        <div className="mb-8">
          <Skeleton className="mx-auto w-3/4 h-12" />
        </div>

        {/* Candidate grid skeletons */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-lg shadow-sm bg-card"
            >
              {/* Profile image skeleton */}
              <Skeleton className="mb-4 w-32 h-32 rounded-full" />

              {/* Name skeleton */}
              <Skeleton className="mb-2 w-48 h-6" />

              {/* Subtitle skeleton */}
              <Skeleton className="mb-4 w-32 h-4" />

              {/* Vote count skeleton */}
              <Skeleton className="w-24 h-8" />
            </div>
          ))}
        </div>

        {/* Bottom action bar skeleton */}
        <div className="fixed bottom-0 left-0 w-full border-t backdrop-blur-sm border-border bg-background/80">
          <div className="container px-4 py-4 mx-auto">
            <div className="flex gap-4 justify-center">
              <Skeleton className="w-32 h-10" />
              <Skeleton className="w-32 h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
