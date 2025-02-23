// app\list-properties\collect-data\page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  X,
  FileText,
  ChevronDown,
  Check,
  Send,
  Share2,
  Pencil,
  ExternalLink,
  Copy,
  Mail,
  Upload,
  FolderOpen,
  Download,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ArrowUpRight,
} from "lucide-react";

// 1) Helper that turns NaN or non‐number => undefined
function parseOptionalNumber(val: unknown) {
  if (typeof val !== "number" || Number.isNaN(val)) {
    return undefined;
  }
  return val;
}

// 2) Our form schema
const formSchema = z
  .object({
    id: z.string().optional(),

    // 🔹 Owner Details
    ownerFullName: z.string().min(1, "Owner full name is required"),
    ownerEmail: z.string().email("Valid email is required"),
    ownerPhoneNumber: z.string().min(1, "Phone number is required"),

    // 🔹 Selling & Ownership Info
    lookingTo: z.enum(["Sell", "Rent", "Sell or Rent"]),
    askingPrice: z.preprocess(parseOptionalNumber, z.number().optional()),
    rentAskingPrice: z.preprocess(parseOptionalNumber, z.number().optional()),
    ownershipStatus: z.enum([
      "Sole Owner",
      "Co-Owned",
      "Representing on behalf of owner",
    ]),
    propertyType: z.enum([
      "House",
      "Apartment",
      "Residential land",
      "Commercial/Industrial",
    ]),
    currentlyRented: z.enum(["Yes", "No"]),
    monthlyRentalIncome: z.preprocess(parseOptionalNumber, z.number().optional()),

    // 🔹 Location Info
    town: z.string().optional(),
    district: z.string().min(1, "District is required"),
    canton: z.string().min(1, "Canton is required"),
    province: z.string().min(1, "Province is required"),
    location: z.string().optional(),
    communityType: z.enum(["Close-gate", "Open-gate", "Tower", "Not Applicable"]),
    communityName: z.string().optional(),
    hoa: z.preprocess(parseOptionalNumber, z.number().optional()),

    // 🔹 Property Details
    bedrooms: z.coerce.number().min(1, "Must have at least 1 bedroom"),
    bathrooms: z.coerce.number().min(1, "Must have at least 1 bathroom"),
    parkingSpaces: z.coerce.number().min(0, "Must have at least 0 parking space"),
    lotArea: z.preprocess(parseOptionalNumber, z.number().optional()),
    constructedArea: z.coerce.number({
      required_error: "At least constructed area is required",
    }),
    livableArea: z.preprocess(parseOptionalNumber, z.number().optional()),
    areaMetricType: z.enum(["Square Meter", "Square Feet"]),
    yearBuilt: z.preprocess(parseOptionalNumber, z.number().optional()),
    yearLastRenovated: z.preprocess(parseOptionalNumber, z.number().optional()),

    // 🔹 Additional Property Info
    existingMarketingAssets: z.enum(["Yes", "No"]),
    amenities: z.string().min(1, "Please provide amenities & features"),
    additionalNotes: z.string().optional(),
  })
  // Revised refine for askingPrice:
  .refine(
    (data) => {
      // If lookingTo is undefined, or is "Sell" or "Sell or Rent", then askingPrice must be provided and > 0.
      if (!data.lookingTo || data.lookingTo === "Sell" || data.lookingTo === "Sell or Rent") {
        return data.askingPrice !== undefined && data.askingPrice > 0;
      }
      return true;
    },
    {
      message: "Asking Price is required and must be > 0 when selling.",
      path: ["askingPrice"],
    }
  )
  // Revised refine for rentAskingPrice:
  .refine(
    (data) => {
      // If lookingTo is undefined, or is "Rent" or "Sell or Rent", then rentAskingPrice must be provided and > 0.
      if (!data.lookingTo || data.lookingTo === "Rent" || data.lookingTo === "Sell or Rent") {
        return data.rentAskingPrice !== undefined && data.rentAskingPrice > 0;
      }
      return true;
    },
    {
      message: "Rent Asking Price is required and must be > 0 when renting.",
      path: ["rentAskingPrice"],
    }
  )
  // Make communityName required if communityType != "Not Applicable"
  .refine(
    (data) => {
      if (data.communityType !== "Not Applicable") {
        return Boolean(data.communityName && data.communityName.trim().length);
      }
      return true;
    },
    {
      message: "Community Name is required.",
      path: ["communityName"],
    }
  )
  // Revised refine for hoa:
  .refine(
    (data) => {
      if (data.communityType && data.communityType !== "Not Applicable") {
        return data.hoa !== undefined && data.hoa >= 0;
      }
      return true;
    },
    {
      message:
        "Maintenance/HOA fee is required (0 or more) when communityType is not 'Not Applicable'.",
      path: ["hoa"],
    }
  );

// THIS WAS HERE FROM BEFORE
type RequiredDocument = {
  id: string;
  name: string;
  type: "legal" | "technical" | "financial";
  status: "pending" | "uploaded" | "approved";
  uploadedAt?: string;
  driveUrl?: string;
};

export default function CollectPropertyData() {
  // Document state (unchanged)
  const [requiredDocs, setRequiredDocs] = useState<RequiredDocument[]>([
    {
      id: "1",
      name: "Property Title",
      type: "legal",
      status: "pending",
    },
    {
      id: "2",
      name: "Floor Plans",
      type: "technical",
      status: "uploaded",
      uploadedAt: "2023-10-15",
      driveUrl: "https://drive.google.com/file/d/1",
    },
    {
      id: "3",
      name: "Property Tax Records",
      type: "financial",
      status: "approved",
      uploadedAt: "2023-10-14",
      driveUrl: "https://drive.google.com/file/d/2",
    },
    {
      id: "4",
      name: "Utility Bills",
      type: "financial",
      status: "pending",
    },
    {
      id: "5",
      name: "Building Permits",
      type: "legal",
      status: "pending",
    },
  ]);

  const breadcrumbItems = [
    { label: "List a Property", href: "/list-properties" },
    { label: "Collect Listing Data", href: "/list-properties/collect-data" },
  ];

  // Misc local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // -------------- A) useForm with manual focusing turned on --------------
  // IMPORTANT: We now set shouldUnregister: true so that fields that are not rendered are unregistered.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldFocusError: false, // We'll manually focus the first error.
    shouldUnregister: true, // Unregister hidden (conditional) fields automatically.
    defaultValues: {
      ownerFullName: "",
      ownerEmail: "",
      ownerPhoneNumber: "",
      lookingTo: undefined,
      askingPrice: undefined,
      rentAskingPrice: undefined,
      ownershipStatus: undefined,
      currentlyRented: undefined,
      monthlyRentalIncome: undefined,
      propertyType: undefined,
      communityType: undefined,
      communityName: "",
      hoa: undefined,
      town: "",
      district: "",
      canton: "",
      province: "",
      location: "",
      bedrooms: undefined,
      bathrooms: undefined,
      parkingSpaces: undefined,
      lotArea: undefined,
      constructedArea: undefined,
      livableArea: undefined,
      areaMetricType: undefined,
      yearBuilt: undefined,
      yearLastRenovated: undefined,
      amenities: "",
      existingMarketingAssets: undefined,
      additionalNotes: "",
    },
  });

  // -------------- A.2) Global Field Order --------------
  // This list defines the order in which fields should be focused on error.
  const FIELD_ORDER: (keyof z.infer<typeof formSchema>)[] = [
    // Owner details
    "ownerFullName",
    "ownerEmail",
    "ownerPhoneNumber",

    // Ownership Info
    "lookingTo",
    "askingPrice",
    "rentAskingPrice",
    "ownershipStatus",
    "propertyType",
    "currentlyRented",
    "monthlyRentalIncome",

    // Location Info
    "town",
    "district",
    "canton",
    "province",
    "location",
    "communityType",
    "communityName",
    "hoa",

    // Property Details
    "bedrooms",
    "bathrooms",
    "parkingSpaces",
    "lotArea",
    "constructedArea",
    "livableArea",
    "areaMetricType",
    "yearBuilt",
    "yearLastRenovated",
    "existingMarketingAssets",

    // Additional
    "amenities",
    "additionalNotes",
  ];

  // -------------- B) Refs for manual focusing --------------
  // We'll store the DOM element for each field in this object.
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  /**
   * Returns the first field (by effective order) that has a validation error.
   * Only fields that are actually visible (based on conditional logic) are considered.
   */
  function getFirstErrorFieldInOrder(
    errors: FieldErrors<z.infer<typeof formSchema>>
  ): keyof z.infer<typeof formSchema> | null {
   // Get the current values from the form at the time of error processing.
   const currentValues = form.getValues();
  
   // Compute the effective field order based on which conditional fields are visible.
   const effectiveFieldOrder = FIELD_ORDER.filter((fieldName) => {
    switch (fieldName) {
      case "askingPrice":
        // Include askingPrice if lookingTo is undefined OR set to "Sell" or "Sell or Rent"
        return (
          !currentValues.lookingTo ||
          currentValues.lookingTo === "Sell" ||
          currentValues.lookingTo === "Sell or Rent"
        );  
        case "rentAskingPrice":
          return (
            !currentValues.lookingTo ||
            currentValues.lookingTo === "Rent" ||
            currentValues.lookingTo === "Sell or Rent"
          );
          case "monthlyRentalIncome":
            return currentValues.currentlyRented === "Yes";
            case "communityName":
              case "hoa":
                return currentValues.communityType && currentValues.communityType !== "Not Applicable";
              default:
                return true;
            }
          });

    // Return the first field in the effective order that has an error.
      for (const fieldName of effectiveFieldOrder) {
        if (errors[fieldName]) {
          return fieldName;
        }
      }
      return null;
}

  // -------------- C) Currency Formatting --------------
  const [localAskingPrice, setLocalAskingPrice] = useState<string | number>(
    form.watch("askingPrice") || ""
  );
  const [localRentPrice, setLocalRentPrice] = useState<string | number>(
    form.watch("rentAskingPrice") || ""
  );
  const [localMonthlyRental, setLocalMonthlyRental] = useState<string | number>(
    form.watch("monthlyRentalIncome") || ""
  );
  const [localHoa, setLocalHoa] = useState<string | number>(
    form.watch("hoa") || ""
  );
  function formatCurrency(value: number | string): string {
    if (!value || isNaN(Number(value))) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  }

  // -------------- D) Watch Values for Conditional Rendering --------------
  // These values control whether conditional fields are rendered.
  const lookingToValue = form.watch("lookingTo");
  const currentlyRentedValue = form.watch("currentlyRented");
  const communityTypeValue = form.watch("communityType");

  // -------------- E) Conditional Resets --------------
  // When a conditional field is hidden, we reset its value.
  useEffect(() => {
    if (
      !(
        lookingToValue === undefined ||
        lookingToValue === "Sell" ||
        lookingToValue === "Sell or Rent"
      )
    ) {
      form.setValue("askingPrice", undefined, { shouldValidate: true });
      setLocalAskingPrice("");
    }
  }, [lookingToValue, form]);

  useEffect(() => {
    if (lookingToValue !== "Rent" && lookingToValue !== "Sell or Rent") {
      form.setValue("rentAskingPrice", undefined, { shouldValidate: true });
      setLocalRentPrice("");
    }
  }, [lookingToValue, form]);

  useEffect(() => {
    if (currentlyRentedValue !== "Yes") {
      form.setValue("monthlyRentalIncome", undefined);
      setLocalMonthlyRental("");
    }
  }, [currentlyRentedValue, form]);

  useEffect(() => {
    if (!communityTypeValue || communityTypeValue === "Not Applicable") {
      form.setValue("communityName", "");
      form.setValue("hoa", undefined);
      setLocalHoa("");
    }
  }, [communityTypeValue, form]);

  // -------------- F) Copy / Send / Document Management Functions --------------
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const sendEmail = () => {
    window.location.href = `mailto:?subject=Property Form&body=View the property form here: ${shareUrl}`;
  };

  const handleUploadDocument = async (docId: string) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setRequiredDocs((prev) =>
            prev.map((doc) =>
              doc.id === docId
                ? {
                    ...doc,
                    status: "uploaded",
                    uploadedAt: new Date().toISOString().split("T")[0],
                    driveUrl: `https://drive.google.com/file/d/${Math.random()
                      .toString(36)
                      .substr(2, 9)}`,
                  }
                : doc
            )
          );
          toast.success("Document uploaded successfully");
        }
      };
      input.click();
    } catch (error) {
      toast.error("Error uploading document");
    }
  };

  const handleApproveDocument = (docId: string) => {
    setRequiredDocs((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, status: "approved" } : doc
      )
    );
    toast.success("Document approved");
  };

  const handleViewDocument = (driveUrl?: string) => {
    if (driveUrl) {
      window.open(driveUrl, "_blank");
    } else {
      toast.error("Document not available");
    }
  };

  // -------------- G) onSubmit Handler --------------
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("🛠 Form submission triggered", values);
    try {
      setIsSubmitting(true);
      setHasSubmitAttempt(false);
      setApiError(null);

      const response = await fetch("/api/airtable/listing-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "❌ Failed to submit listing intake form."
        );
      }

      console.log("✅ Successfully submitted form!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setShowSuccessModal(true);
      form.reset();
      setLocalAskingPrice("");
      setLocalRentPrice("");
      setShowNewForm(false);
      setSelectedForm(null);
      toast.success("🎉 Listing intake form submitted successfully!");
    } catch (error: any) {
      console.error("⚠️ Submission Error:", error);
      setApiError(error.message || "An error occurred while submitting.");
      setShowErrorModal(true);
      setHasSubmitAttempt(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  // -------------- H) onInvalid Handler --------------
  async function onInvalid(errors: FieldErrors<z.infer<typeof formSchema>>) {
    setHasSubmitAttempt(true);
    // Optionally trigger extra validation here if needed:
    await form.trigger();
  
    const firstErrorKey = getFirstErrorFieldInOrder(errors);
    if (firstErrorKey) {
      fieldRefs.current[firstErrorKey]?.focus();
    }
  }

  // --- The rest of your component (including the return with UI) will follow below ---


  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <Breadcrumb items={breadcrumbItems} />
  
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Collect Listing Data</h1>
        <p className="text-primary-medium mt-2">
          Manage listing intake forms and documentation
        </p>
      </div>
  
      <Tabs defaultValue="forms" className="space-y-8">
        <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2">
            <TabsTrigger
              value="forms"
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Listing Intake Forms</span>
              </div>
              <p className="text-sm text-left">
                Use a form to submit new listings for approval
              </p>
            </TabsTrigger>
  
            <TabsTrigger
              value="documents"
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                <span className="font-medium">Document Management</span>
              </div>
              <p className="text-sm text-left">Track and organize property documents</p>
            </TabsTrigger>
          </div>
        </TabsList>
  
        {/* FORM UI */}
        <TabsContent value="forms">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit, onInvalid)}
              >
                {/* 🔹 Owner Details (matches FIELD_ORDER) */}
                <h3 className="text-lg font-semibold">Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ownerFullName */}
                  <div>
                    <Label htmlFor="ownerFullName">Full Name *</Label>
                    {(() => {
                      const { ref: nameRef, ...nameProps } = form.register("ownerFullName");
                      return (
                        <Input
                          {...nameProps}
                          ref={(el) => {
                            nameRef(el);
                            fieldRefs.current["ownerFullName"] = el;
                          }}
                          placeholder="Enter full name"
                          className={`focus:bg-white ${
                            form.watch("ownerFullName") ? "bg-white" : "bg-gray-50"
                          }`}
                        />
                      );
                    })()}
                    {form.formState.errors.ownerFullName && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.ownerFullName.message}
                      </p>
                    )}
                  </div>
  
                  {/* ownerEmail */}
                  <div>
                    <Label htmlFor="ownerEmail">Email *</Label>
                    {(() => {
                      const { ref: emailRef, ...emailProps } = form.register("ownerEmail");
                      return (
                        <Input
                          {...emailProps}
                          ref={(el) => {
                            emailRef(el);
                            fieldRefs.current["ownerEmail"] = el;
                          }}
                          type="email"
                          placeholder="Enter email address"
                          className={`focus:bg-white ${
                            form.watch("ownerEmail") ? "bg-white" : "bg-gray-50"
                          }`}
                        />
                      );
                    })()}
                    {form.formState.errors.ownerEmail && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.ownerEmail.message}
                      </p>
                    )}
                  </div>
  
                  {/* ownerPhoneNumber */}
                  <div>
                    <Label htmlFor="ownerPhoneNumber">Phone Number *</Label>
                    {(() => {
                      const { ref: phoneRef, ...phoneProps } = form.register("ownerPhoneNumber");
                      return (
                        <Input
                          {...phoneProps}
                          ref={(el) => {
                            phoneRef(el);
                            fieldRefs.current["ownerPhoneNumber"] = el;
                          }}
                          placeholder="Enter phone number"
                          className={`focus:bg-white ${
                            form.watch("ownerPhoneNumber") ? "bg-white" : "bg-gray-50"
                          }`}
                        />
                      );
                    })()}
                    {form.formState.errors.ownerPhoneNumber && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.ownerPhoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>
  
                {/* 🔹 Ownership Information */}
                <h3 className="text-lg font-semibold">Ownership Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* lookingTo */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="lookingTo">Owner is looking to *</Label>
                    <CustomSelect
                      value={form.watch("lookingTo") || ""}
                      onChange={(val) =>
                        form.setValue(
                          "lookingTo",
                          val as "Sell" | "Rent" | "Sell or Rent",
                          { shouldValidate: true }
                        )
                      }
                      options={["Sell", "Rent", "Sell or Rent"]}
                      placeholder="Select selling or renting"
                      error={!!form.formState.errors.lookingTo}
                      onTriggerRef={(el) => {
                        fieldRefs.current["lookingTo"] = el;
                      }}
                    />
                    {form.formState.errors.lookingTo && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.lookingTo.message}
                      </p>
                    )}
                  </div>
  
                  {/* askingPrice - conditionally rendered */}
                  {(!lookingToValue ||
                    lookingToValue === "Sell" ||
                    lookingToValue === "Sell or Rent") && (
                    <div className="space-y-2 max-w-md">
                      <Label htmlFor="askingPrice">Asking Price *</Label>
                      <Input
                        type="text"
                        value={localAskingPrice !== null ? localAskingPrice.toString() : ""}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                          setLocalAskingPrice(rawValue);
                        }}
                        onBlur={() => {
                          const numericValue = Number(localAskingPrice);
                          if (!isNaN(numericValue) && numericValue > 0) {
                            setLocalAskingPrice(formatCurrency(numericValue));
                            form.setValue("askingPrice", numericValue, { shouldValidate: true });
                          } else {
                            form.setValue("askingPrice", undefined, { shouldValidate: true });
                          }
                        }}
                        placeholder="Enter asking price"
                        ref={(el) => {
                          fieldRefs.current["askingPrice"] = el;
                        }}
                        className={`focus:bg-white ${localAskingPrice ? "bg-white" : "bg-gray-50"}`}
                      />
                    </div>
                  )}
  
                  {/* rentAskingPrice - conditionally rendered */}
                  {(lookingToValue === "Rent" || lookingToValue === "Sell or Rent") && (
                    <div className="space-y-2 max-w-md">
                      <Label htmlFor="rentAskingPrice">Rent Asking Price *</Label>
                      <Input
                        type="text"
                        value={localRentPrice !== null ? localRentPrice.toString() : ""}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                          setLocalRentPrice(rawValue);
                        }}
                        onBlur={() => {
                          const numericValue = Number(localRentPrice);
                          if (!isNaN(numericValue) && numericValue > 0) {
                            setLocalRentPrice(formatCurrency(numericValue));
                            form.setValue("rentAskingPrice", numericValue, { shouldValidate: true });
                          } else {
                            form.setValue("rentAskingPrice", undefined, { shouldValidate: true });
                          }
                        }}
                        placeholder="Enter rent asking price"
                        ref={(el) => {
                          fieldRefs.current["rentAskingPrice"] = el;
                        }}
                        className={`focus:bg-white ${localRentPrice ? "bg-white" : "bg-gray-50"}`}
                      />
                    </div>
                  )}
  
                  {/* ownershipStatus */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="ownershipStatus">Ownership Status *</Label>
                    <CustomSelect
                      value={form.watch("ownershipStatus") || ""}
                      onChange={(val) =>
                        form.setValue(
                          "ownershipStatus",
                          val as "Sole Owner" | "Co-Owned" | "Representing on behalf of owner",
                          { shouldValidate: true }
                        )
                      }
                      options={["Sole Owner", "Co-Owned", "Representing on behalf of owner"]}
                      placeholder="Select ownership status"
                      error={!!form.formState.errors.ownershipStatus}
                      onTriggerRef={(el) => {
                        fieldRefs.current["ownershipStatus"] = el;
                      }}
                    />
                    {form.formState.errors.ownershipStatus && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.ownershipStatus.message}
                      </p>
                    )}
                  </div>
  
                  {/* propertyType */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <CustomSelect
                      value={form.watch("propertyType") || ""}
                      onChange={(val) =>
                        form.setValue(
                          "propertyType",
                          val as "House" | "Apartment" | "Residential land" | "Commercial/Industrial",
                          { shouldValidate: true }
                        )
                      }
                      options={["House", "Apartment", "Residential land", "Commercial/Industrial"]}
                      placeholder="Select property type"
                      error={!!form.formState.errors.propertyType}
                      onTriggerRef={(el) => {
                        fieldRefs.current["propertyType"] = el;
                      }}
                    />
                    {form.formState.errors.propertyType && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.propertyType.message}
                      </p>
                    )}
                  </div>
  
                  {/* currentlyRented */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="currentlyRented">Currently Rented *</Label>
                    <CustomSelect
                      value={form.watch("currentlyRented") || ""}
                      onChange={(val) =>
                        form.setValue("currentlyRented", val as "Yes" | "No", { shouldValidate: true })
                      }
                      options={["Yes", "No"]}
                      placeholder="Select rental status"
                      error={!!form.formState.errors.currentlyRented}
                      onTriggerRef={(el) => {
                        fieldRefs.current["currentlyRented"] = el;
                      }}
                    />
                    {form.formState.errors.currentlyRented && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.currentlyRented.message}
                      </p>
                    )}
                  </div>
  
                  {/* monthlyRentalIncome - conditionally rendered */}
                  {currentlyRentedValue === "Yes" && (
                    <div className="space-y-2 max-w-md">
                      <Label htmlFor="monthlyRentalIncome">Monthly Rental Income</Label>
                      <Input
                        type="text"
                        value={localMonthlyRental !== null ? localMonthlyRental.toString() : ""}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                          setLocalMonthlyRental(rawValue);
                        }}
                        onBlur={() => {
                          const numericValue = Number(localMonthlyRental);
                          if (!isNaN(numericValue) && numericValue >= 0) {
                            setLocalMonthlyRental(formatCurrency(numericValue));
                            form.setValue("monthlyRentalIncome", numericValue, { shouldValidate: true });
                          } else {
                            setLocalMonthlyRental("");
                            form.setValue("monthlyRentalIncome", undefined, { shouldValidate: true });
                          }
                        }}
                        placeholder="Enter rental income"
                        ref={(el) => {
                          fieldRefs.current["monthlyRentalIncome"] = el;
                        }}
                        className={`focus:bg-white ${localMonthlyRental ? "bg-white" : "bg-gray-50"}`}
                      />
                    </div>
                  )}
                </div>
  
                {/* 🔹 Location Details */}
                <h3 className="text-lg font-semibold">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* town */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="town">Town</Label>
                    {(() => {
                      const { ref: tRef, ...tProps } = form.register("town");
                      return (
                        <Input
                          {...tProps}
                          ref={(el) => {
                            tRef(el);
                            fieldRefs.current["town"] = el;
                          }}
                          placeholder="Enter town"
                          className={`focus:bg-white ${form.watch("town") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                  </div>
  
                  {/* district */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="district">District *</Label>
                    {(() => {
                      const { ref: dRef, ...dProps } = form.register("district");
                      return (
                        <Input
                          {...dProps}
                          ref={(el) => {
                            dRef(el);
                            fieldRefs.current["district"] = el;
                          }}
                          placeholder="Enter district"
                          className={`focus:bg-white ${form.watch("district") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                    {form.formState.errors.district && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.district.message}
                      </p>
                    )}
                  </div>
  
                  {/* canton */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="canton">Canton *</Label>
                    {(() => {
                      const { ref: cRef, ...cProps } = form.register("canton");
                      return (
                        <Input
                          {...cProps}
                          ref={(el) => {
                            cRef(el);
                            fieldRefs.current["canton"] = el;
                          }}
                          placeholder="Enter canton"
                          className={`focus:bg-white ${form.watch("canton") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                    {form.formState.errors.canton && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.canton.message}
                      </p>
                    )}
                  </div>
  
                  {/* province */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="province">Province *</Label>
                    {(() => {
                      const { ref: pRef, ...pProps } = form.register("province");
                      return (
                        <Input
                          {...pProps}
                          ref={(el) => {
                            pRef(el);
                            fieldRefs.current["province"] = el;
                          }}
                          placeholder="Enter province"
                          className={`focus:bg-white ${form.watch("province") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                    {form.formState.errors.province && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.province.message}
                      </p>
                    )}
                  </div>
  
                  {/* location */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="location">Exact Location</Label>
                    {(() => {
                      const { ref: locRef, ...locProps } = form.register("location");
                      return (
                        <Input
                          {...locProps}
                          ref={(el) => {
                            locRef(el);
                            fieldRefs.current["location"] = el;
                          }}
                          placeholder="Enter coordinates or link to online map"
                          className={`focus:bg-white ${form.watch("location") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                  </div>
  
                  {/* communityType */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="communityType">Community Type *</Label>
                    <CustomSelect
                      id="communityType"
                      value={form.watch("communityType") || ""}
                      onChange={(val) =>
                        form.setValue(
                          "communityType",
                          val as "Close-gate" | "Open-gate" | "Tower" | "Not Applicable",
                          { shouldValidate: true }
                        )
                      }
                      options={["Close-gate", "Open-gate", "Tower", "Not Applicable"]}
                      placeholder="Select community type"
                      error={!!form.formState.errors.communityType}
                      onTriggerRef={(el) => {
                        fieldRefs.current["communityType"] = el;
                      }}
                    />
                    {form.formState.errors.communityType && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.communityType.message}
                      </p>
                    )}
                  </div>
  
                  {/* communityName - conditionally rendered */}
                  {(communityTypeValue && communityTypeValue !== "Not Applicable") && (
                    <div className="space-y-2 max-w-md">
                      <Label htmlFor="communityName">Community Name *</Label>
                      {(() => {
                        const { ref: commRef, ...commProps } = form.register("communityName");
                        return (
                          <Input
                            {...commProps}
                            ref={(el) => {
                              commRef(el);
                              fieldRefs.current["communityName"] = el;
                            }}
                            placeholder="Enter community name"
                            className={`focus:bg-white ${
                              form.watch("communityName") ? "bg-white" : "bg-gray-50"
                            } ${form.formState.errors.communityName ? "ring-2 ring-accent-gold-light" : ""}`}
                          />
                        );
                      })()}
                      {form.formState.errors.communityName && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.communityName.message}
                        </p>
                      )}
                    </div>
                  )}
  
                  {/* hoa - conditionally rendered */}
                  {(communityTypeValue && communityTypeValue !== "Not Applicable") && (
                    <div className="space-y-2 max-w-md">
                      <Label htmlFor="hoa">Maintenance quote (HOA fee) *</Label>
                      <Input
                        type="text"
                        value={localHoa !== null ? localHoa.toString() : ""}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                          setLocalHoa(rawValue);
                        }}
                        onBlur={() => {
                          const numericValue = Number(localHoa);
                          // 0 is allowed.
                          if (!isNaN(numericValue) && numericValue >= 0) {
                            setLocalHoa(formatCurrency(numericValue));
                            form.setValue("hoa", numericValue, { shouldValidate: true });
                          } else {
                            setLocalHoa("");
                            form.setValue("hoa", undefined, { shouldValidate: true });
                          }
                        }}
                        placeholder="Enter value in USD"
                        ref={(el) => {
                          fieldRefs.current["hoa"] = el;
                        }}
                        className={`focus:bg-white ${localHoa || localHoa === 0 ? "bg-white" : "bg-gray-50"}`}
                      />
                    </div>
                  )}
                </div>
  
                {/* 🔹 Property Details */}
                <h3 className="text-lg font-semibold">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* bedrooms */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    {(() => {
                      const { ref: bedRef, ...bedProps } = form.register("bedrooms", {
                        valueAsNumber: true,
                      });
                      return (
                        <Input
                          {...bedProps}
                          ref={(el) => {
                            bedRef(el);
                            fieldRefs.current["bedrooms"] = el;
                          }}
                          type="number"
                          min={1}
                          placeholder="Number of bedrooms"
                          className={`focus:bg-white ${form.watch("bedrooms") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                    {form.formState.errors.bedrooms && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.bedrooms.message}
                      </p>
                    )}
                  </div>
  
                  {/* bathrooms */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    {(() => {
                      const { ref: bRef, ...bProps } = form.register("bathrooms", {
                        valueAsNumber: true,
                      });
                      return (
                        <Input
                          {...bProps}
                          ref={(el) => {
                            bRef(el);
                            fieldRefs.current["bathrooms"] = el;
                          }}
                          type="number"
                          min={1}
                          placeholder="Number of bathrooms"
                          className={`focus:bg-white ${form.watch("bathrooms") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                    {form.formState.errors.bathrooms && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.bathrooms.message}
                      </p>
                    )}
                  </div>
  
                  {/* parkingSpaces */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="parkingSpaces">Parking Spaces *</Label>
                    {(() => {
                      const { ref: parkRef, ...parkProps } = form.register("parkingSpaces", {
                        valueAsNumber: true,
                      });
                      return (
                        <Input
                          {...parkProps}
                          ref={(el) => {
                            parkRef(el);
                            fieldRefs.current["parkingSpaces"] = el;
                          }}
                          type="number"
                          min={0}
                          placeholder="Number of parking spaces"
                          className={`focus:bg-white ${form.watch("parkingSpaces") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                    {form.formState.errors.parkingSpaces && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.parkingSpaces.message}
                      </p>
                    )}
                  </div>
  
                  {/* lotArea */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="lotArea">Lot Area</Label>
                    {(() => {
                      const { ref: lotRef, ...lotProps } = form.register("lotArea", {
                        valueAsNumber: true,
                      });
                      return (
                        <Input
                          {...lotProps}
                          ref={(el) => {
                            lotRef(el);
                            fieldRefs.current["lotArea"] = el;
                          }}
                          type="number"
                          placeholder="Enter lot area"
                          className={`focus:bg-white ${form.watch("lotArea") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                  </div>
  
                  {/* constructedArea */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="constructedArea">Constructed Area *</Label>
                    {(() => {
                      const { ref: conRef, ...conProps } = form.register("constructedArea", { valueAsNumber: true });
                      return (
                        <Input
                          {...conProps}
                          ref={(el) => {
                            conRef(el);
                            fieldRefs.current["constructedArea"] = el;
                          }}
                          type="number"
                          placeholder="Enter constructed area"
                          className={`focus:bg-white ${form.watch("constructedArea") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                    {form.formState.errors.constructedArea && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.constructedArea.message}
                      </p>
                    )}
                  </div>
  
                  {/* livableArea */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="livableArea">Livable Area</Label>
                    {(() => {
                      const { ref: livRef, ...livProps } = form.register("livableArea", { valueAsNumber: true });
                      return (
                        <Input
                          {...livProps}
                          ref={(el) => {
                            livRef(el);
                            fieldRefs.current["livableArea"] = el;
                          }}
                          type="number"
                          placeholder="Enter livable area"
                          className={`focus:bg-white ${form.watch("livableArea") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                  </div>
  
                  {/* areaMetricType */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="areaMetricType">Area Metric Type *</Label>
                    <CustomSelect
                      value={form.watch("areaMetricType") || ""}
                      onChange={(val) =>
                        form.setValue("areaMetricType", val as "Square Meter" | "Square Feet", { shouldValidate: true })
                      }
                      options={["Square Meter", "Square Feet"]}
                      placeholder="Select area unit"
                      error={!!form.formState.errors.areaMetricType}
                      onTriggerRef={(el) => {
                        fieldRefs.current["areaMetricType"] = el;
                      }}
                    />
                    {form.formState.errors.areaMetricType && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.areaMetricType.message}
                      </p>
                    )}
                  </div>
  
                  {/* yearBuilt */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    {(() => {
                      const { ref: ybRef, ...yProps } = form.register("yearBuilt", { valueAsNumber: true });
                      return (
                        <Input
                          {...yProps}
                          ref={(el) => {
                            ybRef(el);
                            fieldRefs.current["yearBuilt"] = el;
                          }}
                          type="number"
                          min={1800}
                          max={new Date().getFullYear()}
                          placeholder="Enter year built"
                          className={`focus:bg-white ${form.watch("yearBuilt") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                  </div>
  
                  {/* yearLastRenovated */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="yearLastRenovated">Year Last Renovated</Label>
                    {(() => {
                      const { ref: renRef, ...renProps } = form.register("yearLastRenovated", { valueAsNumber: true });
                      return (
                        <Input
                          {...renProps}
                          ref={(el) => {
                            renRef(el);
                            fieldRefs.current["yearLastRenovated"] = el;
                          }}
                          type="number"
                          min={1800}
                          max={new Date().getFullYear()}
                          placeholder="Enter last renovation year"
                          className={`focus:bg-white ${form.watch("yearLastRenovated") ? "bg-white" : "bg-gray-50"}`}
                        />
                      );
                    })()}
                  </div>
  
                  {/* existingMarketingAssets */}
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="existingMarketingAssets">Existing Marketing Assets *</Label>
                    <CustomSelect
                      value={form.watch("existingMarketingAssets") || ""}
                      onChange={(val) =>
                        form.setValue("existingMarketingAssets", val as "Yes" | "No", { shouldValidate: true })
                      }
                      options={["Yes", "No"]}
                      placeholder="Select option"
                      error={!!form.formState.errors.existingMarketingAssets}
                      onTriggerRef={(el) => {
                        fieldRefs.current["existingMarketingAssets"] = el;
                      }}
                    />
                    {form.formState.errors.existingMarketingAssets && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.existingMarketingAssets.message}
                      </p>
                    )}
                  </div>
                </div>
  
                {/* amenities */}
                <div className="space-y-2 max-w-full">
                  <Label htmlFor="amenities">Amenities & Features *</Label>
                  {(() => {
                    const { ref: amRef, ...amProps } = form.register("amenities");
                    return (
                      <Textarea
                        {...amProps}
                        ref={(el) => {
                          amRef(el);
                          fieldRefs.current["amenities"] = el;
                        }}
                        placeholder="List amenities and unique features"
                        className={`focus:bg-white ${form.watch("amenities") ? "bg-white" : "bg-gray-50"}`}
                      />
                    );
                  })()}
                  {form.formState.errors.amenities && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.amenities.message}
                    </p>
                  )}
                </div>
  
                {/* additionalNotes */}
                <div className="space-y-2 max-w-full">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  {(() => {
                    const { ref: notesRef, ...notesProps } = form.register("additionalNotes");
                    return (
                      <Textarea
                        {...notesProps}
                        ref={(el) => {
                          notesRef(el);
                          fieldRefs.current["additionalNotes"] = el;
                        }}
                        placeholder="Enter any extra details about the property"
                        className={`focus:bg-white ${form.watch("additionalNotes") ? "bg-white" : "bg-gray-50"}`}
                      />
                    );
                  })()}
                </div>
  
                {/* Submit button */}
                <div className="flex justify-end items-center gap-4">
                  {hasSubmitAttempt && !form.formState.isValid && (
                    <p className="text-red-500 text-sm font-medium">
                      ⚠️ Please check that all required fields are complete.
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit listing"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>
  
        <TabsContent value="documents" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-serif text-primary-dark mb-2">Document Management</h2>
                <p className="text-primary-medium">Track and manage required property documents</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort
                </Button>
              </div>
            </div>
  
            <div className="space-y-8">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Required Documents Checklist</h3>
                <div className="space-y-4">
                  {requiredDocs.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          doc.status === 'approved'
                            ? 'bg-green-100'
                            : doc.status === 'uploaded'
                            ? 'bg-yellow-100'
                            : 'bg-gray-100'
                        }`}>
                          {doc.status === 'approved' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : doc.status === 'uploaded' ? (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <FileCheck className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Type: {doc.type}</span>
                            {doc.uploadedAt && (
                              <span className="text-sm text-gray-600">• Uploaded: {doc.uploadedAt}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {doc.status === 'pending' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={() => handleUploadDocument(doc.id)}
                          >
                            <Upload className="h-4 w-4" />
                            Upload
                          </Button>
                        ) : doc.status === 'uploaded' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => handleViewDocument(doc.driveUrl)}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => handleApproveDocument(doc.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={() => handleViewDocument(doc.driveUrl)}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
  
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Document Storage</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Documents are stored securely in Google Drive and tracked through this interface.
                </p>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => window.open('https://drive.google.com', '_blank')}
                >
                  <FolderOpen className="h-4 w-4" />
                  Open Document Repository
                </Button>
              </Card>
            </div>
          </div>
        </TabsContent>

  
      </Tabs>

      {/* Success Modal */}
      <Dialog.Root open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <Dialog.Portal>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100]"> 
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-xl font-semibold">Success!</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>
              <p className="text-gray-700 mt-2">Your lead was successfully registered.</p>
              <Dialog.Close asChild>
                <button className="mt-4 w-full bg-accent-gold hover:bg-accent-gold-light text-primary-dark font-semibold py-2 rounded">
                  OK
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Error Modal */}
      <Dialog.Root open={showErrorModal} onOpenChange={setShowErrorModal}>
        <Dialog.Portal>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100]">
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-xl font-semibold text-red-600">Error</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>
              <p className="text-gray-700 mt-2">{apiError}</p>
              <Dialog.Close asChild>
                <button className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded">
                  OK
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}
