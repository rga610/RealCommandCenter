//Broken

"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import FormHelper from "@/lib/forms/formHelper"; 
// ^ Adjust the import path to where you placed your formHelper.tsx
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomPhoneInput } from "@/components/forms/CustomPhoneInput";
import { CustomLongInput } from "@/components/forms/CustomLongInput";
import CustomSelect from "@/components/forms/CustomSelect";
import CustomCurrency from "@/components/forms/CustomCurrency";
import AgentSelect from "@/components/forms/AgentSelect";
import { Button } from "@/components/default/button";
import { Input } from "@/components/default/input";
import { Label } from "@/components/default/label";
import { Loader2 } from "lucide-react";

/* -------------------------------------------------------------------------
   1. Define Zod Schema
   ------------------------------------------------------------------------- */
const baseSchema = z.object({
  // Submission details
  agentName: z.string().optional(),
  agentRecordId: z.string().optional(),
  date: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      const date = new Date(arg);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return arg;
  }, z.date({ required_error: "Required", invalid_type_error: "A valid date is required" })),

  // Owner details
  ownerFullName: z.string().min(1, "Required"),
  ownerEmail: z.string().email("Invalid email"),
  ownerPhoneNumber: z
    .string()
    .refine((val) => {
      const trimmed = val.trim();
      if (!trimmed) return false;
      if (trimmed.startsWith("+")) {
        const allDigits = trimmed.replace(/\D/g, "");
        const match = trimmed.match(/^\+(\d+)/);
        if (!match) return false;
        const dialDigits = match[1];
        return allDigits.length > dialDigits.length;
      } else {
        const digits = trimmed.replace(/\D/g, "");
        return digits.length >= 4;
      }
    }, { message: "Please enter a valid phone number" }),

  // Selling / Renting info
  lookingTo: z.enum(["Sell", "Rent", "Sell or Rent"]).optional(),
  askingPrice: z.number().positive("Must be a positive number").optional(),
  rentAskingPrice: z.number().positive("Must be a positive number").optional(),
  currentlyRented: z.enum(["Yes", "No"]).optional(),
  monthlyRentalIncome: z.number().positive("Must be a positive number").optional(),

  // Details
  bedrooms: z.number().positive("Must be a positive number").optional(),
  additionalNotes: z.string().optional(),
});

// 2. Build final schema with refinements
const formSchema = baseSchema
  .refine(
    (data) =>
      !(data.lookingTo === "Sell" || data.lookingTo === "Sell or Rent") ||
      data.askingPrice !== undefined,
    {
      path: ["askingPrice"],
      message: "Asking Price is required when selling.",
    }
  )
  .refine(
    (data) =>
      !(data.lookingTo === "Rent" || data.lookingTo === "Sell or Rent") ||
      data.rentAskingPrice !== undefined,
    {
      path: ["rentAskingPrice"],
      message: "Rent Asking Price is required when renting.",
    }
  )
  .refine(
    (data) => data.currentlyRented !== "Yes" || data.monthlyRentalIncome !== undefined,
    {
      path: ["monthlyRentalIncome"],
      message: "Monthly Rental Income is required when currently rented.",
    }
  );

// 3. Default Values (can be partial)
const defaultValues = {
  agentName: "",
  agentRecordId: "",
  date: "",
  ownerFullName: "",
  ownerEmail: "",
  ownerPhoneNumber: "",
  lookingTo: "",
  askingPrice: undefined,
  rentAskingPrice: undefined,
  currentlyRented: "",
  monthlyRentalIncome: undefined,
  bedrooms: undefined,
  additionalNotes: "",
};

// 4. Field Mapping (optional)
const fieldMapping = {
  agentName: "Agent Name",
  date: "Date",
  ownerFullName: "Owner's Full Name",
  ownerEmail: "Email Address",
  ownerPhoneNumber: "Phone Number",
  lookingTo: "Looking To",
  askingPrice: "Asking Price",
  rentAskingPrice: "Rent Asking Price",
  currentlyRented: "Currently Rented",
  monthlyRentalIncome: "Monthly Rental Income",
  bedrooms: "Number of Bedrooms",
  additionalNotes: "Additional Notes",
};

/* -------------------------------------------------------------------------
   5. Example Template Form using formHelper
   ------------------------------------------------------------------------- */
export default function DataFormTemplate() {
  // Example submission function
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // (In real code, replace with your actual API endpoint)
    const response = await fetch("/api/airtable/some-endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        fieldMapping,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Submission failed");
    }
  };

  return (
    <FormHelper
      schema={formSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      fieldMapping={fieldMapping}
      className="space-y-6"
    >
      {({ register, control, errors, watch, setValue }) => {
        /* 
          Watchers / conditional logic 
          (the same logic you previously had in useEffect):
        */
        useEffect(() => {
          const lookingTo = watch("lookingTo");
          if (!(lookingTo === "Sell" || lookingTo === "Sell or Rent")) {
            setValue("askingPrice", undefined);
          }
          if (!(lookingTo === "Rent" || lookingTo === "Sell or Rent")) {
            setValue("rentAskingPrice", undefined);
          }
        }, [watch("lookingTo")]); // re-run whenever lookingTo changes

        useEffect(() => {
          const currentlyRented = watch("currentlyRented");
          if (currentlyRented !== "Yes") {
            setValue("monthlyRentalIncome", undefined);
          }
        }, [watch("currentlyRented")]);

        // We can read form values as needed:
        const agentRecordId = watch("agentRecordId");

        // Return the form UI
        return (
          <>
            {/* SECTION: Submission details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Submission Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AgentSelect
                  value={agentRecordId || ""}
                  onChange={(selectedId, selectedAgent) => {
                    setValue("agentRecordId", selectedId);
                    setValue("agentName", selectedAgent?.name || "");
                  }}
                  error={errors.agentName?.message}
                  label="Select an Agent *"
                />
                <div>
                  <Label htmlFor="date">Publish Date *</Label>
                  <Input
                    {...register("date")}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            {/* SECTION: Owner Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Owner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomInput
                  {...register("ownerFullName")}
                  label="Owner's Full Name *"
                  placeholder="Full Name"
                  error={errors.ownerFullName?.message}
                  value={watch("ownerFullName")}
                />
                <CustomInput
                  {...register("ownerEmail")}
                  label="Email Address *"
                  type="email"
                  placeholder="Email"
                  error={errors.ownerEmail?.message}
                  value={watch("ownerEmail")}
                />
                <CustomPhoneInput
                  {...register("ownerPhoneNumber")}
                  label="Phone Number *"
                  placeholder="Phone Number"
                  country="us"
                  error={errors.ownerPhoneNumber?.message}
                  value={watch("ownerPhoneNumber")}
                />
              </div>
            </div>

            {/* SECTION: Looking To Sell/Rent */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Looking To Sell/Rent</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomSelect
                  {...register("lookingTo")}
                  label="Looking To *"
                  placeholder="Select an option"
                  options={["Sell", "Rent", "Sell or Rent"]}
                  error={errors.lookingTo?.message}
                  value={watch("lookingTo")}
                />
                {/* Asking Price */}
                {["Sell", "Sell or Rent"].includes(watch("lookingTo") || "") && (
                  <CustomCurrency
                    control={control}
                    name="askingPrice"
                    label="Asking Price (USD) *"
                    placeholder="Enter asking price"
                    error={errors.askingPrice?.message}
                  />
                )}
                {/* Rent Asking Price */}
                {["Rent", "Sell or Rent"].includes(watch("lookingTo") || "") && (
                  <CustomCurrency
                    control={control}
                    name="rentAskingPrice"
                    label="Rent Asking Price (USD) *"
                    placeholder="Enter rent price"
                    error={errors.rentAskingPrice?.message}
                  />
                )}
                {/* Currently Rented */}
                <CustomSelect
                  {...register("currentlyRented")}
                  label="Currently Rented *"
                  placeholder="Select an option"
                  options={["Yes", "No"]}
                  error={errors.currentlyRented?.message}
                  value={watch("currentlyRented")}
                />
                {/* Monthly Rental Income */}
                {watch("currentlyRented") === "Yes" && (
                  <CustomCurrency
                    control={control}
                    name="monthlyRentalIncome"
                    label="Monthly Rental Income (USD) *"
                    placeholder="Enter rental income"
                    error={errors.monthlyRentalIncome?.message}
                  />
                )}
              </div>
            </div>

            {/* SECTION: Property Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomInput
                  {...register("bedrooms", { valueAsNumber: true })}
                  label="Number of Bedrooms *"
                  type="number"
                  placeholder="Enter number of bedrooms"
                  error={errors.bedrooms?.message}
                  value={watch("bedrooms")}
                />
              </div>
            </div>

            {/* SECTION: Additional info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <CustomLongInput
                  {...register("additionalNotes")}
                  label="Additional Notes"
                  placeholder="Enter any notes (optional)"
                  error={errors.additionalNotes?.message}
                  value={watch("additionalNotes")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end items-center gap-4">
              <Button
                type="submit"
                className="w-full md:w-auto bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
              >
                {false ? ( // you can also do `isSubmitting` from formHelper if you store it in context
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Form"
                )}
              </Button>
            </div>
          </>
        );
      }}
    </FormHelper>
  );
}
