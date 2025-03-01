// app/lib/forms/CollectListingForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CustomSelect from "@/components/default/CustomSelect";
import { Form } from "@/components/default/form";
import { Input } from "@/components/default/input";
import { Button } from "@/components/default/button";
import { Textarea } from "@/components/default/textarea";
import { Label } from "@/components/default/label";
import { toast } from "sonner";
// Import icons only if needed inside this form (not used directly here)
import {
  FileText,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ArrowUpRight,
} from "lucide-react";

// ------------------------------------------------------------------
// Helper function: turns NaN or non-number values into undefined.
function parseOptionalNumber(val: unknown) {
  if (typeof val !== "number" || Number.isNaN(val)) {
    return undefined;
  }
  return val;
}

// ------------------------------------------------------------------
// Define the form schema using zod.
const formSchema = z
  .object({
    id: z.string().optional(),

    // Owner Details
    ownerFullName: z.string().min(1, "Owner full name is required"),
    ownerEmail: z.string().email("Valid email is required"),
    ownerPhoneNumber: z.string().min(1, "Phone number is required"),

    // Selling & Ownership Info
    lookingTo: z.enum(["Sell", "Rent", "Sell or Rent"]),
    askingPrice: z.preprocess(parseOptionalNumber, z.number().optional()),
    rentAskingPrice: z.preprocess(parseOptionalNumber, z.number().optional()),
    ownershipStatus: z.enum(["Sole Owner", "Co-Owned", "Representing on behalf of owner"]),
    propertyType: z.enum(["House", "Apartment", "Residential land", "Commercial/Industrial"]),
    currentlyRented: z.enum(["Yes", "No"]),
    monthlyRentalIncome: z.preprocess(parseOptionalNumber, z.number().optional()),

    // Location Info
    town: z.string().optional(),
    district: z.string().min(1, "District is required"),
    canton: z.string().min(1, "Canton is required"),
    province: z.string().min(1, "Province is required"),
    location: z.string().optional(),
    communityType: z.enum(["Close-gate", "Open-gate", "Tower", "Not Applicable"]),
    communityName: z.string().optional(),
    hoa: z.preprocess(parseOptionalNumber, z.number().optional()),

    // Property Details
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

    // Additional Property Info
    existingMarketingAssets: z.enum(["Yes", "No"]),
    amenities: z.string().min(1, "Please provide amenities & features"),
    additionalNotes: z.string().optional(),
  })
  // If lookingTo is Sell or Sell or Rent, askingPrice must be provided and > 0.
  .refine(
    (data) => {
      if (data.lookingTo === "Sell" || data.lookingTo === "Sell or Rent") {
        return data.askingPrice !== undefined && data.askingPrice > 0;
      }
      return true;
    },
    {
      message: "Asking Price is required and must be > 0 when selling.",
      path: ["askingPrice"],
    }
  )
  // If lookingTo is Rent or Sell or Rent, rentAskingPrice must be provided and > 0.
  .refine(
    (data) => {
      if (data.lookingTo === "Rent" || data.lookingTo === "Sell or Rent") {
        return data.rentAskingPrice !== undefined && data.rentAskingPrice > 0;
      }
      return true;
    },
    {
      message: "Rent Asking Price is required and must be > 0 when renting.",
      path: ["rentAskingPrice"],
    }
  )
  // If communityType is not "Not Applicable", communityName is required.
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
  // If communityType is not "Not Applicable", hoa must be provided (0 is allowed).
  .refine(
    (data) => {
      if (data.communityType && data.communityType !== "Not Applicable") {
        return data.hoa !== undefined;
      }
      return true;
    },
    {
      message:
        "Maintenance/HOA fee is required when communityType is not 'Not Applicable'.",
      path: ["hoa"],
    }
  );

// ------------------------------------------------------------------
// The form component.
const CollectListingForm: React.FC = () => {
  // Initialize the form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    shouldFocusError: false, // We'll manually focus errors.
    shouldUnregister: true,  // Hidden fields are unregistered.
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

  // Define the global order for focusing on errors.
  const FIELD_ORDER: (keyof z.infer<typeof formSchema>)[] = [
    "ownerFullName",
    "ownerEmail",
    "ownerPhoneNumber",
    "lookingTo",
    "askingPrice",
    "rentAskingPrice",
    "ownershipStatus",
    "propertyType",
    "currentlyRented",
    "monthlyRentalIncome",
    "town",
    "district",
    "canton",
    "province",
    "location",
    "communityType",
    "communityName",
    "hoa",
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
    "amenities",
    "additionalNotes",
  ];

  // We'll store refs for each field.
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  // Watch values for conditional rendering.
  const lookingToValue = form.watch("lookingTo");
  const currentlyRentedValue = form.watch("currentlyRented");
  const communityTypeValue = form.watch("communityType");

  // Conditional resets (run only if the field currently has a value)
  useEffect(() => {
    if (
      !(lookingToValue === undefined || lookingToValue === "Sell" || lookingToValue === "Sell or Rent") &&
      form.getValues("askingPrice") !== undefined
    ) {
      form.setValue("askingPrice", undefined, { shouldValidate: true });
    }
  }, [lookingToValue, form]);

  useEffect(() => {
    if (
      !(lookingToValue === "Rent" || lookingToValue === "Sell or Rent") &&
      form.getValues("rentAskingPrice") !== undefined
    ) {
      form.setValue("rentAskingPrice", undefined, { shouldValidate: true });
    }
  }, [lookingToValue, form]);

  useEffect(() => {
    if (currentlyRentedValue !== "Yes" && form.getValues("monthlyRentalIncome") !== undefined) {
      form.setValue("monthlyRentalIncome", undefined);
    }
  }, [currentlyRentedValue, form]);

  useEffect(() => {
    if (!(communityTypeValue && communityTypeValue !== "Not Applicable")) {
      form.setValue("communityName", "");
      form.setValue("hoa", undefined);
    }
  }, [communityTypeValue, form]);

  // Local state for currency formatting.
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

  // onSubmit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // (Your submission logic here—for testing, we assume submission is successful.)
      toast.success("🎉 Listing intake form submitted successfully!");
      // For now, comment out reset so we can see the submitted values.
      // form.reset();
      // form.clearErrors();
      // setLocalAskingPrice("");
      // setLocalRentPrice("");
    } catch (error: any) {
      toast.error(error.message || "An error occurred while submitting.");
    }
  }

  // onInvalid: focus the first field with an error.
  async function onInvalid(errors: FieldErrors<z.infer<typeof formSchema>>) {
    for (const fieldName of FIELD_ORDER) {
      if (errors[fieldName]) {
        const el = fieldRefs.current[fieldName];
        if (el && typeof el.focus === "function") {
          el.focus();
          break;
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // Return the form UI.
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          {/* OWNER DETAILS */}
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
                    className={`focus:bg-white ${form.watch("ownerFullName") ? "bg-white" : "bg-gray-50"}`}
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
                    className={`focus:bg-white ${form.watch("ownerEmail") ? "bg-white" : "bg-gray-50"}`}
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
                    className={`focus:bg-white ${form.watch("ownerPhoneNumber") ? "bg-white" : "bg-gray-50"}`}
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

          {/* OWNERSHIP INFORMATION */}
          <h3 className="text-lg font-semibold">Ownership Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* lookingTo */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="lookingTo">Owner is looking to *</Label>
              <CustomSelect
                value={form.watch("lookingTo") || ""}
                onChange={(val) =>
                  form.setValue("lookingTo", val as "Sell" | "Rent" | "Sell or Rent", { shouldValidate: true })
                }
                options={["Sell", "Rent", "Sell or Rent"]}
                placeholder="Select selling or renting"
                error={!!form.formState.errors.lookingTo}
                onTriggerRef={(el) => {
                  fieldRefs.current["lookingTo"] = el;
                }}
              />
              {form.formState.errors.lookingTo && (
                <p className="text-sm text-red-500">{form.formState.errors.lookingTo.message}</p>
              )}
            </div>

            {/* askingPrice */}
            {(!lookingToValue || lookingToValue === "Sell" || lookingToValue === "Sell or Rent") && (
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

            {/* rentAskingPrice */}
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
                  form.setValue("ownershipStatus", val as "Sole Owner" | "Co-Owned" | "Representing on behalf of owner", { shouldValidate: true })
                }
                options={["Sole Owner", "Co-Owned", "Representing on behalf of owner"]}
                placeholder="Select ownership status"
                error={!!form.formState.errors.ownershipStatus}
                onTriggerRef={(el) => {
                  fieldRefs.current["ownershipStatus"] = el;
                }}
              />
              {form.formState.errors.ownershipStatus && (
                <p className="text-sm text-red-500">{form.formState.errors.ownershipStatus.message}</p>
              )}
            </div>

            {/* propertyType */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="propertyType">Property Type *</Label>
              <CustomSelect
                value={form.watch("propertyType") || ""}
                onChange={(val) =>
                  form.setValue("propertyType", val as "House" | "Apartment" | "Residential land" | "Commercial/Industrial", { shouldValidate: true })
                }
                options={["House", "Apartment", "Residential land", "Commercial/Industrial"]}
                placeholder="Select property type"
                error={!!form.formState.errors.propertyType}
                onTriggerRef={(el) => {
                  fieldRefs.current["propertyType"] = el;
                }}
              />
              {form.formState.errors.propertyType && (
                <p className="text-sm text-red-500">{form.formState.errors.propertyType.message}</p>
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
                <p className="text-sm text-red-500">{form.formState.errors.currentlyRented.message}</p>
              )}
            </div>

            {/* monthlyRentalIncome */}
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

          {/* LOCATION DETAILS */}
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
                <p className="text-sm text-red-500">{form.formState.errors.district.message}</p>
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
                <p className="text-sm text-red-500">{form.formState.errors.canton.message}</p>
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
                <p className="text-sm text-red-500">{form.formState.errors.province.message}</p>
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
                  form.setValue("communityType", val as "Close-gate" | "Open-gate" | "Tower" | "Not Applicable", { shouldValidate: true })
                }
                options={["Close-gate", "Open-gate", "Tower", "Not Applicable"]}
                placeholder="Select community type"
                error={!!form.formState.errors.communityType}
                onTriggerRef={(el) => {
                  fieldRefs.current["communityType"] = el;
                }}
              />
              {form.formState.errors.communityType && (
                <p className="text-sm text-red-500">{form.formState.errors.communityType.message}</p>
              )}
            </div>

            {/* communityName */}
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
                      className={`focus:bg-white ${form.watch("communityName") ? "bg-white" : "bg-gray-50"} ${
                        form.formState.errors.communityName ? "ring-2 ring-accent-gold-light" : ""
                      }`}
                    />
                  );
                })()}
                {form.formState.errors.communityName && (
                  <p className="text-sm text-red-500">{form.formState.errors.communityName.message}</p>
                )}
              </div>
            )}

            {/* hoa */}
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

          {/* PROPERTY DETAILS */}
          <h3 className="text-lg font-semibold">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* bedrooms */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              {(() => {
                const { ref: bedRef, ...bedProps } = form.register("bedrooms", { valueAsNumber: true });
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
                <p className="text-sm text-red-500">{form.formState.errors.bedrooms.message}</p>
              )}
            </div>

            {/* bathrooms */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              {(() => {
                const { ref: bRef, ...bProps } = form.register("bathrooms", { valueAsNumber: true });
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
                <p className="text-sm text-red-500">{form.formState.errors.bathrooms.message}</p>
              )}
            </div>

            {/* parkingSpaces */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="parkingSpaces">Parking Spaces *</Label>
              {(() => {
                const { ref: parkRef, ...parkProps } = form.register("parkingSpaces", { valueAsNumber: true });
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
                <p className="text-sm text-red-500">{form.formState.errors.parkingSpaces.message}</p>
              )}
            </div>

            {/* lotArea */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="lotArea">Lot Area</Label>
              {(() => {
                const { ref: lotRef, ...lotProps } = form.register("lotArea", { valueAsNumber: true });
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
                <p className="text-sm text-red-500">{form.formState.errors.constructedArea.message}</p>
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
                <p className="text-sm text-red-500">{form.formState.errors.areaMetricType.message}</p>
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
                <p className="text-sm text-red-500">{form.formState.errors.existingMarketingAssets.message}</p>
              )}
            </div>
          </div>

          {/* ADDITIONAL */}
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
              <p className="text-sm text-red-500">{form.formState.errors.amenities.message}</p>
            )}
          </div>

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

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end items-center gap-4">
            {form.formState.isSubmitted && !form.formState.isValid && (
              <p className="text-red-500 text-sm font-medium">
                ⚠️ Please check that all required fields are complete.
              </p>
            )}
            <Button
              type="submit"
              className="w-full md:w-auto bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit listing"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};  

export default CollectListingForm;
