import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { admin, organization } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

import { db } from "@/db";
import * as schema from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  email: {
    sendEmail: async (data: { to: string; subject: string; html: string }) => {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
    },
  },

  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      teams: {
        enabled: true,
      },
      sendInvitationEmail: async (data: any) => {
        // Encode nama untuk URL safety
        const organizationName = encodeURIComponent(data.organization.name);
        const teamName = data.invitation.teamName ? encodeURIComponent(data.invitation.teamName) : null;
        const teamId = data.invitation.teamId || null;
        
        let acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/accept-invitation?invitationId=${data.invitation.id}&organizationName=${organizationName}&role=${data.invitation.role}`;
        
        // Add team params if it's a team invitation
        if (teamName && teamId) {
          acceptUrl += `&teamName=${teamName}&teamId=${teamId}`;
        }
        
        let subject = `Anda diundang ke ${data.organization.name}`;
        let htmlBody = `
          <p>Halo!</p>
          <p><strong>${data.inviter?.name || "Seseorang"}</strong> mengundang Anda untuk bergabung ke <strong>${data.organization.name}</strong>.</p>
        `;
        
        if (teamName) {
          subject = `Anda diundang ke team ${decodeURIComponent(teamName)} di ${data.organization.name}`;
          htmlBody = `
            <p>Halo!</p>
            <p><strong>${data.inviter?.name || "Seseorang"}</strong> mengundang Anda untuk bergabung ke:</p>
            <ul>
              <li>Organisasi: <strong>${data.organization.name}</strong></li>
              <li>Team: <strong>${decodeURIComponent(teamName)}</strong></li>
            </ul>
            <p>Anda akan secara otomatis ditambahkan ke kedua tempat ini!</p>
          `;
        }
        
        htmlBody += `
          <p>Klik link di bawah ini untuk menerima undangan:</p>
          <p><a href="${acceptUrl}">Terima Undangan</a></p>
          <p>Jika Anda tidak mengenali undangan ini, Anda dapat mengabaikan email ini.</p>
        `;
        
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: data.email,
          subject,
          html: htmlBody,
        });
      },
      organizationHooks: {
        beforeCreateInvitation: async ({ invitation, inviter, organization }: any) => {
          // Save teamId, teamName, and teamRole to invitation
          return {
            data: {
              ...invitation,
              // @ts-ignore - Add teamId, teamName, and teamRole to invitation
              teamId: invitation.teamId,
              teamName: invitation.teamName,
              teamRole: invitation.teamRole,
            },
          };
        },
        afterAcceptInvitation: async ({ invitation, member, user, organization }: any) => {
          // If invitation has teamId, add user to team
          if (invitation.teamId) {
            try {
              await (auth as any).api.addTeamMember({
                body: {
                  teamId: invitation.teamId,
                  userId: member.userId,
                  role: invitation.teamRole || "team_viewer", // Use stored team role
                },
              });
            } catch (error) {
              console.error("Failed to add user to team after accepting invitation:", error);
            }
          }
        },
      },
      schema: {
        team: {
          additionalFields: {
            slug: {
              type: "string",
              required: false,
              input: true,
              returned: true,
            },
            logo: {
              type: "string",
              required: false,
              input: true,
              returned: true,
            },
          },
        },
      },
    }),
    admin(),
    nextCookies(),
  ],
});