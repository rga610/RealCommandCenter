// components\ui\my_components\CustomInput.tsx

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "@/components/default/input";

export interface CustomInputProps extends InputProps {
  name: string;
  label?: string;
  error?: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ name, label, error, className, placeholder = "Please enter value", value, onChange, ...props }, ref) => {
    const computedLabel = label || name.replace(/([A-Z])/g, " $1").trim();

    // ✅ Compute background based on value (ensuring reactivity)
    const backgroundClass = value && value !== "" ? "bg-white" : "bg-gray-50 focus:bg-white";

    return (
      <div className="w-full">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {computedLabel}
        </label>
        <Input
          id={name}
          name={name}
          ref={ref} // ✅ Ensures RHF tracking
          placeholder={placeholder}
          className={cn(className, backgroundClass)}
          value={value}
          onChange={onChange} // ✅ Ensure changes are properly tracked
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export { CustomInput };
