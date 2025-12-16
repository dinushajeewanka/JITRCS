// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
};

// Salary validation
export const validateSalary = (salary) => {
  return salary > 0 && salary <= 999999999;
};

// Age validation
export const validateAge = (dateOfBirth) => {
  const age = calculateAge(dateOfBirth);
  return age >= 18 && age <= 65;
};

// Calculate age helper
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// Department code validation
export const validateDepartmentCode = (code) => {
  return code && code.length >= 2 && code.length <= 20;
};
