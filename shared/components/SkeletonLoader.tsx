import React from 'react';

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md"
          style={{ width: `${85 - idx * 15}%` }}
        />
      ))}
    </div>
  );
};
