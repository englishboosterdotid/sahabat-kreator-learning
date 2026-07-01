"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { switchOrganizationAction } from "../actions";
import { Plus } from "@phosphor-icons/react";
import { CreateOrganizationModal } from "./create-organization-modal";

type Organization = {
  id: string;
  name: string;
};

type Props = {
  organizations: Organization[];
  activeOrganizationId: string | null;
};

export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();
  const active =
    organizations.find(
      (item) => item.id === activeOrganizationId
    ) ?? organizations[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 bg-white dark:bg-zinc-950 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
      >
        <span>{active?.name}</span>

        <CaretDown size={18} />
      </button>

      {open && (
        <div className="absolute mt-2 w-full rounded-xl border border-zinc-200 bg-white shadow-lg dark:bg-zinc-950 dark:border-zinc-800 z-50">
          {organizations.map((organization) => (
            <button
              key={organization.id}
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await switchOrganizationAction(
                    organization.id
                  );

                  setOpen(false);
                  router.refresh();
                })
              }
              className="block w-full px-4 py-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white"
            >
              {organization.name}
            </button>
          ))}
          <div className="border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => {
                setOpen(false);
                setCreateOpen(true);
              }}
              className="flex w-full items-center gap-2 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white"
            >
              <Plus size={18} />
              New Organization
            </button>
          </div>
        </div>
      )}
      <CreateOrganizationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}