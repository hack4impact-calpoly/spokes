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
          <div className="w-full py-4 px-5 rounded-md bg-[#f7f7f7]">
            <div className="w-full h-fit flex flex-row items-center mb-3">
              <Skeleton className="mb-1" height={24} width="60%" />
              <div className="ml-auto">
                <Skeleton height={24} width={80} />
              </div>
            </div>

            {/* Date info section */}
            <div className="w-full h-fit flex flex-col sm:flex-row sm:gap-4 mb-3">
              {type === "single" ? (
                <Skeleton height={20} width={150} />
              ) : (
                <>
                  <Skeleton height={20} width={150} />
                  <Skeleton height={20} width={150} />
                  {type === "multi" && <Skeleton height={20} width={150} />}
                </>
              )}
            </div>

            {/* Badges and edit button */}
            <div className="w-full h-fit flex flex-row items-center gap-2">
              <Skeleton height={24} width={80} />
              <Skeleton height={24} width={80} />
              <div className="ml-auto">
                <Skeleton height={32} width={32} circle={true} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
