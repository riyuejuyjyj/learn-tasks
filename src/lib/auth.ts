import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { mailer } from "@/lib/mailer";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { getVerificationEmailHtml } from "@/lib/verification-email";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/auth",

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      await mailer.sendMail({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        subject: "Verify your Task Flow email",
        html: getVerificationEmailHtml({
          name: user.name,
          url,
        }),
      });
    },
  },
});
