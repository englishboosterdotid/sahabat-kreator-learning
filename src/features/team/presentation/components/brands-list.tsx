"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@/components/ui";
import { Trash, Plus, CheckCircle, XCircle, Building, Users, UserMinus, UserPlus, Pencil, X, Envelope } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createTeamAction, deleteTeamAction, addTeamMemberAction, removeTeamMemberAction, updateTeamMemberRoleAction, updateTeamAction, inviteTeamMemberAction, cancelTeamInvitationAction } from "../actions";
import { getTeamRoleOptions, TEAM_ROLES, type TeamRole } from "../../types/roles";
import { canDeleteBrand, canEditBrand, canManageBrandMembers } from "../../utils/permissions";
import { slugify } from "@/lib/utils/slug";

type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  role?: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
};

type OrganizationMember = {
  id: string;
  organizationId: string;
  role: string;
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
};

type TeamInvitation = {
  id: string;
  email: string;
  role?: string;
  status: string;
};

type Team = {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  members?: TeamMember[];
  invitations?: TeamInvitation[];
};

type Props = {
  initialTeams: Team[];
  initialOrganizationMembers: OrganizationMember[];
  currentUserId: string;
};

const roleOptions = getTeamRoleOptions();

// Helper untuk mendapatkan label role
const getRoleLabel = (role: string | undefined) => {
  if (!role) return "Viewer";
  const option = roleOptions.find(o => o.value === role);
  return option?.label || role.charAt(0).toUpperCase() + role.slice(1);
};

export function BrandsList({ initialTeams, initialOrganizationMembers, currentUserId }: Props) {
  const [teams, setTeams] = useState(initialTeams);
  const [organizationMembers, setOrganizationMembers] = useState(initialOrganizationMembers);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editLogo, setEditLogo] = useState("");
  const [isEditSlugEdited, setIsEditSlugEdited] = useState(false);
  const [inviteEmail, setInviteEmail] = useState<Record<string, string>>({});
  const [inviteRole, setInviteRole] = useState<Record<string, string>>({});

  // Helper untuk mendapatkan role user saat ini di suatu team
  const getCurrentUserRole = useCallback((team: Team) => {
    const member = team.members?.find(m => m.userId === currentUserId);
    return member?.role as TeamRole | undefined;
  }, [currentUserId]);

  // Fallback: jika tidak memiliki role, anggap sebagai owner untuk testing (atau buat logic sendiri)
  const safeCanEditBrand = (role: TeamRole | undefined) => {
    // Jika role undefined, biarkan edit untuk testing
    if (!role) return true; 
    return canEditBrand(role);
  };

  const safeCanDeleteBrand = (role: TeamRole | undefined) => {
    if (!role) return true; 
    return canDeleteBrand(role);
  };

  const safeCanManageBrandMembers = (role: TeamRole | undefined) => {
    if (!role) return true; 
    return canManageBrandMembers(role);
  };

  // Update state when props change (after switching organization)
  useEffect(() => {
    console.log("=== BrandsList Debug ===");
    console.log("currentUserId:", currentUserId);
    console.log("initialTeams:", initialTeams);
    console.log("initialOrganizationMembers:", initialOrganizationMembers);
    setTeams(initialTeams);
    setOrganizationMembers(initialOrganizationMembers);
  }, [initialTeams, initialOrganizationMembers, currentUserId]);

  // Auto-generate slug saat nama berubah, kecuali jika user sudah edit slug
  useEffect(() => {
    if (!isSlugEdited) {
      setBrandSlug(slugify(brandName));
    }
  }, [brandName, isSlugEdited]);

  // Auto-generate edit slug
  useEffect(() => {
    if (!isEditSlugEdited && editingTeamId) {
      setEditSlug(slugify(editName));
    }
  }, [editName, isEditSlugEdited, editingTeamId]);

  const handleCreateTeam = async (formData: FormData) => {
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await createTeamAction(formData);
        setSuccess("Brand created successfully!");
        setBrandName("");
        setBrandSlug("");
        setIsSlugEdited(false);
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to create brand");
      }
    });
  };

  const handleDeleteTeam = async (teamId: string) => {
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await deleteTeamAction(teamId);
        setSuccess("Brand deleted successfully!");
        setTeams(teams.filter((t) => t.id !== teamId));
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to delete brand");
      }
    });
  };

  const handleAddTeamMember = async (teamId: string, userId: string) => {
    setError(null);
    setSuccess(null);
    
    const role = selectedRoles[`${teamId}-${userId}`] || TEAM_ROLES.TEAM_VIEWER;
    startTransition(async () => {
      try {
        await addTeamMemberAction(teamId, userId, role);
        setSuccess("Member added to brand successfully!");
        // Wait a bit for server revalidation to complete
        setTimeout(() => {
          router.refresh();
        }, 300);
      } catch (err: any) {
        setError(err.message || "Failed to add member to brand");
      }
    });
  };

  const handleUpdateRole = async (teamId: string, userId: string, newRole: string) => {
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await updateTeamMemberRoleAction(teamId, userId, newRole);
        setSuccess("Role updated successfully!");
        setTimeout(() => {
          router.refresh();
        }, 300);
      } catch (err: any) {
        setError(err.message || "Failed to update role");
      }
    });
  };

  const handleRemoveTeamMember = async (teamId: string, userId: string) => {
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await removeTeamMemberAction(teamId, userId);
        setSuccess("Member removed from brand successfully!");
        setTimeout(() => {
          router.refresh();
        }, 300);
      } catch (err: any) {
        setError(err.message || "Failed to remove member from brand");
      }
    });
  };

  const handleInviteTeamMember = async (teamId: string, teamName: string) => {
    const email = inviteEmail[teamId]?.trim();
    if (!email) {
      setError("Email is required");
      return;
    }
    
    const role = inviteRole[teamId] || TEAM_ROLES.TEAM_VIEWER;
    
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await inviteTeamMemberAction(teamId, teamName, email, role);
        setSuccess("Invitation sent successfully!");
        setInviteEmail(prev => ({ ...prev, [teamId]: "" }));
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to send invitation");
      }
    });
  };

  const handleCancelTeamInvitation = async (teamId: string, invitationId: string) => {
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await cancelTeamInvitationAction(teamId, invitationId);
        setSuccess("Invitation cancelled successfully!");
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to cancel invitation");
      }
    });
  };

  const handleEditBrand = useCallback((team: Team) => {
    setEditingTeamId(team.id);
    setEditName(team.name);
    setEditSlug(team.slug || "");
    setEditLogo(team.logo || "");
    setIsEditSlugEdited(false);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTeamId(null);
    setEditName("");
    setEditSlug("");
    setEditLogo("");
    setIsEditSlugEdited(false);
  }, []);

  const handleUpdateBrand = useCallback(async () => {
    if (!editingTeamId) return;
    
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        await updateTeamAction(editingTeamId, {
          name: editName,
          slug: editSlug,
          logo: editLogo,
        });
        setSuccess("Brand updated successfully!");
        setEditingTeamId(null);
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to update brand");
      }
    });
  }, [editingTeamId, editName, editSlug, editLogo, router]);

  const getTeamMemberIds = (team: Team) => {
    return new Set((team.members || []).map((m) => m.userId));
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

      {/* Create Brand Form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Create Brand
        </h2>
        <form action={handleCreateTeam} className="flex flex-wrap gap-4">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="My Brand"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label htmlFor="slug" className="text-zinc-700 dark:text-zinc-300">
              Slug
            </Label>
            <Input
              id="slug"
              name="slug"
              type="text"
              placeholder="my-brand"
              value={brandSlug}
              onChange={(e) => {
                setBrandSlug(e.target.value);
                setIsSlugEdited(true);
              }}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2 min-w-[200px]">
            <Label htmlFor="logo" className="text-zinc-700 dark:text-zinc-300">
              Logo URL (optional)
            </Label>
            <Input
              id="logo"
              name="logo"
              type="url"
              placeholder="https://..."
              disabled={isPending}
            />
          </div>
          <div className="flex-end">
            <Button type="submit" disabled={isPending} className="h-10">
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus size={18} />
                  Create Brand
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Brands List */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Brands
        </h2>
        {teams.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">No brands yet. Create your first brand above!</p>
        ) : (
          <div className="space-y-6">
            {teams.map((team) => {
              const isExpanded = expandedTeamId === team.id;
              const isEditing = editingTeamId === team.id;
              const currentRole = getCurrentUserRole(team);
              const teamMemberIds = getTeamMemberIds(team);
              const availableMembersToAdd = organizationMembers.filter(
                (m) => !teamMemberIds.has(m.userId)
              );

              return (
                <div key={team.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-zinc-900 dark:text-white">Edit Brand</h3>
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={isPending}>
                          <X size={18} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="space-y-2 flex-1 min-w-[200px]">
                          <Label className="text-zinc-700 dark:text-zinc-300">Name</Label>
                          <Input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            disabled={isPending}
                          />
                        </div>
                        <div className="space-y-2 flex-1 min-w-[200px]">
                          <Label className="text-zinc-700 dark:text-zinc-300">Slug</Label>
                          <Input
                            type="text"
                            value={editSlug}
                            onChange={(e) => {
                              setEditSlug(e.target.value);
                              setIsEditSlugEdited(true);
                            }}
                            disabled={isPending}
                          />
                        </div>
                        <div className="space-y-2 min-w-[200px]">
                          <Label className="text-zinc-700 dark:text-zinc-300">Logo URL</Label>
                          <Input
                            type="url"
                            value={editLogo}
                            onChange={(e) => setEditLogo(e.target.value)}
                            disabled={isPending}
                          />
                        </div>
                        <div className="flex-end items-end pt-5 gap-2 flex">
                          <Button variant="secondary" onClick={handleCancelEdit} disabled={isPending}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateBrand} disabled={isPending}>
                            {isPending ? "Updating..." : "Save"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {team.logo ? (
                            <AvatarImage src={team.logo} alt={team.name} />
                          ) : (
                            <AvatarFallback>
                              <Building size={20} />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {team.name}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {team.slug}
                          </p>
                          {currentRole && (
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                              Your role: {getRoleLabel(currentRole)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                        >
                          <Users size={18} className="mr-2" />
                          {team.members?.length || 0}
                        </Button>
                        {safeCanEditBrand(currentRole) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBrand(team)}
                          >
                            <Pencil size={18} />
                          </Button>
                        )}
                        {safeCanDeleteBrand(currentRole) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTeam(team.id)}
                            disabled={isPending}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash size={18} />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {isExpanded && !isEditing && safeCanManageBrandMembers(currentRole) && (
                    <div className="mt-4 pl-13 space-y-6">
                      {/* Team Members List */}
                      <div>
                        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Brand Members
                        </h3>
                        {team.members && team.members.length > 0 ? (
                          <div className="space-y-2">
                            {team.members.map((member) => (
                              <div key={member.id} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    {member.user?.image && <AvatarImage src={member.user.image} alt={member.user?.name || ""} />}
                                    <AvatarFallback>{member.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="text-sm text-zinc-900 dark:text-white">
                                      {member.user?.name || "Unknown"}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {getRoleLabel(member.role)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <select
                                    value={member.role || TEAM_ROLES.TEAM_VIEWER}
                                    onChange={(e) => handleUpdateRole(team.id, member.userId, e.target.value)}
                                    disabled={isPending}
                                    className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-xs text-zinc-900 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                                  >
                                    {roleOptions.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveTeamMember(team.id, member.userId)}
                                    disabled={isPending}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <UserMinus size={16} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">No members in this brand yet.</p>
                        )}
                      </div>

                      {/* Invite Member Form */}
                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                          Invite Member
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          <div className="space-y-2 flex-1 min-w-[200px]">
                            <Label htmlFor={`invite-email-${team.id}`} className="text-zinc-700 dark:text-zinc-300 text-xs">
                              Email
                            </Label>
                            <Input
                              id={`invite-email-${team.id}`}
                              type="email"
                              placeholder="email@example.com"
                              value={inviteEmail[team.id] || ""}
                              onChange={(e) => setInviteEmail(prev => ({ ...prev, [team.id]: e.target.value }))}
                              disabled={isPending}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2 min-w-[150px]">
                            <Label htmlFor={`invite-role-${team.id}`} className="text-zinc-700 dark:text-zinc-300 text-xs">
                              Role
                            </Label>
                            <select
                              id={`invite-role-${team.id}`}
                              value={inviteRole[team.id] || TEAM_ROLES.TEAM_VIEWER}
                              onChange={(e) => setInviteRole(prev => ({ ...prev, [team.id]: e.target.value }))}
                              disabled={isPending}
                              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2 text-xs text-zinc-900 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                            >
                              {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-end items-end pt-5">
                          <Button
                            size="sm"
                            onClick={() => handleInviteTeamMember(team.id, team.name)}
                            disabled={isPending}
                          >
                            <Envelope size={14} className="mr-1" />
                            Send Invite
                          </Button>
                        </div>
                        </div>
                      </div>

                      {/* Add Member Form (from org members) */}
                      {availableMembersToAdd.length > 0 && (
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Add from Organization Members
                          </h3>
                          <div className="space-y-3">
                            {availableMembersToAdd.map((member) => (
                              <div key={member.id} className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  {member.user?.image && <AvatarImage src={member.user.image} alt={member.user?.name || ""} />}
                                  <AvatarFallback>{member.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-zinc-900 dark:text-white flex-1">
                                  {member.user?.name}
                                </span>
                                <select
                                  value={selectedRoles[`${team.id}-${member.userId}`] || TEAM_ROLES.TEAM_VIEWER}
                                  onChange={(e) => setSelectedRoles(prev => ({
                                    ...prev,
                                    [`${team.id}-${member.userId}`]: e.target.value
                                  }))}
                                  disabled={isPending}
                                  className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-xs text-zinc-900 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                                >
                                  {roleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleAddTeamMember(team.id, member.userId)}
                                  disabled={isPending}
                                >
                                  <UserPlus size={14} className="mr-1" />
                                  Add
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
