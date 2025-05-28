import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface OrgCardSkeletonProps {
  count?: number;
  type?: "default" | "single" | "multi";
}

export default function OrgCardSkeleton({ count = 3, type = "default" }: OrgCardSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-container" key={index}>
          <div className="w-full py-3 sm:py-4 px-3 sm:px-5 rounded-md bg-[#f7f7f7]">
            {/* Title and status */}
            <div className="w-full h-fit flex flex-row items-center gap-2 mb-2 sm:mb-3">
              <Skeleton className="flex-1" height={24} width="60%" />
              <Skeleton height={24} width={80} />
            </div>

            {/* Date info section */}
            <div className="w-full h-fit flex flex-col sm:flex-row sm:gap-4 mb-2 sm:mb-3">
              {type === "single" ? (
                <Skeleton height={20} width={150} />
              ) : (
                <>
                  <Skeleton height={20} width={150} className="hidden sm:block" />
                  <Skeleton height={20} width={150} className="hidden sm:block" />
                  {type === "multi" && <Skeleton height={20} width={150} className="hidden sm:block" />}
                  {/* Mobile date info */}
                  <Skeleton height={20} width={150} className="sm:hidden" />
                </>
              )}
            </div>

            {/* Feedback button (mobile only) */}
            <div className="flex md:hidden mb-2">
              <Skeleton height={32} width={100} />
            </div>

            {/* Badges and buttons */}
            <div className="w-full h-fit flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-1 sm:gap-2">
                <Skeleton height={24} width={80} />
                <Skeleton height={24} width={80} className="hidden sm:block" />
              </div>
              <div className="flex flex-row items-center gap-2">
                {/* Feedback button (desktop only) */}
                <div className="hidden md:flex">
                  <Skeleton height={32} width={120} />
                </div>
                {/* Edit button */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
