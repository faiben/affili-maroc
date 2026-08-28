import nodemailer from "nodemailer";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
}

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !from) {
    return null;
  }

  return {
    host,
    port: parseInt(port, 10),
    secure: process.env.SMTP_SECURE === "true" || parseInt(port, 10) === 465,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    from,
  };
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationUrl: string,
  config: SmtpConfig
): Promise<{ success: boolean; error?: string; previewUrl?: string }> {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth:
        config.user && config.pass
          ? { user: config.user, pass: config.pass }
          : undefined,
    });

    await transporter.sendMail({
      from: `"AffiliMaroc" <${config.from}>`,
      to,
      subject: "Vérifiez votre adresse email - AffiliMaroc",
      text: `Bonjour ${name},\n\nCliquez sur le lien suivant pour vérifier votre adresse email :\n${verificationUrl}\n\nCe lien expire dans 24 heures.\n\nL'équipe AffiliMaroc`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #047857;">Bienvenue sur AffiliMaroc</h2>
          <p>Bonjour ${name},</p>
          <p>Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Vérifier mon email</a>
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
          <p style="color: #6b7280; font-size: 14px;">Ce lien expire dans 24 heures.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #6b7280; font-size: 12px;">L'équipe AffiliMaroc</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur d'envoi d'email",
    };
  }
}

export function generateVerificationToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for Node.js
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
