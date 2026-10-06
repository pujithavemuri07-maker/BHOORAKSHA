interface SkeletonLoaderProps {
  type?: 'table' | 'card' | 'detail';
  rows?: number;
}

export const SkeletonLoader = ({ type = 'card', rows = 3 }: SkeletonLoaderProps) => {
  if (type === 'table') {
    return (
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-10 bg-slate-800/60 rounded-lg w-full" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-14 bg-slate-800/30 rounded-lg w-full" />
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-slate-800/50 rounded-xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-800/40 rounded-xl" />
          <div className="space-y-4">
            <div className="h-44 bg-slate-800/40 rounded-xl" />
            <div className="h-44 bg-slate-800/40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-28 bg-slate-800/50 rounded-xl" />
      ))}
    </div>
  );
};
