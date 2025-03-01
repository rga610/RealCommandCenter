"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface OutcomeModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  type: "success" | "error";
  message: string;
}

export default function OutcomeModal({ isOpen, onClose, type, message }: OutcomeModalProps) {
  const isSuccess = type === "success";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <Dialog.Content className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <Dialog.Title className={`text-xl font-semibold ${isSuccess ? "text-primary-dark" : "text-red-600"}`}>
                {isSuccess ? "Success!" : "Error"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            <p className="text-gray-700 mt-2">{message}</p>
            <Dialog.Close asChild>
              <button
                className={`mt-4 w-full font-semibold py-2 rounded ${
                  isSuccess
                    ? "bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                OK
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
