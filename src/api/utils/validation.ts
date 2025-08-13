interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message: string;
}

export const validationRules: Record<string, ValidationRule> = {
  firstName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[A-Za-z]+$/,
    message: 'First name must be 2-50 characters and contain only letters'
  },
  lastName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[A-Za-z]+$/,
    message: 'Last name must be 2-50 characters and contain only letters'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 8,
    maxLength: 100,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be 8-100 characters with at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character'
  },
  companyName: {
    maxLength: 100,
    message: 'Company name must be less than 100 characters'
  },
  industry: {
    maxLength: 50,
    message: 'Industry must be less than 50 characters'
  },
  otpCode: {
    pattern: /^\d{6}$/,
    message: 'OTP code must be exactly 6 digits'
  }
};

export const validateField = (value: string, rule: keyof typeof validationRules): string | null => {
  const validation = validationRules[rule];
  
  if (!value && rule !== 'companyName' && rule !== 'industry') {
    return 'This field is required';
  }
  
  if (validation.minLength && value.length < validation.minLength) {
    return validation.message;
  }
  
  if (validation.maxLength && value.length > validation.maxLength) {
    return validation.message;
  }
  
  if (validation.pattern && !validation.pattern.test(value)) {
    return validation.message;
  }
  
  return null;
};