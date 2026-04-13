import { HomeHeroExperience } from "@/components/home/home-hero-experience";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getMessages(locale).home;

  const stats = [
    {
      label: t.panelStatOne,
      value: t.panelMetricOne,
    },
    {
      label: t.panelStatTwo,
      value: t.panelMetricTwo,
    },
    {
      label: t.panelStatThree,
      value: t.panelMetricThree,
    },
  ];

  return (
    <HomeHeroExperience
      badge={t.badge}
      spotlightLabel={t.spotlightLabel}
      spotlightValue={t.spotlightValue}
      title={t.title}
      accent={t.accent}
      description={t.description}
      primaryCta={t.primaryCta}
      secondaryCta={t.secondaryCta}
      panelEyebrow={t.panelEyebrow}
      deckTitle={t.deckTitle}
      deckDescription={t.deckDescription}
      panelTitle={t.panelTitle}
      panelDescription={t.panelDescription}
      live={t.live}
      statOneTitle={t.statOneTitle}
      statTwoTitle={t.statTwoTitle}
      statThreeTitle={t.statThreeTitle}
      sideTitle={t.sideTitle}
      sideValue={t.sideValue}
      sideDescription={t.sideDescription}
      sceneLabel={t.sceneLabel}
      sceneRuntimeLabel={t.sceneRuntimeLabel}
      sceneRuntimeValue={t.sceneRuntimeValue}
      sceneSurfaceLabel={t.sceneSurfaceLabel}
      sceneSurfaceValue={t.sceneSurfaceValue}
      stats={stats}
    />
  );
}
