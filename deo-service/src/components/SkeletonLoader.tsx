import React from 'react';

interface SkeletonLoaderProps {
  type?: 'table' | 'cards' | 'detail';
  rows?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'table', rows = 5 }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-slate-200 dark:bg-slate-800/60 rounded-xl" />
      ))}
    </div>
  );
};
