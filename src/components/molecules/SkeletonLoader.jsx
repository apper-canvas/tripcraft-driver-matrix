const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="flex justify-between pt-4">
          <div className="h-8 bg-gray-200 rounded w-20" />
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="bg-white rounded-lg shadow-card border border-surface-200 p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );

  const renderRowSkeleton = () => (
    <div className="flex items-center space-x-4 p-4 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-1/6" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-16" />
    </div>
  );

  const skeletonMap = {
    card: renderCardSkeleton,
    list: renderListSkeleton,
    row: renderRowSkeleton
  };

  const SkeletonComponent = skeletonMap[type] || renderCardSkeleton;

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <SkeletonComponent />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;