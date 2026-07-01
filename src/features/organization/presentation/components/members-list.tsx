"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, Envelope, UserPlus, CheckCircle, XCircle, Clock } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { inviteMemberAction, removeMemberAction, cancelInvitationAction, updateMemberRoleAction } from "../actions";

type Member = {
  id: string;
  organizationId: string;
  role: "member" | "admin" | "owner";
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
};

type Invitation = {
  id: string;
  email: string;
  role?: string;
  status: string;
  createdAt: Date;
  expiresAt: Date;
  inviterId: string;
};

type Props = {
  initialMembers: Member[];
  initialInvitations: Invitation[];
};

export function MembersList({ initialMembers, initialInvitations }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Update state when props change (after switching organization)
  useEffect(() => {
    setMembers(initialMembers);
    // Filter invitations: only accepted with role member
    const filteredInvitations = initialInvitations.filter(
      (inv) => 
        inv.status.toLowerCase() === "accepted" && 
        (inv.role?.toLowerCase() === "member" || !inv.role)
    );
    setInvitations(filteredInvitations);
  }, [initialMembers, initialInvitations]);

  const handleInvite = async (formData: FormData) => {
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await inviteMemberAction(formData);
        setSuccess("Invitation sent successfully!");
        router.refresh();
      } catch (err: any) {
        if (err?.message?.includes("already")) {
          setError("This user has already been invited");
        } else {
          setError("Failed to send invitation");
        }
      }
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        await removeMemberAction(memberId);
        setMembers(members.filter((m) => m.id !== memberId));
        setSuccess("Member removed successfully!");
        router.refresh();
      } catch (err: any) {
        setError(err?.message || "Failed to remove member");
      }
    });
  };

  const handleCancelInvitation = async (invitationId: string) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        await cancelInvitationAction(invitationId);
        setInvitations(invitations.filter((i) => i.id !== invitationId));
        setSuccess("Invitation cancelled successfully!");
        router.refresh();
      } catch (err: any) {
        setError(err?.message || "Failed to cancel invitation");
      }
    });
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        await updateMemberRoleAction(memberId, newRole);
        setMembers(members.map((m) => 
          m.id === memberId ? { ...m, role: newRole as any } : m
        ));
        setSuccess("Role updated successfully!");
        router.refresh();
      } catch (err: any) {
        setError(err?.message || "Failed to update role");
        // Reset the select to original value on error
        router.refresh();
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === "pending") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full dark:text-yellow-400 dark:bg-yellow-900/20">
          <Clock size={12} />
          Pending
        </span>
      );
    } else if (statusLower === "accepted") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full dark:text-green-400 dark:bg-green-900/20">
          <CheckCircle size={12} />
          Accepted
        </span>
      );
    } else if (statusLower === "cancelled" || statusLower === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full dark:text-red-400 dark:bg-red-900/20">
          <XCircle size={12} />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 bg-zinc-50 px-2 py-1 rounded-full dark:text-zinc-400 dark:bg-zinc-900/20">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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

      {/* Invite Form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Invite Member
        </h2>
        <form action={handleInvite} className="flex flex-wrap gap-4">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2 min-w-[150px]">
            <Label htmlFor="role" className="text-zinc-700 dark:text-zinc-300">
              Role
            </Label>
            <select
                id="role"
                name="role"
                defaultValue="member"
                className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
          </div>
          <div className="flex-end">
            <Button type="submit" disabled={isPending} className="h-10">
              <UserPlus size={18} className="mr-2" />
              {isPending ? "Inviting..." : "Invite"}
            </Button>
          </div>
        </form>
      </div>

      {/* Members List */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Organization Members
        </h2>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {member.user?.image && <AvatarImage src={member.user.image} alt={member.user?.name || ""} />}
                  <AvatarFallback>{member.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {member.user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {member.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={member.role}
                  onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                  className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invitations List */}
      {invitations.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Invitations
          </h2>
          <div className="space-y-4">
            {invitations.map((invitation) => {
              const isCanceled = invitation.status.toLowerCase() === "cancelled" || invitation.status.toLowerCase() === "canceled";
              
              return (
                <div key={invitation.id} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Envelope size={18} className="text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {invitation.email}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {invitation.role || "member"}
                        </p>
                        {getStatusBadge(invitation.status)}
                      </div>
                    </div>
                  </div>
                  {isCanceled ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={async () => {
                        const formData = new FormData();
                        formData.append("email", invitation.email);
                        formData.append("role", invitation.role || "member");
                        await handleInvite(formData);
                      }}
                    >
                      <UserPlus size={18} className="mr-2" />
                      Invite
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancelInvitation(invitation.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash size={18} />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
