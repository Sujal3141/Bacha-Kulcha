import { DbService, IKitchen } from "../db";

/**
 * Email Notification Service
 * 
 * Sends personalized email notifications to the appropriate recipients
 * based on their role (admin, partner kitchen, or customer/user).
 * 
 * Uses the Gmail API proxy endpoint already configured on the server.
 */

// In-memory admin email config (in production, this would come from env/db)
const ADMIN_EMAILS = [
  "sujalawasthi299792458@gmail.com",
  "namanawasthi20162004@gmail.com"
];

const PLATFORM_NAME = "bacha kulcha";

export type NotificationRecipient = "admin" | "kitchen" | "user" | "all";

export interface EmailNotificationPayload {
  title: string;
  message: string;
  type: "success" | "info" | "alert" | "warning";
  recipientRole: NotificationRecipient;
  /** If targeting a specific kitchen, provide the kitchen ID */
  kitchenId?: string;
  /** If targeting a specific user email */
  userEmail?: string;
}

/**
 * Build a beautiful branded HTML email template
 */
function buildEmailHTML(payload: EmailNotificationPayload, recipientName: string): string {
  const typeColors: Record<string, { bg: string; border: string; accent: string; icon: string }> = {
    success: { bg: "#f0fdf4", border: "#bbf7d0", accent: "#16a34a", icon: "✅" },
    info: { bg: "#eff6ff", border: "#bfdbfe", accent: "#2563eb", icon: "ℹ️" },
    alert: { bg: "#fef2f2", border: "#fecaca", accent: "#dc2626", icon: "🚨" },
    warning: { bg: "#fffbeb", border: "#fde68a", accent: "#d97706", icon: "⚠️" }
  };

  const colors = typeColors[payload.type] || typeColors.info;

  return `
    <div style="font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.025em;">${PLATFORM_NAME}</h1>
        <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 0.1em;">Unified Surplus Food Rescue Network</p>
      </div>

      <!-- Body -->
      <div style="padding: 32px;">
        <p style="font-size: 15px; color: #334155; margin: 0 0 20px 0;">Hello <strong>${recipientName}</strong>,</p>

        <!-- Notification Card -->
        <div style="background: ${colors.bg}; border: 1px solid ${colors.border}; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="font-size: 18px;">${colors.icon}</span>
            <h3 style="font-size: 14px; font-weight: 800; color: ${colors.accent}; margin: 0; text-transform: uppercase; letter-spacing: 0.03em;">${payload.title}</h3>
          </div>
          <p style="font-size: 14px; color: #475569; margin: 0; line-height: 1.6;">${payload.message}</p>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0 0 8px 0;">
          This is an automated notification from the ${PLATFORM_NAME} platform. You are receiving this email because you are a registered ${payload.recipientRole === "admin" ? "administrator" : payload.recipientRole === "kitchen" ? "partner kitchen" : "user"} on our platform.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          © ${new Date().getFullYear()} ${PLATFORM_NAME} · Surplus Food Rescue Platform
        </p>
        <p style="font-size: 10px; color: #cbd5e1; margin: 6px 0 0 0;">
          This notification was sent to your registered email. Please do not reply directly to this email.
        </p>
      </div>
    </div>
  `;
}

/**
 * Resolve recipient email addresses based on the notification target
 */
async function resolveRecipients(payload: EmailNotificationPayload): Promise<Array<{ email: string; name: string }>> {
  const recipients: Array<{ email: string; name: string }> = [];

  if (payload.recipientRole === "admin" || payload.recipientRole === "all") {
    for (const email of ADMIN_EMAILS) {
      recipients.push({ email, name: "Platform Administrator" });
    }
  }

  if (payload.recipientRole === "kitchen" || payload.recipientRole === "all") {
    if (payload.kitchenId) {
      // Target specific kitchen
      const kitchens = await DbService.getKitchens();
      const kitchen = kitchens.find(k => k.id === payload.kitchenId);
      if (kitchen) {
        recipients.push({ email: kitchen.gmail, name: kitchen.name });
      }
    } else {
      // Target all approved kitchens
      const kitchens = await DbService.getKitchens();
      kitchens
        .filter(k => k.approved === "approved")
        .forEach(k => recipients.push({ email: k.gmail, name: k.name }));
    }
  }

  if (payload.recipientRole === "user" && payload.userEmail) {
    recipients.push({ email: payload.userEmail, name: payload.userEmail.split("@")[0] });
  }

  // Deduplicate by email
  const seen = new Set<string>();
  return recipients.filter(r => {
    const key = r.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Send personalized email notifications.
 * This function is fire-and-forget — it logs errors but does not throw.
 * 
 * @param payload - The notification details
 * @param googleAccessToken - The OAuth token for Gmail API (if available)
 */
export async function sendEmailNotification(
  payload: EmailNotificationPayload,
  googleAccessToken: string | null
): Promise<void> {
  if (!googleAccessToken) {
    console.log(`📧 [Email Service] Skipped email for "${payload.title}" — no Google access token available. Notification stored in database only.`);
    return;
  }

  try {
    const recipients = await resolveRecipients(payload);

    if (recipients.length === 0) {
      console.log(`📧 [Email Service] No recipients resolved for notification "${payload.title}" (role: ${payload.recipientRole})`);
      return;
    }

    console.log(`📧 [Email Service] Dispatching "${payload.title}" to ${recipients.length} recipient(s): ${recipients.map(r => r.email).join(", ")}`);

    for (const recipient of recipients) {
      const html = buildEmailHTML(payload, recipient.name);
      const subject = `${PLATFORM_NAME} — ${payload.title}`;

      try {
        // Build RFC-compliant MIME message
        const mimeParts = [
          `To: ${recipient.email}`,
          `Subject: ${subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=utf-8`,
          ``,
          html
        ];

        const emailContent = mimeParts.join("\r\n");
        const base64UrlSafe = Buffer.from(emailContent)
          .toString("base64")
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${googleAccessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ raw: base64UrlSafe })
        });

        if (response.ok) {
          const data = await response.json() as any;
          console.log(`  ✉️ Sent to ${recipient.email} (Message ID: ${data.id})`);
        } else {
          const errorText = await response.text();
          console.warn(`  ⚠️ Failed to send to ${recipient.email}: ${response.status} - ${errorText}`);
        }
      } catch (sendErr: any) {
        console.warn(`  ⚠️ Email dispatch error for ${recipient.email}:`, sendErr.message);
      }
    }
  } catch (err: any) {
    console.error(`📧 [Email Service] Fatal error dispatching "${payload.title}":`, err.message);
  }
}
