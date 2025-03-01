// app/list-properties/evaluate/form.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/default/input";

export default function ListingForm() {
  const { register } = useFormContext(); // ✅ Now this will work

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Property Information</h3>

      <Input {...register("title")} placeholder="Property Title" />
      <Input {...register("location")} placeholder="Location" />
      <Input type="number" {...register("price")} placeholder="Price ($)" />
      <Input type="number" {...register("size")} placeholder="Size (sqm)" />
      <Input type="number" {...register("bedrooms")} placeholder="Bedrooms" />
      <Input type="number" {...register("bathrooms")} placeholder="Bathrooms" />
      <Input {...register("agent")} placeholder="Agent Name" />
    </div>
  );
}
