"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodRawShape, ZodTypeAny } from "zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/my_components/CustomInput";
import { CustomPhoneInput } from "@/components/ui/my_components/CustomPhoneInput";
import CustomSelect from "@/components/ui/my_components/CustomSelect";
import CustomCurrency from "@/components/ui/my_components/CustomCurrency";
import OutcomeModal from "@/components/ui/my_components/OutcomeModals";
import { Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import AgentSelect, { Agent } from "@/components/ui/my_components/AgentSelect";

// --------------------------------------------------------------------------
// 1. Define the Base Schema
// --------------------------------------------------------------------------
const baseSchema = z.object({
  // Submission details
  agentName: z.string(),
  agentRecordId: z.string().optional(),
  date: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      const date = new Date(arg);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return arg;
  }, z.date({ required_error: "Required", invalid_type_error: "A valid date is required" })),
  // Owner details
  ownerFullName: z.string().min(1, "Required"),
  ownerEmail: z.string().email("Invalid email"),
  ownerPhoneNumber: z.string().refine((val) => {
    const trimmed = val.trim();
    if (trimmed === "") return false;
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
  }, {
    message: "Please enter a valid phone number",
  }),
  // Selling / Renting info
  lookingTo: z.enum(["Sell", "Rent", "Sell or Rent"]),
  askingPrice: z.number().positive("Must be a positive number").optional(),
  rentAskingPrice: z.number().positive("Must be a positive number").optional(),
  currentlyRented: z.enum(["Yes", "No"]).optional(),
  monthlyRentalIncome: z.number().positive("Must be a positive number").optional(),
  // Details
  bedrooms: z.number().positive("Must be a positive number")
});

// --------------------------------------------------------------------------
// 2. Extract Required Fields from the Base Schema
// --------------------------------------------------------------------------
// (For example, here we dynamically find keys whose underlying definition has a "min" value.)
const requiredFields = (Object.keys(baseSchema.shape) as (keyof typeof baseSchema.shape)[]).filter((key) => {
  const field = baseSchema.shape[key] as z.ZodTypeAny;
  return "min" in field._def && field._def.min?.[0] > 0;
});

// --------------------------------------------------------------------------
// 3. Build the Final Schema by Applying Refinements
// --------------------------------------------------------------------------
const formSchema = baseSchema
  .refine(
    (data: z.infer<typeof baseSchema>) =>
      !(data.lookingTo === "Sell" || data.lookingTo === "Sell or Rent") ||
      data.askingPrice !== undefined,
    {
      path: ["askingPrice"],
      message: "Asking Price is required when selling.",
    }
  )
  .refine(
    (data: z.infer<typeof baseSchema>) =>
      !(data.lookingTo === "Rent" || data.lookingTo === "Sell or Rent") ||
      data.rentAskingPrice !== undefined,
    {
      path: ["rentAskingPrice"],
      message: "Rent Asking Price is required when renting.",
    }
  )
  .refine(
    (data: z.infer<typeof baseSchema>) =>
      data.currentlyRented !== "Yes" || data.monthlyRentalIncome !== undefined,
    {
      path: ["monthlyRentalIncome"],
      message: "Monthly Rental Income is required when currently rented.",
    }
  );

export type FormValues = z.infer<typeof formSchema>;

// --------------------------------------------------------------------------
// 4. Data Form Component
// --------------------------------------------------------------------------
export default function DataForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: undefined,
      agentRecordId: undefined,
      date: undefined,
      ownerFullName: undefined,
      ownerEmail: undefined,
      ownerPhoneNumber: undefined,
      lookingTo: undefined,
      askingPrice: undefined,
      rentAskingPrice: undefined,
      currentlyRented: undefined,
      monthlyRentalIncome: undefined,
      bedrooms: undefined
    },
    shouldFocusError: true,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [apiError, setApiError] = useState("");
  const agentRecordId = watch("agentRecordId");

  // Watch form values.
  const formValues = watch();
  const lookingTo = watch("lookingTo");
  const currentlyRented = watch("currentlyRented");

  // Reset "askingPrice" when it's not needed.
  useEffect(() => {
    if (!(
      lookingTo === "Sell" || lookingTo === "Sell or Rent")) {
      setValue("askingPrice", undefined);
    }
  }, [lookingTo, setValue]);

  // Reset "rentAskingPrice" when it's not needed.
  useEffect(() => {
    if (!(lookingTo === "Rent" || lookingTo === "Sell or Rent")) {
      setValue("rentAskingPrice", undefined);
    }
  }, [lookingTo, setValue]);

  // Reset "monthlyRentalIncome" when currentlyRented is not "Yes".
  useEffect(() => {
    if (currentlyRented !== "Yes") {
      setValue("monthlyRentalIncome", undefined);
    }
  }, [currentlyRented, setValue]);

// --------------------------------------------------------------------------
// Airtable data configuration
// --------------------------------------------------------------------------
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
    bedrooms: "Number of Bedrooms"
  };

// --------------------------------------------------------------------------
// On Submit handler
// --------------------------------------------------------------------------
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("/api/airtable/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ Explicitly set JSON format
        body: JSON.stringify({ 
          ...data, // ✅ Spread operator merges all fields inside `data`
          requiredFields, // ✅ Ensures `requiredFields` is included
          fieldMapping // ✅ Send mapping dynamically
        }),
      });

      if (!response.ok) throw new Error("Submission failed");
      setShowSuccessModal(true);
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setApiError(errMessage);
      setShowErrorModal(true);
    }
  };

// --------------------------------------------------------------------------
// Form rendering
// --------------------------------------------------------------------------
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SECTION: Submission details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Submission details</h3>
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
            <Label htmlFor="publishDate">Publish Date *</Label>
            <Input
              {...register('date')}
              type="date"
              min={new Date().toISOString().split('T')[0]}
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
              value={formValues.ownerFullName}
            />
            <CustomInput
              {...register("ownerEmail")}
              label="Email Address *"
              type="email"
              placeholder="Email"
              error={errors.ownerEmail?.message}
              value={formValues.ownerEmail} 
            />
            <CustomPhoneInput
              {...register("ownerPhoneNumber")}
              label="Phone Number *"
              placeholder="Phone Number"
              country="us"
              error={errors.ownerPhoneNumber?.message}
              value={formValues.ownerPhoneNumber}
            />

          </div>
        </div>

        {/* SECTION: Looking To Sell/Rent */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Looking To Sell/Rent</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <CustomSelect
              {...register("lookingTo", { required: "Required" })}
              label="Looking To *"
              placeholder="Select an option"
              options={["Sell", "Rent", "Sell or Rent"]}
              error={errors.lookingTo?.message}
              value={formValues.lookingTo} 
            />
            {(!lookingTo || lookingTo === "Sell" || lookingTo === "Sell or Rent") && (
              <CustomCurrency
                control={control}
                name="askingPrice"
                label="Asking Price (USD) *"
                placeholder="Enter asking price"
                error={errors.askingPrice?.message}
              />
            )}
            {(lookingTo === "Rent" || lookingTo === "Sell or Rent") && (
              <CustomCurrency
                control={control}
                name="rentAskingPrice"
                label="Rent Asking Price (USD) *"
                placeholder="Enter rent price"
                error={errors.rentAskingPrice?.message}
              />
            )}
            <CustomSelect
              {...register("currentlyRented", { required: "Required" })}
              label="Currently Rented *"
              placeholder="Select an option"
              options={["Yes", "No"]}
              error={errors.currentlyRented?.message}
              value={formValues.currentlyRented} 
            />
            {currentlyRented === "Yes" && (
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
              value={formValues.bedrooms}
            />

          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end items-center gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit form"
            )}
          </Button>
        </div>
        
      </form>

{/* Modals rendering */}
      <OutcomeModal
        isOpen={showSuccessModal}
        onClose={setShowSuccessModal}
        type="success"
        message="Your form was successfully registered."
      />
      <OutcomeModal
        isOpen={showErrorModal}
        onClose={setShowErrorModal}
        type="error"
        message={apiError}
      />
    </>
  );
}
