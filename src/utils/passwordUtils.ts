/**
 * Generisanje sigurne lozinke
 */
export const generatePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Osiguraj da lozinka ima bar jedno slovo, broj i simbol
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Popuni ostatak random karakterima
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Promiješaj lozinku
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/**
 * Validacija lozinke
 */
export const isPasswordStrong = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Lozinka mora imati bar 8 karaktera');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Lozinka mora sadržavati bar jedno veliko slovo');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Lozinka mora sadržavati bar jedno malo slovo');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Lozinka mora sadržavati bar jedan broj');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
