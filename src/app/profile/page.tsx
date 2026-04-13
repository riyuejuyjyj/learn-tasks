import { redirect } from "next/navigation";
import {
  KeyRound,
  Mail,
  PencilLine,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { ResendVerificationButton } from "@/components/profile/resend-verification-button";
import { AvatarImage } from "@/components/ui/avatar-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAvatarUrl } from "@/lib/avatar";
import { getServerSession } from "@/lib/auth-server";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

type ProfilePageProps = {
  searchParams?: Promise<{
    error?: string;
    verified?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const [session, locale] = await Promise.all([getServerSession(), getLocale()]);

  if (!session?.user) {
    redirect("/login");
  }

  const t = getMessages(locale).profile;
  const params = await searchParams;
  const verified = params?.verified === "1";
  const verificationError = params?.error;
  const user = session.user;
  const fallbackAvatarUrl = getAvatarUrl(user);
  const avatarUrl = user.image || fallbackAvatarUrl;

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <section className="mb-8 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{t.eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t.title}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">{t.description}</p>
        </section>

        {verified ? (
          <div className="mb-6 rounded-[24px] border border-emerald-300/60 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-900 dark:text-emerald-100">
            {t.verifiedBanner}
          </div>
        ) : null}

        {verificationError ? (
          <div className="mb-6 rounded-[24px] border border-red-300/60 bg-red-500/10 px-5 py-4 text-sm text-red-900 dark:text-red-100">
            {t.verificationFailed}: {verificationError}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <section className="space-y-6">
            <Card className="rounded-[28px] border-border/70 bg-card/70 shadow-sm backdrop-blur">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <AvatarImage
                  src={avatarUrl}
                  fallbackSrc={fallbackAvatarUrl}
                  alt={user.name || t.avatarAlt}
                  size={96}
                  className="size-24 rounded-full border border-border/70 object-cover shadow-sm"
                />

                <div className="mt-5 space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {user.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <div className="mt-6 inline-flex rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                  {user.emailVerified ? t.verified : t.notVerified}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-border/70 bg-card/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PencilLine className="size-5 text-muted-foreground" />
                  {t.editProfile}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {t.editProfileDescription}
                </p>

                {!user.emailVerified ? (
                  <div className="rounded-2xl border border-amber-300/60 bg-amber-500/10 p-4">
                    <p className="text-sm font-medium text-amber-950 dark:text-amber-100">
                      {t.verificationRequired}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-900/80 dark:text-amber-100/80">
                      {t.verificationRequiredDescription}
                    </p>
                    <div className="mt-3">
                      <ResendVerificationButton email={user.email} />
                    </div>
                  </div>
                ) : null}

                <EditProfileDialog
                  defaultName={user.name}
                  email={user.email}
                  image={user.image}
                  userId={user.id}
                />
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="rounded-[28px] border-border/70 bg-card/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>{t.accountDetails}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-border/70 bg-background/65 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-muted p-2">
                      <UserCircle2 className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="mt-1 break-words text-sm text-muted-foreground">
                        {user.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/65 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-muted p-2">
                      <Mail className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{t.email}</p>
                      <p className="mt-1 break-words text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/65 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-muted p-2">
                      <ShieldCheck className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {t.verificationStatus}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {user.emailVerified ? t.verified : t.notVerified}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/65 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-muted p-2">
                      <KeyRound className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{t.userId}</p>
                      <p className="mt-1 break-all text-sm text-muted-foreground">
                        {user.id}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
