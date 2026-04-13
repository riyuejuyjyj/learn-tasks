import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <Card className="rounded-[32px] border border-border/70 bg-card/75 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <CardHeader className="space-y-2 px-8 pt-8">
        <CardTitle className="text-2xl font-semibold tracking-tight text-card-foreground">
          {title}
        </CardTitle>

        <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
      </CardHeader>

      <CardContent className="px-8 pb-8">{children}</CardContent>
    </Card>
  );
}
