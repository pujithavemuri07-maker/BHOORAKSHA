interface SkeletonLoaderProps {
  type?: 'table' | 'cards' | 'detail';
  rows?: number;
}

export const SkeletonLoader = ({ type = 'table', rows = 4 }: SkeletonLoaderProps) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-900/60 border border-slate-800" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 rounded-xl bg-slate-900/60 animate-pulse border border-slate-800" />
      ))}
    </div>
  );
};
