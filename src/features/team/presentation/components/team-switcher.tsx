"use client";

import { CaretDown, Building, Plus } from "@phosphor-icons/react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setActiveTeamAction } from "../actions";

type Team = {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
};

type Props = {
  teams: Team[];
  activeTeam: Team | null;
};

export function TeamSwitcher({ teams, activeTeam }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleSetActiveTeam = async (teamId: string) => {
    startTransition(async () => {
      await setActiveTeamAction(teamId);
      setOpen(false);
      router.refresh();
    });
  };

  const activeTeamDisplay = activeTeam || (teams.length > 0 ? teams[0] : null);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 bg-white dark:bg-zinc-950 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
      >
        <div className="flex items-center gap-2">
          {activeTeamDisplay?.logo ? (
            <img
              src={activeTeamDisplay.logo}
              alt={activeTeamDisplay.name}
              className="w-5 h-5 rounded"
            />
          ) : (
            <Building size={18} />
          )}
          <span>{activeTeamDisplay?.name || "Select Brand"}</span>
        </div>
        <CaretDown size={18} />
      </button>

      {open && (
        <div className="absolute mt-2 w-full rounded-xl border border-zinc-200 bg-white shadow-lg dark:bg-zinc-950 dark:border-zinc-800 z-50">
          {teams.length === 0 ? (
            <div className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-sm">
              No brands yet
            </div>
          ) : (
            teams.map((team) => (
              <button
                key={team.id}
                disabled={pending}
                onClick={() => handleSetActiveTeam(team.id)}
                className={`flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white ${
                  activeTeam?.id === team.id ? "bg-zinc-100 dark:bg-zinc-800" : ""
                }`}
              >
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-5 h-5 rounded"
                  />
                ) : (
                  <Building size={18} />
                )}
                {team.name}
              </button>
            ))
          )}
          <div className="border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard/brands");
              }}
              className="flex w-full items-center gap-2 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white"
            >
              <Plus size={18} />
              Manage Brands
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
