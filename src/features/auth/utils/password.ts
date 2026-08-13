export const PASSWORD_REQUIREMENTS_MESSAGE =
  "Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và không chứa khoảng trắng.";

export function getPasswordStrength(password: string): number {
  const checks = [
    password.length >= 8 && password.length <= 72,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9\s]/.test(password) && !/\s/.test(password),
  ];

  return checks.filter(Boolean).length;
}

export function isStrongPassword(password: string): boolean {
  return getPasswordStrength(password) === 4;
}
