import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@utils/cn";

const textareaStyles = cva(
  "w-full min-h-[240px] border bg-white px-[14px] py-5 text-[14px] leading-[20px] text-gray-900 placeholder:text-[#8e8e8e] outline-none transition-colors resize-none disabled:cursor-not-allowed",
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

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaStyles> & {
    label?: string;
    helperText?: string;
    errorText?: string;
    isError?: boolean;
    width?: number | string;
    height?: number | string;
    rounded?: boolean;
  };

function TextArea({
  className,
  label,
  helperText,
  errorText,
  isError = false,
  disabled,
  name,
  width,
  height,
  style,
  rounded = true,
  ...props
}: TextAreaProps) {
  const resolvedName = name;
  const status = isError ? "error" : "default";
  const showError = isError && errorText;
  const message = showError ? errorText : helperText;
  const mergedStyle = { ...style, ...(width ? { width } : {}), ...(height ? { height } : {}) };

  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label htmlFor={resolvedName} className="text-[13px] font-semibold leading-[16px] text-gray-700">
          {label}
        </label>
      ) : null}
      <textarea
        name={resolvedName}
        id={resolvedName}
        disabled={disabled}
        aria-invalid={isError}
        className={cn(textareaStyles({ status, disabled, rounded }), className)}
        style={mergedStyle}
        {...props}
      />
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

export default TextArea;