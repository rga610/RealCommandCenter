"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// UI + Custom Components
import { Button } from "@/components/default/button";
import OutcomeModal from "@/components/forms/OutcomeModals";
import AgentSelect, { Agent } from "@/components/forms/AgentSelect";
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomLongInput } from "@/components/forms/CustomLongInput";
import { Label } from "@/components/default/label";
import { Loader2 } from "lucide-react";

// --------------------------------------------------------------------------
// 1. Define the Base Schema (only the fields needed for Social Media Request)
// --------------------------------------------------------------------------
const baseSchema = z.object({
  agentRecordId: z.string().optional(),
  agentName: z.string().min(1, "Agent name is required"),
  propertyLink: z
    .string()
    .min(1, "Listing Link is required")
    .transform((url) =>
      url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`
    )
    .refine(
      (url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid URL format" }
    ),
  additionalNotes: z.string().optional(),
});

// --------------------------------------------------------------------------
// 2. Extract Required Fields (based on .min(...) or other checks)
// --------------------------------------------------------------------------
const requiredFields = (Object.keys(baseSchema.shape) as (keyof typeof baseSchema.shape)[]).filter(
  (key) => {
    const field = baseSchema.shape[key] as z.ZodTypeAny;
    return "min" in field._def && field._def.min?.[0] > 0;
  }
);

// --------------------------------------------------------------------------
// 3. Build the Final Schema (no extra refinements needed, so it's just baseSchema)
// --------------------------------------------------------------------------
const formSchema = baseSchema;

// --------------------------------------------------------------------------
// 4. Define Type + Component
// --------------------------------------------------------------------------
export type SocialMediaFormValues = z.infer<typeof formSchema>;

export default function SMListingFeatureForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SocialMediaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentRecordId: "",
      agentName: "",
      propertyLink: "",
      additionalNotes: "",
    },
    shouldFocusError: true,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [apiError, setApiError] = useState("");

  // Watch form values
  const formValues = watch();
  const agentRecordId = watch("agentRecordId");

  // --------------------------------------------------------------------------
  // Airtable data configuration
  // --------------------------------------------------------------------------
  const fieldMapping = {
    agentRecordId: "Agent Record ID",
    agentName: "Agent Name",
    propertyLink: "Listing Link",
    additionalNotes: "Additional Notes",
  };

  // --------------------------------------------------------------------------
  // On Submit handler
  // --------------------------------------------------------------------------
  const onSubmit = async (data: SocialMediaFormValues) => {
    try {
      const response = await fetch("/api/airtable/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          requiredFields,
          fieldMapping,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit social media request.");
      }

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
  // Render Form
  // --------------------------------------------------------------------------
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SECTION: Agent Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Submission Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AgentSelect
              value={agentRecordId || ""}
              onChange={(selectedId, selectedAgent) => {
                setValue("agentRecordId", selectedId);
                setValue("agentName", selectedAgent?.name || "");
              }}
              error={errors.agentName?.message}
              label="Select an Agent *"
            />
          </div>
        </div>

        {/* SECTION: Listing Link + Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Listing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-10">
            <CustomInput  
              {...register("propertyLink")}
              label="Listing Link *"
              placeholder="Enter link to the listing"
              error={errors.propertyLink?.message}
              value={formValues.propertyLink}
            />
          </div>
          <div className="mb-4">
            <CustomLongInput
              {...register("additionalNotes")}
              label="Additional Notes"
              placeholder="Enter any notes (optional)"
              error={errors.additionalNotes?.message}
              value={formValues.additionalNotes}
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
              "Submit Request"
            )}
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <OutcomeModal
        isOpen={showSuccessModal}
        onClose={setShowSuccessModal}
        type="success"
        message="Your social media request was successfully submitted."
      />

      {/* Error Modal */}
      <OutcomeModal
        isOpen={showErrorModal}
        onClose={setShowErrorModal}
        type="error"
        message={apiError}
      />
    </>
  );
}
