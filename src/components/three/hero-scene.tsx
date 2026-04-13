type HeroSceneProps = {
  sceneLabel: string;
  runtimeLabel: string;
  runtimeValue: string;
  surfaceLabel: string;
  surfaceValue: string;
};

export function HeroScene({
  sceneLabel,
  runtimeLabel,
  runtimeValue,
  surfaceLabel,
  surfaceValue,
}: HeroSceneProps) {
  return (
    <div className="glass-panel soft-glow relative h-[420px] w-full overflow-hidden rounded-[36px] lg:h-[560px]">
      <div className="grid-surface absolute inset-0 opacity-55 dark:opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.74),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_28%)]" />
      <div className="pointer-events-none absolute left-8 top-8 h-28 w-28 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-400/15" />
      <div className="pointer-events-none absolute bottom-8 right-8 h-36 w-36 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-400/12" />

      <div className="pointer-events-none absolute left-6 top-6 z-20 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
        {sceneLabel}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative h-[320px] w-[320px] sm:h-[360px] sm:w-[360px]">
          <div className="absolute inset-[18%] rounded-full border border-border/60 opacity-70" />
          <div className="absolute inset-[8%] animate-spin rounded-full border border-sky-400/25 [animation-duration:24s]" />
          <div className="absolute inset-[1%] animate-spin rounded-full border border-cyan-400/20 [animation-direction:reverse] [animation-duration:34s]" />

          <div className="absolute left-1/2 top-[10%] size-3 -translate-x-1/2 rounded-full bg-sky-400 shadow-[0_0_28px_rgba(56,189,248,0.9)]" />
          <div className="absolute right-[12%] top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.8)]" />
          <div className="absolute bottom-[12%] left-[18%] size-2.5 rounded-full bg-slate-300 shadow-[0_0_24px_rgba(148,163,184,0.55)] dark:bg-slate-200" />

          <div className="absolute inset-[27%] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(165,243,252,0.9)_18%,rgba(56,189,248,0.55)_42%,rgba(15,23,42,0.84)_100%)] shadow-[0_40px_90px_rgba(14,116,144,0.26)]">
            <div className="absolute inset-3 rounded-full border border-white/15" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_65%_35%,rgba(255,255,255,0.45),transparent_28%)]" />
          </div>

          <div className="absolute left-[-6%] top-[18%] w-32 rounded-[24px] border border-border/70 bg-background/72 p-3 shadow-[0_18px_38px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {runtimeLabel}
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">{runtimeValue}</p>
          </div>

          <div className="absolute bottom-[14%] right-[-4%] w-36 rounded-[24px] border border-border/70 bg-background/72 p-3 shadow-[0_18px_38px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {surfaceLabel}
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">{surfaceValue}</p>
          </div>

          <div className="absolute left-[8%] top-[64%] hidden w-28 rounded-[22px] border border-border/70 bg-background/58 p-3 backdrop-blur md:block">
            <div className="space-y-2">
              <div className="h-1.5 rounded-full bg-sky-400/70" />
              <div className="h-1.5 w-4/5 rounded-full bg-cyan-300/60" />
              <div className="h-1.5 w-3/5 rounded-full bg-slate-300/70 dark:bg-slate-500/70" />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-6 z-20 hidden rounded-3xl border border-border/70 bg-background/68 px-5 py-4 shadow-lg backdrop-blur lg:block">
        <div className="flex items-end gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {runtimeLabel}
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {runtimeValue}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {surfaceLabel}
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {surfaceValue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
