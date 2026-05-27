import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface JobGridSkeletonProps {
  count?: number;
}

export default function JobGridSkeleton({ count = 3 }: JobGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-container" key={index}>
          <div className="max-w-[100%] " key={index}>
            <div className="bg-[#f7f7f7] rounded-md px-8 pt-5 pb-2 shadow-sm h-full flex flex-col">
              <div className="space-y-5 ">
                <Skeleton className="mb-1" height={24} width="60%" />
                <Skeleton className="mb-2" height={16} width="40%" />
                <Skeleton className="mb-2" height={18} width="50%" />
                <Skeleton className="mb-1" height={110} width="100%" />
              </div>
              <div className="flex flex-row md:flex-col lg:flex-row gap-4 items-end lg:items-end mb-3 md:items-start mt-4 max-[400px]:flex-col max-[400px]:items-start">
                <div className="flex gap-2 ">
                  <Skeleton height={24} width={80} />
                  <Skeleton height={24} width={80} />
                </div>
                <div className="item-end">
                  <Skeleton height={20} width={100} />
                </div>
              </div>
              <div className="flex flex-col gap-5 mb-5 lg:flex-row">
                <Skeleton height={35} width={190} />
                <Skeleton height={35} width={190} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
