// CustomSelect.tsx
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef } from "react";

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: boolean;
  id?: string;
  onTriggerRef?: (el: HTMLButtonElement | null) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  error,
  id,
  onTriggerRef,
}) => {
  const selectTriggerRef = useRef<HTMLButtonElement | null>(null);

  // As soon as this component mounts, pass the DOM ref up to the parent
  useEffect(() => {
    if (onTriggerRef) {
      onTriggerRef(selectTriggerRef.current);
    }
  }, [onTriggerRef]);

  return (
    <Select.Root value={value ?? ""} onValueChange={onChange}>
      <Select.Trigger
        ref={selectTriggerRef}
        id={id}
        className={`
          w-full text-sm border rounded-lg px-3 py-2 
          flex justify-between items-center leading-normal
          transition-colors duration-200 
          focus:outline-none focus:ring-2
          ${error 
            ? "border-gray-200 focus:ring-accent-gold-light" 
            : "border-gray-200 focus:ring-accent-gold-light"
          }
          ${value ? "bg-white text-gray-700" : "bg-gray-50 text-gray-400"}
        `}
        aria-invalid={error ? "true" : "false"}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-white border border-gray-300 rounded-lg shadow-md 
                     focus:outline-none focus:ring-2 focus:ring-accent-gold-light" 
          onEscapeKeyDown={(e) => e.stopPropagation()}
          onPointerDownOutside={(e) => e.stopPropagation()}
        >
          <Select.Viewport className="p-2">
            {options.map((option) => (
              <Select.Item
                key={option}
                value={option}
                className="
                  cursor-pointer px-4 py-2 rounded-md 
                  focus:outline-none hover:bg-accent-gold-light 
                "
              >
                <Select.ItemText>{option}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default CustomSelect;
