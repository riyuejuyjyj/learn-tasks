"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Motion, StaggeredMotion, spring } from "react-motion";

import { HeroScene } from "@/components/three/hero-scene";
import { Button } from "@/components/ui/button";
import { Interactive3DCard } from "@/components/ui/interactive-3d-card";

type HomeStat = {
  label: string;
  value: string;
};

type HomeHeroExperienceProps = {
  badge: string;
  spotlightLabel: string;
  spotlightValue: string;
  title: string;
  accent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  panelEyebrow: string;
  deckTitle: string;
  deckDescription: string;
  panelTitle: string;
  panelDescription: string;
  live: string;
  statOneTitle: string;
  statTwoTitle: string;
  statThreeTitle: string;
  sideTitle: string;
  sideValue: string;
  sideDescription: string;
  sceneLabel: string;
  sceneRuntimeLabel: string;
  sceneRuntimeValue: string;
  sceneSurfaceLabel: string;
  sceneSurfaceValue: string;
  stats: HomeStat[];
};

const heroSpring = { stiffness: 96, damping: 20 };
const quickSpring = { stiffness: 132, damping: 18 };

export function HomeHeroExperience({
  badge,
  spotlightLabel,
  spotlightValue,
  title,
  accent,
  description,
  primaryCta,
  secondaryCta,
  panelEyebrow,
  deckTitle,
  deckDescription,
  panelTitle,
  panelDescription,
  live,
  statOneTitle,
  statTwoTitle,
  statThreeTitle,
  sideTitle,
  sideValue,
  sideDescription,
  sceneLabel,
  sceneRuntimeLabel,
  sceneRuntimeValue,
  sceneSurfaceLabel,
  sceneSurfaceValue,
  stats,
}: HomeHeroExperienceProps) {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-surface absolute inset-0 opacity-45 dark:opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.2),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_22%),radial-gradient(circle_at_bottom,rgba(148,163,184,0.16),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_20%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.1),transparent_30%)]" />
        <div className="absolute left-[-80px] top-[-40px] h-[300px] w-[300px] rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute right-[-90px] top-[120px] h-[320px] w-[320px] rounded-full bg-cyan-300/18 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute bottom-[-80px] left-1/3 h-[260px] w-[260px] rounded-full bg-slate-300/18 blur-3xl dark:bg-slate-400/8" />
      </div>

      <section className="mx-auto max-w-7xl">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)] xl:gap-12">
          <Motion
            defaultStyle={{ opacity: 0, translateY: 32 }}
            style={{
              opacity: spring(1, heroSpring),
              translateY: spring(0, heroSpring),
            }}
          >
            {(heroStyle) => (
              <div
                className="space-y-8 pt-6 lg:pt-14"
                style={{
                  opacity: heroStyle.opacity,
                  transform: `translateY(${heroStyle.translateY}px)`,
                }}
              >
                <div className="glass-panel soft-glow inline-flex rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  {badge}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 backdrop-blur">
                      <Sparkles className="size-3.5" />
                      {spotlightLabel}
                    </span>
                    <span>{spotlightValue}</span>
                  </div>

                  <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl xl:text-7xl">
                    {title}
                    <span className="mt-4 block text-[0.48em] font-medium tracking-[-0.03em] text-muted-foreground sm:text-[0.46em]">
                      {accent}
                    </span>
                  </h1>

                  <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                    {description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-6 shadow-[0_16px_34px_rgba(15,23,42,0.18)]"
                  >
                    <Link href="/dashboard" className="inline-flex items-center gap-2">
                      {primaryCta}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-border/70 bg-background/70 px-6 backdrop-blur"
                  >
                    <Link href="/register">{secondaryCta}</Link>
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                  <Interactive3DCard depth="medium" glare className="h-full">
                    <div className="glass-panel soft-glow rounded-[32px] p-6">
                      <div className="card-3d-layer-2 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                            {panelEyebrow}
                          </p>
                          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                            {deckTitle}
                          </h2>
                        </div>
                        <div className="card-3d-layer-3 hidden rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur sm:inline-flex">
                          {live}
                        </div>
                      </div>

                      <p className="card-3d-layer-1 mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                        {deckDescription}
                      </p>

                      <StaggeredMotion
                        defaultStyles={stats.map(() => ({ opacity: 0, translateY: 18 }))}
                        styles={(prevStyles) => {
                          const baseStyles =
                            prevStyles ?? stats.map(() => ({ opacity: 0, translateY: 18 }));

                          return baseStyles.map((_, index) => ({
                            opacity:
                              index === 0
                                ? spring(1, quickSpring)
                                : spring(baseStyles[index - 1].opacity, quickSpring),
                            translateY:
                              index === 0
                                ? spring(0, quickSpring)
                                : spring(baseStyles[index - 1].translateY, quickSpring),
                          }));
                        }}
                      >
                        {(interpolatedStyles) => (
                          <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {stats.map((item, index) => (
                              <div
                                key={item.label}
                                className="card-3d-layer-1 rounded-2xl border border-border/70 bg-background/55 p-4 backdrop-blur"
                                style={{
                                  opacity: interpolatedStyles[index].opacity,
                                  transform: `translateZ(${20 + index * 6}px) translateY(${interpolatedStyles[index].translateY}px)`,
                                }}
                              >
                                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                                  {item.label}
                                </p>
                                <p className="mt-2 text-lg font-semibold text-foreground">
                                  {item.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </StaggeredMotion>
                    </div>
                  </Interactive3DCard>

                  <Motion
                    defaultStyle={{ opacity: 0, translateY: 24 }}
                    style={{
                      opacity: spring(1, quickSpring),
                      translateY: spring(0, quickSpring),
                    }}
                  >
                    {(cardStyle) => (
                      <div
                        style={{
                          opacity: cardStyle.opacity,
                          transform: `translateY(${cardStyle.translateY}px)`,
                        }}
                      >
                        <Interactive3DCard depth="medium" glare className="h-full">
                          <div className="glass-panel soft-glow rounded-[32px] p-6">
                            <p className="card-3d-layer-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                              {panelTitle}
                            </p>
                            <p className="card-3d-layer-3 mt-3 text-xl font-semibold tracking-tight text-foreground">
                              {statThreeTitle}
                            </p>
                            <p className="card-3d-layer-1 mt-3 text-sm leading-7 text-muted-foreground">
                              {panelDescription}
                            </p>

                            <div className="mt-6 space-y-3">
                              {[statOneTitle, statTwoTitle, statThreeTitle].map((label, index) => (
                                <Motion
                                  key={label}
                                  defaultStyle={{ opacity: 0, x: 14 }}
                                  style={{
                                    opacity: spring(1, quickSpring),
                                    x: spring(0, {
                                      stiffness: 118 + index * 10,
                                      damping: 17,
                                    }),
                                  }}
                                >
                                  {(rowStyle) => (
                                    <div
                                      className="card-3d-layer-1 flex items-center justify-between rounded-2xl border border-border/70 bg-background/55 px-4 py-3 backdrop-blur"
                                      style={{
                                        opacity: rowStyle.opacity,
                                        transform: `translateZ(${20 + index * 6}px) translateX(${rowStyle.x}px)`,
                                      }}
                                    >
                                      <span className="text-sm text-foreground">{label}</span>
                                      <span className="text-xs text-muted-foreground">
                                        0{index + 1}
                                      </span>
                                    </div>
                                  )}
                                </Motion>
                              ))}
                            </div>
                          </div>
                        </Interactive3DCard>
                      </div>
                    )}
                  </Motion>
                </div>
              </div>
            )}
          </Motion>

          <Motion
            defaultStyle={{ opacity: 0, translateX: 30 }}
            style={{
              opacity: spring(1, heroSpring),
              translateX: spring(0, heroSpring),
            }}
          >
            {(sceneStyle) => (
              <div
                className="relative lg:pt-6"
                style={{
                  opacity: sceneStyle.opacity,
                  transform: `translateX(${sceneStyle.translateX}px)`,
                }}
              >
                <Motion
                  defaultStyle={{ opacity: 0, translateY: 24 }}
                  style={{
                    opacity: spring(1, { stiffness: 104, damping: 18 }),
                    translateY: spring(0, { stiffness: 104, damping: 18 }),
                  }}
                >
                  {(sideStyle) => (
                    <div
                      className="absolute -left-4 top-8 hidden w-44 xl:block"
                      style={{
                        opacity: sideStyle.opacity,
                        transform: `translateY(${sideStyle.translateY}px)`,
                      }}
                    >
                      <Interactive3DCard depth="medium" glare>
                        <div className="rounded-[28px] border border-border/70 bg-background/70 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
                          <p className="card-3d-layer-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            {sideTitle}
                          </p>
                          <p className="card-3d-layer-3 mt-2 text-2xl font-semibold text-foreground">{sideValue}</p>
                          <p className="card-3d-layer-1 mt-2 text-sm leading-6 text-muted-foreground">
                            {sideDescription}
                          </p>
                        </div>
                      </Interactive3DCard>
                    </div>
                  )}
                </Motion>

                <HeroScene
                  sceneLabel={sceneLabel}
                  runtimeLabel={sceneRuntimeLabel}
                  runtimeValue={sceneRuntimeValue}
                  surfaceLabel={sceneSurfaceLabel}
                  surfaceValue={sceneSurfaceValue}
                />
              </div>
            )}
          </Motion>
        </div>
      </section>
    </main>
  );
}
