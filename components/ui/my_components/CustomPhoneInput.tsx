// components/ui/my_components/CustomPhoneInput.tsx

"use client";

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/lib/utils";

export interface CustomPhoneInputProps {
  name: string;
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  // Updated these to accept an event:
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  country?: string; // Optional default country; default is "cr"
  preferredCountries?: string[]; // Optional list of preferred countries.
  // ...other props as needed.
}

const CustomPhoneInput = React.forwardRef<HTMLInputElement, CustomPhoneInputProps>(
  (
    {
      name,
      label,
      error,
      placeholder = "Enter phone number",
      value,
      onChange,
      onBlur,
      onFocus,
      country,
      preferredCountries,
      ...props
    },
    ref
  ) => {
    // Compute a default label if none is provided.
    const computedLabel = label || name.replace(/([A-Z])/g, " $1").trim();

    // Use "cr" (Costa Rica) as default country if none is provided.
    const defaultCountry = country || "cr";

    // Mapping for default dial codes.
    const dialCodes: Record<string, string> = {
      cr: "+506",
      us: "+1",
      // add other countries if needed.
    };

    const defaultDialCode = dialCodes[defaultCountry] || "";

    // Initialize phone value: if no value is provided, use the default dial code.
    const [phoneValue, setPhoneValue] = React.useState<string>(
      value && value.trim() !== "" ? value : defaultDialCode
    );
    // Local state to track focus.
    const [isFocused, setIsFocused] = React.useState(false);

    // Compute background and text colors.
    const trimmedPhoneValue = phoneValue.trim();
    const isOnlyDefault = trimmedPhoneValue === defaultDialCode;
    const computedBackgroundColor =
      !isFocused && isOnlyDefault ? "#F9FAFB" : "#FFFFFF";
    const computedTextColor =
      !isFocused && isOnlyDefault ? "#9CA3AF" : "#111827";

    // Wrap the string value from PhoneInput into a synthetic event for onChange.
    const handlePhoneChange = (val: string) => {
      setPhoneValue(val);
      if (onChange) {
        const syntheticEvent = {
          target: {
            name,
            value: val,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    // Wrap the event into a synthetic event (with our current value) for onFocus.
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) {
        const syntheticEvent = {
          target: {
            name,
            value: phoneValue,
          },
        } as React.FocusEvent<HTMLInputElement>;
        onFocus(syntheticEvent);
      }
    };

    // Wrap the event into a synthetic event (with our current value) for onBlur.
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) {
        const syntheticEvent = {
          target: {
            name,
            value: phoneValue,
          },
        } as React.FocusEvent<HTMLInputElement>;
        onBlur(syntheticEvent);
      }
    };

    React.useEffect(() => {
      setPhoneValue(defaultDialCode);
    }, [defaultDialCode]);

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {computedLabel}
        </label>
        <PhoneInput
          country={defaultCountry}
          value={phoneValue}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          inputClass={cn("ring-offset-background focus:outline-none focus:ring-2 focus:ring-accent-gold-light focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500" : "border-gray-300"
          )}
          placeholder={placeholder}
          inputStyle={{
            backgroundColor: computedBackgroundColor,
            color: computedTextColor,
            fontSize: "13px",
            height: "2.4rem",
            borderColor: "#d1d5db"
          }}
          preferredCountries={preferredCountries || ["cr", "us"]}
          // Forward the ref to the underlying native input via inputProps.
          inputProps={{
            name,
            ref,
          }}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

CustomPhoneInput.displayName = "CustomPhoneInput";

export { CustomPhoneInput };
