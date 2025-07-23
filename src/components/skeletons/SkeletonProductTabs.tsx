import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonProductTabs() {
  return (
    <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="rounded-xl shadow-md bg-white p-3 space-y-3"
            >
              <div className="relative">
                <Skeleton height={150} borderRadius={12} />
                <div className="absolute top-2 left-2">
                  <Skeleton width={60} height={20} />
                </div>
              </div>

              <Skeleton width={100} height={20} />
              <Skeleton height={20} />
              <div className="flex items-center gap-2">
                <Skeleton width={20} height={20} circle />
                <Skeleton width={80} height={12} />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton width={20} height={20} circle />
                <Skeleton width={100} height={12} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <Skeleton width={40} height={20} />
                <Skeleton width={80} height={20} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
