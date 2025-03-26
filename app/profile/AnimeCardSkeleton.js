import { FaCalendar, FaBook, FaStar } from "react-icons/fa";

function AnimeCardSkeleton() {
  return (
    <div className="sm:p-3 w-full">
      <div className="overflow-hidden relative rounded-lg aspect-[5/7] bg-gray-300 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div>
        <div className="mt-2 rounded-md flex items-center space-x-1 bg-gray-300 animate-pulse">
          <div className="w-16 h-4 bg-gray-400 rounded"></div>
        </div>
        <div className="text-xs sm:text-sm flex space-x-2 mt-2 select-none">
          <p className="dark:text-secondary text-primary flex items-center">
            <FaCalendar />
            <span className="ml-1 bg-gray-400 w-12 h-4 rounded animate-pulse"></span>
          </p>
          <p className="dark:text-secondary text-primary flex items-center">
            <FaBook />
            <span className="ml-1 bg-gray-400 w-12 h-4 rounded animate-pulse"></span>
          </p>
          <p className="dark:text-secondary text-primary flex items-center">
            <FaStar />
            <span className="ml-1 bg-gray-400 w-12 h-4 rounded animate-pulse"></span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnimeCardSkeleton;