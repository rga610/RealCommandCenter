// components/ui/my_components/CustomCurrency.tsx

"use client";

import { Controller, Control } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useEffect, useRef } from "react";

interface CustomCurrencyProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  error?: string;
}

export default function CustomCurrency({
  control,
  name,
  label,
  placeholder = "Enter amount",
  error,
}: CustomCurrencyProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus on error
  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.focus();
    }
  }, [error]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label || name.replace(/([A-Z])/g, " $1").trim()}
      </label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const { onChange, ...restField } = field; // omit default onChange
          return (
            <NumericFormat
              {...restField}
              // If the value is undefined or NaN, show an empty string.
              value={field.value !== undefined && !Number.isNaN(field.value) ? field.value : ""}
              thousandSeparator=","
              decimalScale={2}
              prefix="$"
              allowNegative={false}
              allowLeadingZeros={false}
              className={`
              flex h-10 w-full items-center justify-between rounded-md border 
              px-3 py-2 text-sm ring-offset-background 
              focus:outline-none focus:ring-2 focus:ring-accent-gold-light focus:ring-offset-2 
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? "border-red-500 focus:ring-red-300" : "border-input focus:ring-accent-gold-light"}
              ${field.value ? "bg-white text-primary-dark" : "bg-gray-50 text-gray-400"}
            `}
              placeholder={placeholder}
              getInputRef={inputRef}
              onValueChange={(values) => {
                const newValue = values.floatValue;
                // Pass the numeric value (or undefined if conversion fails)
                field.onChange(
                  newValue !== undefined && !Number.isNaN(newValue)
                    ? newValue
                    : undefined
                );
              }}
            />
          );
        }}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
