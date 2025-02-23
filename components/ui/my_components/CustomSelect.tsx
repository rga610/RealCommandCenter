// components/ui/my_components/CustomSelect.tsx
"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, forwardRef } from "react";

export interface CustomSelectProps {
  name: string;
  value?: string; // current value (can be undefined)
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  error?: string;
  id?: string;
}

const CustomSelect = forwardRef<HTMLButtonElement, CustomSelectProps>(
  (
    { name, value, onChange, onBlur, options, placeholder = "Select an option", label, error, id },
    ref
  ) => {
    // Compute a default label if not provided.
    const computedLabel = label || name.replace(/([A-Z])/g, " $1").trim();

    // When a value is selected in the Radix Select, we need to trigger onChange with a synthetic event.
    const handleValueChange = (newValue: string) => {
      if (onChange) {
        const syntheticEvent = {
          target: {
            name,
            value: newValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    // Similarly, create a synthetic event for onBlur.
    const handleBlur = () => {
      if (onBlur) {
        const syntheticEvent = {
          target: {
            name,
            value: value || "",
          },
        } as React.FocusEvent<HTMLInputElement>;
        onBlur(syntheticEvent);
      }
    };

    // Optionally, if there’s an error, auto-focus the trigger.
    useEffect(() => {
      if (error && ref && typeof ref !== "function") {
        // @ts-ignore: assume ref is a mutable ref with a current property
        ref.current?.focus();
      }
    }, [error, ref]);

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-primary-dark mb-1">
          {computedLabel}
        </label>
        <Select.Root value={value || undefined} onValueChange={handleValueChange}>
          <Select.Trigger
            ref={ref}
            id={id}
            className={`
              flex h-10 w-full items-center justify-between rounded-md border 
              px-3 py-2 text-sm ring-offset-background 
              focus:outline-none focus:ring-2 focus:ring-accent-gold-light focus:ring-offset-2 
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? "focus:ring-accent-gold-light" : "border-input focus:ring-accent-gold-light"}
              ${value ? "bg-white text-primary-dark" : "bg-gray-50 text-gray-400"}
            `}
            aria-invalid={!!error}
            onBlur={handleBlur}
          >
            <Select.Value placeholder={placeholder} />
            <Select.Icon asChild>
              <ChevronDown className="h-4 w-4 text-primary-medium" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className="z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md 
                         border border-input bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-accent-gold-light"
              onEscapeKeyDown={(e) => e.stopPropagation()}
              onPointerDownOutside={(e) => e.stopPropagation()}
            >
              <Select.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                <ChevronUp className="h-4 w-4 text-primary-medium" />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-2">
                {options.map((option) => (
                  <Select.Item
                    key={option}
                    value={option}
                    className="relative flex w-full cursor-pointer select-none items-center 
                               rounded-md py-1.5 pl-8 pr-2 text-sm outline-none 
                               focus:bg-accent-gold-light focus:text-primary-dark"
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Select.ItemIndicator>
                        <Check className="h-4 w-4 text-primary-dark" />
                      </Select.ItemIndicator>
                    </span>
                    <Select.ItemText>{option}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                <ChevronDown className="h-4 w-4 text-primary-medium" />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;
