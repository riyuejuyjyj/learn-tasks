import { createEmailVerificationToken } from "better-auth/api";
import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-server";
import { mailer } from "@/lib/mailer";
import { getVerificationEmailHtml } from "@/lib/verification-email";

type ResendVerificationBody = {
  callbackURL?: string;
};

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.emailVerified) {
    return NextResponse.json(
      { error: "Email is already verified." },
      { status: 400 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as ResendVerificationBody;
  const baseURL = process.env.BETTER_AUTH_URL;
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!baseURL || !secret) {
    return NextResponse.json(
      { error: "Auth email verification is not configured." },
      { status: 500 },
    );
  }

  try {
    const token = await createEmailVerificationToken(secret, session.user.email);
    const callbackURL = encodeURIComponent(body.callbackURL || "/profile?verified=1");
    const url = `${baseURL}/api/auth/verify-email?token=${token}&callbackURL=${callbackURL}`;

    await mailer.sendMail({
      from: process.env.EMAIL_FROM!,
      to: session.user.email,
      subject: "Verify your Task Flow email",
      html: getVerificationEmailHtml({
        name: session.user.name,
        url,
      }),
    });

    return NextResponse.json({ status: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send verification email.";

    console.error("Resend verification email failed:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
