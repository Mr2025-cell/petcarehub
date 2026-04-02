/**
 * Centralized Form Validation Utility
 * Used to ensure inputs meet Security and Data Integrity Requirements
 */

export function validateEmail(email) {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Please enter a valid email format';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  
  // Basic security check (requires one number)
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  
  return null;
}

export function validateName(name, fieldName = 'Name') {
  if (!name || name.trim() === '') return `${fieldName} is required`;
  if (name.length < 2) return `${fieldName} must be at least 2 characters`;
  return null;
}

export function validateHourlyRate(rate) {
  if (rate === '' || rate === undefined || rate === null) return 'Hourly rate is required';
  if (isNaN(rate) || Number(rate) < 0) return 'Hourly rate must be a positive number';
  if (Number(rate) > 500) return 'Hourly rate exceeds maximum allowed';
  return null;
}

/**
 * Returns password strength assessment for real-time UI feedback.
 * @param {string} password
 * @returns {{ score: number, label: string, color: string }}
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: 'transparent' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'var(--danger)' };
  if (score <= 3) return { score: 2, label: 'Medium', color: 'var(--warning)' };
  return { score: 3, label: 'Strong', color: 'var(--success)' };
}
