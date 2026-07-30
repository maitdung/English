import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan-400 text-slate-950 hover:bg-cyan-300 focus-visible:ring-cyan-400",
  secondary:
    "border border-white/10 bg-white/5 text-white hover:bg-white/10 focus-visible:ring-white/40",
  danger:
    "bg-red-500 text-white hover:bg-red-400 focus-visible:ring-red-400",
  ghost:
    "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-white/40",
};

const sizeClasses: Record<ButtonSize, string> = {
  small: "min-h-9 rounded-xl px-4 py-2 text-sm",
  medium: "min-h-11 rounded-2xl px-5 py-3 text-sm",
  large: "min-h-13 rounded-2xl px-7 py-4 text-base",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  isLoading = false,
  fullWidth = false,
  disabled,
  className = "",
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const buttonClasses = [
    "inline-flex items-center justify-center gap-2 font-bold",
    "transition duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-offset-slate-950",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={buttonClasses}
      {...buttonProps}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}

      <span>{isLoading ? "Đang xử lý..." : children}</span>
    </button>
  );
}

export default Button;