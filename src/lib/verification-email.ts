type VerificationEmailOptions = {
  name: string;
  url: string;
};

export function getVerificationEmailHtml({
  name,
  url,
}: VerificationEmailOptions): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 12px;">Hi ${name},</h2>
      <p>Thanks for signing up for Task Flow. Please verify your email address to finish setting up your account.</p>
      <p style="margin: 24px 0;">
        <a
          href="${url}"
          style="
            display: inline-block;
            padding: 12px 20px;
            border-radius: 999px;
            background: #0f172a;
            color: white;
            text-decoration: none;
            font-weight: 600;
          "
        >
          Verify email
        </a>
      </p>
      <p>If the button does not work, open this link in your browser:</p>
      <p style="word-break: break-all; color: #475569;">${url}</p>
    </div>
  `.trim();
}
