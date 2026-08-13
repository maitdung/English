export const STRONG_PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,72}$/;

export const STRONG_PASSWORD_MESSAGE =
  'Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và không chứa khoảng trắng.';
