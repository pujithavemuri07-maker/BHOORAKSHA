export const formatSurveyNumber = (survey: string, sub?: string): string => {
  return sub ? `${survey}/${sub}` : survey;
};

export const formatAcres = (extent: number): string => {
  return `${extent.toFixed(2)} Acres (${(extent * 4046.86).toFixed(0)} sq.m)`;
};

export const formatDate = (isoString: string): string => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (isoString: string): string => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
