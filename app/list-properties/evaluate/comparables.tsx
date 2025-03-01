"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/default/input";
import { Button } from "@/components/default/button";
import { Trash2, Plus } from "lucide-react";
import PricingSummary from "./PricingSummary";

// Update the Comparable interface. Note that we change id to a string.
export interface Comparable {
  id: string;
  price: string;
  size: string;
  bedrooms: string;
  bathrooms: string;
  yearBuilt: string;
  url: string;
}

// Define the form values interface that includes comparables.
interface FormValues {
  comparables: Comparable[];
}

// The popover component that appears next to the URL field.
// It uses a portal so that it is rendered directly into document.body.
function UrlPopover({
  index,
  defaultValue,
  onClose,
  position,
}: {
  index: number;
  defaultValue: string;
  onClose: () => void;
  position: { top: number; left: number };
}) {
  const { register, trigger } = useFormContext<FormValues>();

  return createPortal(
    <div
      style={{ top: position.top, left: position.left }}
      className="fixed z-50 w-64 p-2 bg-white border rounded shadow-lg"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        URL
      </label>
      <Input
        type="text"
        defaultValue={defaultValue}
        {...register(`comparables.${index}.url`, {
          onBlur: () => {
            trigger();
            onClose();
          },
        })}
        className="border p-1 w-full"
      />
      <div className="mt-1 text-right">
        <Button
          size="sm"
          onClick={onClose}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Close
        </Button>
      </div>
    </div>,
    document.body
  );
}

export default function ComparableInput() {
  const { control, register, trigger } = useFormContext<FormValues>();
  // Use the generic type so that the fields are correctly typed.
  const { fields, append, remove } = useFieldArray<FormValues, "comparables", "id">({
    control,
    name: "comparables",
  });
  const [openUrlIndex, setOpenUrlIndex] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);

  // When a user clicks on the URL label, compute the popover position from the clicked element.
  const handleUrlClick = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Position the popover a few pixels below the clicked element.
    setPopoverPosition({ top: rect.bottom + 5, left: rect.left });
    setOpenUrlIndex(index);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comparable Properties</h3>
      <div className="border rounded-lg overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Price ($)</th>
              <th className="p-3 border">Size (sqm)</th>
              <th className="p-3 border">Bedrooms</th>
              <th className="p-3 border">Bathrooms</th>
              <th className="p-3 border">Year Built</th>
              <th className="p-3 border">URL</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border">
                  <Input
                    type="text"
                    placeholder="Enter price"
                    defaultValue={field.price}
                    {...register(`comparables.${index}.price`, {
                      onBlur: () => trigger(),
                    })}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none"
                  />
                </td>
                <td className="p-3 border">
                  <Input
                    type="text"
                    placeholder="Enter size"
                    defaultValue={field.size}
                    {...register(`comparables.${index}.size`, {
                      onBlur: () => trigger(),
                    })}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none"
                  />
                </td>
                <td className="p-3 border">
                  <Input
                    type="text"
                    placeholder="Enter bedrooms"
                    defaultValue={field.bedrooms}
                    {...register(`comparables.${index}.bedrooms`, {
                      onBlur: () => trigger(),
                    })}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none"
                  />
                </td>
                <td className="p-3 border">
                  <Input
                    type="text"
                    placeholder="Enter bathrooms"
                    defaultValue={field.bathrooms}
                    {...register(`comparables.${index}.bathrooms`, {
                      onBlur: () => trigger(),
                    })}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none"
                  />
                </td>
                <td className="p-3 border">
                  <Input
                    type="text"
                    placeholder="Enter year built"
                    defaultValue={field.yearBuilt}
                    {...register(`comparables.${index}.yearBuilt`, {
                      onBlur: () => trigger(),
                    })}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none"
                  />
                </td>
                <td className="p-3 border">
                  <span
                    className="text-blue-500 cursor-pointer underline"
                    onClick={(e) => handleUrlClick(e, index)}
                  >
                    {field.url ? "View" : "Add"}
                  </span>
                </td>
                <td className="p-3 border">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PricingSummary />

      <Button
        onClick={() =>
          append({
            id: Date.now().toString(),
            price: "",
            size: "",
            bedrooms: "",
            bathrooms: "",
            yearBuilt: "",
            url: "",
          })
        }
        className="bg-green-500 text-white"
      >
        <Plus className="h-4 w-4 mr-2" /> Add New Comparable
      </Button>

      {openUrlIndex !== null && popoverPosition && (
        <UrlPopover
          index={openUrlIndex}
          defaultValue={fields[openUrlIndex]?.url}
          onClose={() => {
            setOpenUrlIndex(null);
            setPopoverPosition(null);
          }}
          position={popoverPosition}
        />
      )}
    </div>
  );
}
