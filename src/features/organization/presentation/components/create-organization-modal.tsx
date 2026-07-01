"use client";

import { useState } from "react";

import { Button, Input, Label } from "@/components/ui";

import { createOrganizationAction } from "../actions";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CreateOrganizationModal({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Create Organization
        </h2>

        <form
          action={async (formData) => {
            await createOrganizationAction(formData);
            onClose();
          }}
          className="mt-6 space-y-4"
        >
          <div className="space-y-2">
            <Label required className="text-zinc-700 dark:text-zinc-300">
              Organization Name
            </Label>

            <Input
              name="name"
              placeholder="Acme Studio"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}