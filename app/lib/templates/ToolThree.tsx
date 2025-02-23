// app/lib/templates/TooThree.tsx
"use client";

import React, { useRef } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  FieldArrayRenderProps,
  FormikHelpers,
  FormikErrors,
} from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

// --------------------------------------------------------------------------
// Utility: Currency Formatting
// --------------------------------------------------------------------------
const formatCurrency = (value: number | string): string => {
  if (!value || isNaN(Number(value))) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
};

// --------------------------------------------------------------------------
// Types for Form Values
// --------------------------------------------------------------------------
interface ToolOneValues {
  fieldOne: string;             // Normal text input
  fieldTwo: number | string;    // Normal value field (currency formatting)
  fieldThree: string;           // Telephone field
  fieldFour: string;            // Email field
  fieldFive: string;            // Long text input
  fieldSix: string;             // Dropdown single select field
  fieldSeven: string[];         // Multiple checkbox select field
  fieldEight: boolean;          // Single checkbox field
  fieldNine: number;            // Value slider field
}

// --------------------------------------------------------------------------
// Custom Field Components
// --------------------------------------------------------------------------

// 1. Currency Input Component
interface CurrencyInputProps {
  field: any;
  form: any;
  placeholder?: string;
}
const CurrencyInput: React.FC<CurrencyInputProps> = ({ field, form, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, "");
    form.setFieldValue(field.name, rawValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const numericValue = Number(e.target.value);
    if (!isNaN(numericValue) && numericValue > 0) {
      form.setFieldValue(field.name, numericValue);
    } else {
      form.setFieldValue(field.name, "");
    }
    field.onBlur(e);
  };

  return (
    <div>
      <input
        {...field}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        className="form-input border border-primary-dark p-2 rounded w-full"
      />
      {form.touched[field.name] && form.errors[field.name] && (
        <div className="text-red-500 text-sm">{form.errors[field.name]}</div>
      )}
    </div>
  );
};

// 2. Custom Select Component (for single select dropdowns)
interface CustomSelectProps {
  field: any;
  form: any;
  options: string[];
  placeholder: string;
}
const CustomSelect: React.FC<CustomSelectProps> = ({ field, form, options, placeholder }) => {
  return (
    <div>
      <select
        {...field}
        className="form-select border border-primary-dark p-2 rounded w-full"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {form.touched[field.name] && form.errors[field.name] && (
        <div className="text-red-500 text-sm">{form.errors[field.name]}</div>
      )}
    </div>
  );
};

// 3. Checkbox Group for multiple selections
interface CheckboxGroupProps {
  label: string;
  name: string;
  options: string[];
}
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, name, options }) => {
  return (
    <div className="mb-4">
      <label className="block font-bold mb-1">{label}</label>
      <FieldArray
        name={name}
        render={(arrayHelpers: FieldArrayRenderProps) => (
          <div>
            {options.map((option) => (
              <label key={option} className="mr-4">
                <input
                  name={name}
                  type="checkbox"
                  value={option}
                  checked={arrayHelpers.form.values[name].includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) arrayHelpers.push(option);
                    else {
                      const idx = arrayHelpers.form.values[name].indexOf(option);
                      arrayHelpers.remove(idx);
                    }
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        )}
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
    </div>
  );
};

// --------------------------------------------------------------------------
// ToolOne: Reusable Form Template Component
// --------------------------------------------------------------------------
const ToolOne: React.FC = () => {
  // Refs for custom error focusing.
  // We allow the ref to be for an input, textarea, or select element.
  const fieldRefs: Record<keyof ToolOneValues, React.RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>> = {
    fieldOne: useRef<HTMLInputElement>(null),
    fieldTwo: useRef<HTMLInputElement>(null),
    fieldThree: useRef<HTMLInputElement>(null),
    fieldFour: useRef<HTMLInputElement>(null),
    fieldFive: useRef<HTMLTextAreaElement>(null),
    fieldSix: useRef<HTMLSelectElement>(null),
    fieldSeven: useRef<HTMLInputElement>(null), // For array-based fields, you might focus the first checkbox if needed.
    fieldEight: useRef<HTMLInputElement>(null),
    fieldNine: useRef<HTMLInputElement>(null),
  };

  // Order in which errors are focused.
  const errorFocusOrder: (keyof ToolOneValues)[] = [
    "fieldOne",
    "fieldTwo",
    "fieldThree",
    "fieldFour",
    "fieldFive",
    "fieldSix",
    "fieldSeven",
    "fieldEight",
    "fieldNine",
  ];

  // Yup validation schema.
  const validationSchema = Yup.object({
    fieldOne: Yup.string().required("Field One is required"),
    fieldTwo: Yup.number()
      .typeError("Field Two must be a number")
      .min(0, "Must be at least 0")
      .required("Field Two is required"),
    fieldThree: Yup.string()
      .required("Field Three (Telephone) is required")
      .matches(/^[0-9+\-\s()]*$/, "Invalid telephone number"),
    fieldFour: Yup.string().email("Invalid email address").required("Field Four (Email) is required"),
    fieldFive: Yup.string().required("Field Five (Long Text) is required"),
    fieldSix: Yup.string().required("Field Six is required"),
    fieldSeven: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one option for Field Seven"),
    fieldEight: Yup.boolean().oneOf([true], "Field Eight must be checked"),
    fieldNine: Yup.number()
      .min(0, "Minimum value is 0")
      .max(100, "Maximum value is 100")
      .required("Field Nine is required"),
  });

  // Initial values.
  const initialValues: ToolOneValues = {
    fieldOne: "",
    fieldTwo: "",
    fieldThree: "",
    fieldFour: "",
    fieldFive: "",
    fieldSix: "",
    fieldSeven: [],
    fieldEight: false,
    fieldNine: 50,
  };

  // Focus first error function.
  const focusFirstError = (errors: FormikErrors<ToolOneValues>) => {
    for (const field of errorFocusOrder) {
      // Check that an error exists and that it is a string (skipping array errors)
      if (errors[field] && typeof errors[field] === "string" && fieldRefs[field] && fieldRefs[field].current) {
        fieldRefs[field].current.focus();
        break;
      }
    }
  };

  // Render the form.
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg font-sans text-primary-dark">
      <Formik<ToolOneValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (
          values: ToolOneValues,
          actions: FormikHelpers<ToolOneValues>
        ) => {
          const errors = await actions.validateForm();
          if (Object.keys(errors).length > 0) {
            focusFirstError(errors);
            actions.setSubmitting(false);
            return;
          }
          // Simulate submission logic (e.g., integrate with Airtable API here)
          console.log("Submitting values:", values);
          toast.success("Form submitted successfully!");
          actions.resetForm();
          actions.setSubmitting(false);
        }}
        validateOnBlur
        validateOnChange
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Field One: Normal Text Input */}
            <div>
              <label htmlFor="fieldOne" className="block font-bold mb-1">
                Field One
              </label>
              <Field
                id="fieldOne"
                name="fieldOne"
                type="text"
                placeholder="Enter text..."
                innerRef={fieldRefs.fieldOne}
                className="form-input border p-2 rounded w-full"
              />
              <ErrorMessage name="fieldOne" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Field Two: Value Field with Currency Formatting */}
            <div>
              <label htmlFor="fieldTwo" className="block font-bold mb-1">
                Field Two
              </label>
              <Field
                name="fieldTwo"
                component={CurrencyInput}
                placeholder="Enter value..."
                innerRef={fieldRefs.fieldTwo}
              />
              <ErrorMessage name="fieldTwo" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Field Three: Telephone Field */}
            <div>
              <label htmlFor="fieldThree" className="block font-bold mb-1">
                Field Three (Telephone)
              </label>
              <Field
                id="fieldThree"
                name="fieldThree"
                type="tel"
                placeholder="Enter telephone number..."
                innerRef={fieldRefs.fieldThree}
                className="form-input border p-2 rounded w-full"
              />
              <ErrorMessage name="fieldThree" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Field Four: Email Field */}
            <div>
              <label htmlFor="fieldFour" className="block font-bold mb-1">
                Field Four (Email)
              </label>
              <Field
                id="fieldFour"
                name="fieldFour"
                type="email"
                placeholder="Enter email address..."
                innerRef={fieldRefs.fieldFour}
                className="form-input border p-2 rounded w-full"
              />
              <ErrorMessage name="fieldFour" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Field Five: Long Text Input */}
            <div>
              <label htmlFor="fieldFive" className="block font-bold mb-1">
                Field Five (Long Text)
              </label>
              <Field
                as="textarea"
                id="fieldFive"
                name="fieldFive"
                placeholder="Enter detailed text..."
                innerRef={fieldRefs.fieldFive}
                className="form-textarea border p-2 rounded w-full h-24"
              />
              <ErrorMessage name="fieldFive" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Field Six: Dropdown Single Select */}
            <div>
              <label htmlFor="fieldSix" className="block font-bold mb-1">
                Field Six (Dropdown)
              </label>
              <Field
                name="fieldSix"
                component={CustomSelect}
                placeholder="Select an option"
                options={["Option 1", "Option 2", "Option 3"]}
                innerRef={fieldRefs.fieldSix}
              />
              <ErrorMessage name="fieldSix" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Field Seven: Multiple Checkbox Select */}
            <div>
              <CheckboxGroup
                label="Field Seven (Multiple Checkbox)"
                name="fieldSeven"
                options={["Option A", "Option B", "Option C"]}
              />
            </div>

            {/* Field Eight: Single Checkbox */}
            <div>
              <label className="block font-bold mb-1">
                <Field
                  type="checkbox"
                  name="fieldEight"
                  innerRef={fieldRefs.fieldEight}
                  className="mr-2"
                />
                Field Eight (Single Checkbox)
              </label>
              <ErrorMessage name="fieldEight" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Field Nine: Value Slider */}
            <div>
              <label htmlFor="fieldNine" className="block font-bold mb-1">
                Field Nine (Slider: 0-100)
              </label>
              <Field
                id="fieldNine"
                name="fieldNine"
                type="range"
                min="0"
                max="100"
                innerRef={fieldRefs.fieldNine}
                className="w-full"
              />
              <div className="text-sm mt-1">Value: {values.fieldNine}</div>
              <ErrorMessage name="fieldNine" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent-gold hover:bg-accent-gold-light text-primary-dark font-bold py-2 px-4 rounded"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ToolOne;
