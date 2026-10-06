import React from 'react';

interface SkeletonLoaderProps {
  type?: 'table' | 'cards' | 'detail';
  rows?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'cards', rows = 3 }) => {
  if (type === 'table') {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-700/60 rounded-xl" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
      ))}
    </div>
  );
};
