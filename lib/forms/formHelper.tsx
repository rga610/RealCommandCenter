"use client";

import React, { useState } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  UseFormRegister,
  Control,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OutcomeModal from "@/components/forms/OutcomeModals";
import type { ZodType } from "zod";

export interface FormHelperProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>; // <-- use DefaultValues<T>
  onSubmit: (data: T) => Promise<void>;
  fieldMapping?: Record<string, string>;
  className?: string;

  /**
   * Render-prop for custom fields, receiving react-hook-form methods.
   */
  children: (formMethods: {
    register: UseFormRegister<T>;
    control: Control<T>;
    errors: FieldErrors<T>;
    watch: UseFormWatch<T>;
    setValue: UseFormSetValue<T>;
  }) => React.ReactNode;
}

export default function FormHelper<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  fieldMapping,
  className,
  children,
}: FormHelperProps<T>) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    shouldFocusError: true,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmitHandler: SubmitHandler<T> = async (data) => {
    try {
      await onSubmit(data);
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)} className={className}>
        {children({ register, control, errors, watch, setValue })}
      </form>

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
