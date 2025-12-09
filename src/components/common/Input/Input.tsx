import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@utils/cn";

const inputStyles = cva(
  "w-full h-[52px] border bg-white px-[14px] py-[17px] text-[15px] leading-[18px] text-gray-900 placeholder:text-[#b3b3b3] outline-none transition-colors disabled:cursor-not-allowed",
  {
    variants: {
      status: {
        default:
          "border-[#e1e1e1] focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary/30",
        error:
          "border-primary focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary/30",
      },
      disabled: {
        true: "bg-gray-100 text-gray-600 placeholder:text-gray-600",
      },
      withIcon: {
        true: "pr-[46px]",
      },
      rounded: {
        false: "rounded-[4px]",
        true: "rounded-[16px]",
      },
    },
    defaultVariants: {
      status: "default",
      rounded: true,
    },
  }
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputStyles> & {
    label?: string;
    helperText?: string;
    errorText?: string;
    isError?: boolean;
    rightIcon?: React.ReactNode;
    rounded?: boolean;
  };

function Input({
  className,
  label,
  helperText,
  errorText,
  isError = false,
  rightIcon,
  disabled,
  name,
  rounded = true,
  ...props
}: InputProps) {
  const resolvedName = name;
  const status = isError ? "error" : "default";
  const showError = isError && errorText;
  const message = showError ? errorText : helperText;

  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label htmlFor={resolvedName} className="text-[13px] font-semibold leading-[16px] text-gray-700">
          {label}
        </label>
      ) : null}
      <div className="relative w-full">
        <input
          name={resolvedName}
          id={resolvedName}
          disabled={disabled}
          aria-invalid={isError}
          className={cn(inputStyles({ status, disabled, withIcon: Boolean(rightIcon), rounded }), className)}
          {...props}
        />
        {rightIcon ? (
          <span className="pointer-events-auto absolute inset-y-0 right-3 flex items-center text-gray-700">
            {rightIcon}
          </span>
        ) : null}
      </div>
      {message ? (
        <p
          className={cn(
            "text-[12px] leading-[15px]",
            showError ? "text-primary" : "text-gray-700"
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
