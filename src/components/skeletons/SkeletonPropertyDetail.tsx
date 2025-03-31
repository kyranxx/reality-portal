export function SkeletonPropertyDetail() {
  return (
    <div className="container mx-auto p-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="h-80 bg-gray-200 rounded-lg"></div>
        <div>
          <div className="bg-gray-200 rounded-lg p-6 h-64"></div>
        </div>
      </div>
      <div className="bg-gray-200 rounded-lg p-6 h-32 mb-8"></div>
    </div>
  );
}
