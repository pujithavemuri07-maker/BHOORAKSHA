export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidIndianPhone = (phone: string): boolean => {
  const re = /^(?:\+91|91)?[6-9]\d{9}$/;
  return re.test(phone.replace(/[\s-]/g, ''));
};

export const isValidSurveyNumber = (surveyNo: string): boolean => {
  return /^[0-9]+[a-zA-Z0-9\/-]*$/.test(surveyNo.trim());
};

export const isValidAadhaar = (aadhaar: string): boolean => {
  const cleaned = aadhaar.replace(/\s/g, '');
  return /^\d{12}$/.test(cleaned);
};
