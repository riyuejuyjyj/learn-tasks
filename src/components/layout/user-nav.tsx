"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import { toast } from "sonner";

import { useAppLocale } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@/components/ui/avatar-image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatarUrl } from "@/lib/avatar";
import { authClient } from "@/lib/auth-client";
import { getMessages } from "@/lib/i18n";

export function UserNav() {
  const router = useRouter();
  const { locale } = useAppLocale();
  const t = getMessages(locale);
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success(t.nav.signedOut);
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch {
      toast.error(t.nav.signOutFailed);
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-20 rounded-full bg-muted/70" />
        <div className="h-9 w-24 rounded-full bg-muted/70" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild className="hidden sm:inline-flex">
          <Link href="/login">{t.nav.login}</Link>
        </Button>

        <Button asChild className="rounded-full px-5 shadow-sm">
          <Link href="/register">{t.nav.register}</Link>
        </Button>
      </div>
    );
  }

  const { user } = session;
  const fallbackAvatarUrl = getAvatarUrl(user);
  const avatarUrl = user.image || fallbackAvatarUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-2 py-2 shadow-sm backdrop-blur transition-colors hover:bg-background/95 focus:outline-none focus:ring-2 focus:ring-ring">
          <AvatarImage
            src={avatarUrl}
            fallbackSrc={fallbackAvatarUrl}
            alt={user.name || t.profile.avatarAlt}
            size={36}
            className="size-9 rounded-full border border-border/70 object-cover"
          />

          <div className="hidden max-w-[140px] text-left sm:block">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

          <ChevronDown className="mr-1 size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl border-border/70 bg-popover/95 p-2 shadow-xl backdrop-blur"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center gap-3">
            <AvatarImage
              src={avatarUrl}
              fallbackSrc={fallbackAvatarUrl}
              alt={user.name || t.profile.avatarAlt}
              size={40}
              className="size-10 rounded-full border border-border/70 object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5">
            <Link
              href="/dashboard"
              className="flex cursor-pointer items-center gap-2"
            >
              <LayoutDashboard className="size-4 text-muted-foreground" />
              <span>{t.nav.dashboard}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5">
            <Link href="/profile" className="flex cursor-pointer items-center gap-2">
              <UserCircle2 className="size-4 text-muted-foreground" />
              <span>{t.nav.profile}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="rounded-xl px-3 py-2.5 text-red-600 focus:text-red-600"
          onSelect={handleSignOut}
        >
          <LogOut className="size-4" />
          <span>{t.nav.signOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
