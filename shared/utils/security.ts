export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const maskAadhaar = (aadhaar: string): string => {
  const clean = aadhaar.replace(/\s/g, '');
  if (clean.length !== 12) return 'XXXX-XXXX-XXXX';
  return `XXXX-XXXX-${clean.slice(8)}`;
};

export const maskPhone = (phone: string): string => {
  const clean = phone.replace(/[\s-]/g, '');
  if (clean.length < 10) return 'XXXXX-XXXXX';
  return `${clean.slice(0, 3)}****${clean.slice(-3)}`;
};
