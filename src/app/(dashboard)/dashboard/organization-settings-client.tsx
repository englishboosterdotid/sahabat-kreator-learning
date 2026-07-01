"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, CheckCircle, XCircle } from "@phosphor-icons/react";
import { updateOrganizationAction, deleteOrganizationAction } from "@/features/organization/presentation/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Organization = {
  id: string;
  name: string;
};

type Props = {
  initialOrganization: Organization; // must be non-null; callers are responsible for guarding
};

export function OrganizationSettingsClient({ initialOrganization }: Props) {
  const [organization, setOrganization] = useState(initialOrganization);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(initialOrganization.name);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Clear success/error after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleUpdateOrganization = async () => {
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await updateOrganizationAction(organization.id, editName);
        setSuccess("Organization updated successfully!");
        setOrganization({ ...organization, name: editName });
        setIsEditing(false);
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to update organization");
      }
    });
  };

  const handleDeleteOrganization = async () => {
    if (!confirm("Are you sure you want to delete this organization? This action cannot be undone.")) return;
    
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await deleteOrganizationAction(organization.id);
        setSuccess("Organization deleted successfully!");
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Failed to delete organization");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Success/Error Messages - Toast-like */}
      {success && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl shadow-lg dark:text-green-400 dark:bg-green-900/20">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl shadow-lg dark:text-red-400 dark:bg-red-900/20">
          <XCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Organization Settings
        </h1>
        {!isEditing && (
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            <Pencil size={18} className="mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Organization Form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Organization Details
        </h2>
        
        {isEditing ? (
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => {
                setIsEditing(false);
                setEditName(organization.name);
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateOrganization} disabled={isPending}>
                {isPending ? "Updating..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">
              Organization Name: <span className="text-zinc-900 dark:text-white font-medium">{organization.name}</span>
            </p>
          </div>
        )}
      </div>

      {/* Delete Section */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
        <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
          Danger Zone
        </h2>
        <p className="text-red-600 dark:text-red-400 mb-4">
          Deleting this organization will remove all data associated with it, including brands, members, and content. This action cannot be undone.
        </p>
        <Button
          variant="secondary"
          onClick={handleDeleteOrganization}
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Trash size={18} className="mr-2" />
          {isPending ? "Deleting..." : "Delete Organization"}
        </Button>
      </div>
    </div>
  );
}
