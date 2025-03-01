// components/ui/my_components/CustomLongInput.tsx

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea, TextareaProps } from "@/components/default/textarea";

export interface CustomLongInputProps extends TextareaProps {
  name: string;
  label?: string;
  error?: string;
}

const CustomLongInput = React.forwardRef<HTMLTextAreaElement, CustomLongInputProps>(
  (
    {
      name,
      label,
      error,
      className,
      placeholder = "Please enter your text here...",
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    // Convert "someFieldName" => "Some Field Name" if no label is provided
    const computedLabel = label || name.replace(/([A-Z])/g, " $1").trim();

    // White background if there's a value, else gray, and also turns white on focus
    const backgroundClass = value && value !== "" ? "bg-white" : "bg-gray-50 focus:bg-white";

    return (
      <div className="w-full">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {computedLabel}
        </label>
        <Textarea
          id={name}
          name={name}
          ref={ref} // ✅ ensures RHF can track this field
          placeholder={placeholder}
          className={cn(className, backgroundClass)}
          value={value}
          onChange={onChange} // ✅ pass any onChange from react-hook-form
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

CustomLongInput.displayName = "CustomLongInput";

export { CustomLongInput };
