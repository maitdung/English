import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      rightElement,
      className = "",
      disabled,
      ...inputProps
    },
    ref,
  ) => {
    const inputClasses = [
      "w-full rounded-2xl border bg-white/[0.04] px-4 py-3.5 text-white",
      "outline-none transition placeholder:text-slate-600",
      "disabled:cursor-not-allowed disabled:opacity-50",
      rightElement ? "pr-20" : "",
      error
        ? "border-red-400/70 focus:border-red-400"
        : "border-white/10 focus:border-cyan-400/60 focus:bg-white/[0.06]",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${id}-error`
                : helperText
                  ? `${id}-helper`
                  : undefined
            }
            className={inputClasses}
            {...inputProps}
          />

          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${id}-error`}
            className="mt-2 text-sm font-medium text-red-400"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${id}-helper`} className="mt-2 text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;