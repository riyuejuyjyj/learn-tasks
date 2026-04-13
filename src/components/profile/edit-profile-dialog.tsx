"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PencilLine, UploadCloud } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";

import { useAppLocale } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@/components/ui/avatar-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { getAvatarUrl } from "@/lib/avatar";
import { getMessages } from "@/lib/i18n";

type EditProfileDialogProps = {
  defaultName: string;
  email: string;
  image?: string | null;
  userId?: string | null;
};

type CloudinaryUploadResult = {
  info?: {
    secure_url?: string;
  };
};

export function EditProfileDialog({
  defaultName,
  email,
  image,
  userId,
}: EditProfileDialogProps) {
  const router = useRouter();
  const { locale } = useAppLocale();
  const t = getMessages(locale).profile;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [imageUrl, setImageUrl] = useState(image ?? "");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setName(defaultName);
    setImageUrl(image ?? "");
  }, [defaultName, image]);

  function resetFormState() {
    setName(defaultName);
    setImageUrl(image ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      resetFormState();
    }

    setOpen(nextOpen);
  }

  const fallbackAvatarUrl = useMemo(
    () =>
      getAvatarUrl({
        name,
        email,
        id: userId,
      }),
    [email, name, userId],
  );

  const previewAvatarUrl = useMemo(() => {
    if (imageUrl.trim()) {
      return imageUrl.trim();
    }

    return fallbackAvatarUrl;
  }, [fallbackAvatarUrl, imageUrl]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextName = name.trim();
    const nextImageUrl = imageUrl.trim();
    const current = currentPassword.trim();
    const nextPassword = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!nextName) {
      toast.error(t.nameRequired);
      return;
    }

    const wantsToChangePassword =
      current.length > 0 || nextPassword.length > 0 || confirm.length > 0;

    if (wantsToChangePassword) {
      if (!current || !nextPassword || !confirm) {
        toast.error(t.passwordFieldsRequired);
        return;
      }

      if (nextPassword.length < 8) {
        toast.error(t.passwordTooShort);
        return;
      }

      if (nextPassword !== confirm) {
        toast.error(t.passwordMismatch);
        return;
      }

      if (current === nextPassword) {
        toast.error(t.passwordSame);
        return;
      }
    }

    startTransition(async () => {
      try {
        const profileResult = await authClient.updateUser({
          name: nextName,
          image: nextImageUrl || undefined,
        });

        if (profileResult.error) {
          toast.error(profileResult.error.message || t.saveFailed);
          return;
        }

        if (wantsToChangePassword) {
          const passwordResult = await authClient.changePassword({
            currentPassword: current,
            newPassword: nextPassword,
            revokeOtherSessions: true,
          });

          if (passwordResult.error) {
            toast.error(passwordResult.error.message || t.changePasswordFailed);
            return;
          }
        }

        toast.success(t.saveSuccess);
        setOpen(false);
        router.refresh();
      } catch {
        toast.error(t.saveFailed);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-5 shadow-sm">
          <PencilLine className="size-4" />
          {t.editProfile}
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="max-h-[85vh] overflow-y-auto rounded-[28px] border-border/70 bg-popover/95 shadow-xl backdrop-blur"
      >
        <DialogHeader>
          <DialogTitle>{t.dialogTitle}</DialogTitle>
          <DialogDescription>{t.dialogDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-background/65 p-4">
              <AvatarImage
                src={previewAvatarUrl}
                fallbackSrc={fallbackAvatarUrl}
                alt={t.avatarAlt}
                size={64}
                className="size-16 rounded-full border border-border/70 object-cover shadow-sm"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{t.avatarTitle}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {t.avatarDescription}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="text-foreground">{t.avatarTitle}</Label>

              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary-params"
                options={{
                  folder: "avatars",
                  maxFiles: 1,
                  resourceType: "image",
                  clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                  sources: ["local", "url", "camera"],
                }}
                onSuccess={(result, { widget }) => {
                  const info = (result as CloudinaryUploadResult)?.info;
                  const secureUrl = info?.secure_url;

                  if (!secureUrl) {
                    toast.error(t.avatarMissing);
                    return;
                  }

                  setImageUrl(secureUrl);
                  setIsSavingAvatar(true);

                  startTransition(async () => {
                    try {
                      const profileResult = await authClient.updateUser({
                        image: secureUrl,
                      });

                      if (profileResult.error) {
                        toast.error(profileResult.error.message || t.avatarSaveFailed);
                        return;
                      }

                      toast.success(t.avatarSaved);
                      widget.close();
                      router.refresh();
                    } catch {
                      toast.error(t.avatarSaveFailed);
                    } finally {
                      setIsSavingAvatar(false);
                    }
                  });
                }}
              >
                {({ open: openWidget }) => (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => openWidget()}
                    disabled={isSavingAvatar}
                  >
                    <UploadCloud className="size-4" />
                    {isSavingAvatar ? t.avatarSaving : t.avatarButton}
                  </Button>
                )}
              </CldUploadWidget>

              <p className="text-xs text-muted-foreground">{t.avatarHint}</p>
            </div>
          </section>

          <section className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="edit-profile-name">{t.name}</Label>
              <Input
                id="edit-profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t.namePlaceholder}
                className="h-11 rounded-2xl border-border/70 bg-background/80 shadow-sm"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="edit-profile-email">{t.email}</Label>
              <Input
                id="edit-profile-email"
                type="email"
                value={email}
                disabled
                className="h-11 rounded-2xl border-border/70 bg-muted/60 text-muted-foreground shadow-sm"
              />
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-border/70 bg-background/55 p-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">{t.passwordSectionTitle}</h3>
              <p className="text-xs leading-5 text-muted-foreground">
                {t.passwordSectionDescription}
              </p>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="current-password">{t.currentPassword}</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder={t.currentPasswordPlaceholder}
                autoComplete="current-password"
                className="h-11 rounded-2xl border-border/70 bg-background/80 shadow-sm"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="new-password">{t.newPassword}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder={t.newPasswordPlaceholder}
                autoComplete="new-password"
                className="h-11 rounded-2xl border-border/70 bg-background/80 shadow-sm"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder={t.confirmPasswordPlaceholder}
                autoComplete="new-password"
                className="h-11 rounded-2xl border-border/70 bg-background/80 shadow-sm"
              />
            </div>
          </section>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending || isSavingAvatar}
              className="rounded-full"
            >
              {getMessages(locale).tasks.cancel}
            </Button>

            <Button
              type="submit"
              disabled={isPending || isSavingAvatar}
              className="rounded-full px-5 shadow-sm"
            >
              {isPending || isSavingAvatar ? t.saving : t.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
