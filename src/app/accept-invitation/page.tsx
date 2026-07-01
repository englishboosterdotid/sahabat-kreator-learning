"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Spinner, Users, Building } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth/client";

export const dynamic = "force-dynamic";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invitationId = searchParams.get("invitationId");
  const organizationNameParam = searchParams.get("organizationName");
  const roleParam = searchParams.get("role");
  const teamNameParam = searchParams.get("teamName");
  const teamIdParam = searchParams.get("teamId");

  // Decode dan dapatkan data langsung dari URL
  const organizationName = organizationNameParam ? decodeURIComponent(organizationNameParam) : "Organisasi";
  const teamName = teamNameParam ? decodeURIComponent(teamNameParam) : null;
  
  const isTeamInvitation = !!teamName;
  
  const [status, setStatus] = useState<"confirm" | "success" | "error">("confirm");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleAccept = async () => {
    if (!invitationId) {
      setStatus("error");
      setErrorMessage("ID undangan tidak ditemukan");
      return;
    }
    
    setIsPending(true);
    try {
      await authClient.organization.acceptInvitation({
        invitationId,
        ...(teamIdParam ? { teamId: teamIdParam } : {}),
      });
      
      setStatus("success");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Gagal menerima undangan");
      setIsPending(false);
    }
  };

  const handleDecline = () => {
    router.push("/sign-in");
  };

  const getRoleLabel = (role?: string | null) => {
    switch (role) {
      case "owner":
        return "Owner";
      case "admin":
        return "Admin";
      case "member":
        return "Member";
      default:
        return "Member";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {status === "confirm" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              {isTeamInvitation ? (
                <Building size={40} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <Users size={40} className="text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isTeamInvitation ? "Undangan Team & Organisasi" : "Undangan Organisasi"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Anda diundang untuk bergabung</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Nama Organisasi</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {organizationName}
              </span>
            </div>
            {isTeamInvitation && teamName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Nama Team</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {teamName}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Peran Anda</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {isTeamInvitation ? "Member (Org) + Team Role" : getRoleLabel(roleParam)}
              </span>
            </div>
          </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Apakah Anda ingin menerima undangan ini?
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleDecline}
                className="flex-1"
                disabled={isPending}
              >
                Tolak
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner size={18} className="animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  "Terima"
                )}
              </Button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Undangan Diterima!</h1>
            <p className="text-gray-600 dark:text-gray-300">Selamat bergabung! Anda akan dialihkan ke dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 text-center">
            <XCircle size={64} className="mx-auto text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gagal</h1>
            <p className="text-gray-600 dark:text-gray-300">{errorMessage}</p>
            <Button
              onClick={() => router.push("/sign-in")}
              className="w-full"
            >
              Kembali ke Masuk
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size={64} className="animate-spin" /></div>}>
      <AcceptInvitationContent />
    </Suspense>
  );
}
