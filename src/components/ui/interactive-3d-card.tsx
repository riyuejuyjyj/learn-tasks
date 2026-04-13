"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Motion, spring } from "react-motion";

import { cn } from "@/lib/utils";

type DepthPreset = "subtle" | "medium";

type Interactive3DCardProps = {
  children: ReactNode;
  className?: string;
  depth?: DepthPreset;
  glare?: boolean;
  interactive?: boolean;
};

const depthConfig = {
  subtle: {
    rotateX: 7,
    rotateY: 9,
    lift: 10,
    scale: 1.008,
    shadow: 0.16,
    spring: { stiffness: 180, damping: 24 },
  },
  medium: {
    rotateX: 11,
    rotateY: 14,
    lift: 18,
    scale: 1.014,
    shadow: 0.24,
    spring: { stiffness: 170, damping: 22 },
  },
} as const;

export function Interactive3DCard({
  children,
  className,
  depth = "subtle",
  glare = false,
  interactive = true,
}: Interactive3DCardProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [target, setTarget] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    shadow: 0.1,
    lift: 0,
    scale: 1,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    const syncPreferences = () => {
      setIsReducedMotion(reducedMotionQuery.matches);
      setIsCoarsePointer(coarsePointerQuery.matches);
    };

    syncPreferences();

    reducedMotionQuery.addEventListener("change", syncPreferences);
    coarsePointerQuery.addEventListener("change", syncPreferences);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncPreferences);
      coarsePointerQuery.removeEventListener("change", syncPreferences);
    };
  }, []);

  const settings = depthConfig[depth];
  const canInteract = interactive && !isReducedMotion && !isCoarsePointer;

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!canInteract) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const normalizedX = px * 2 - 1;
    const normalizedY = py * 2 - 1;

    setTarget({
      rotateX: normalizedY * -settings.rotateX,
      rotateY: normalizedX * settings.rotateY,
      glareX: px * 100,
      glareY: py * 100,
      shadow: settings.shadow,
      lift: settings.lift,
      scale: settings.scale,
    });
  }

  function handlePointerLeave() {
    setTarget({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      shadow: 0.1,
      lift: 0,
      scale: 1,
    });
  }

  const springConfig = settings.spring;

  const staticStyle = useMemo<CSSProperties>(
    () => ({
      transform: "rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
      boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
    }),
    [],
  );

  if (!canInteract) {
    return (
      <div className={cn("card-3d-shell", className)}>
        <div className="card-3d-inner card-3d-static" style={staticStyle}>
          {glare ? (
            <span
              className="card-3d-glare"
              aria-hidden="true"
              style={
                {
                  "--glare-x": "50%",
                  "--glare-y": "50%",
                  "--glare-opacity": 0.22,
                } as CSSProperties
              }
            />
          ) : null}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("card-3d-shell", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Motion
        defaultStyle={{
          rotateX: 0,
          rotateY: 0,
          glareX: 50,
          glareY: 50,
          shadow: 0.1,
          lift: 0,
          scale: 1,
        }}
        style={{
          rotateX: spring(target.rotateX, springConfig),
          rotateY: spring(target.rotateY, springConfig),
          glareX: spring(target.glareX, springConfig),
          glareY: spring(target.glareY, springConfig),
          shadow: spring(target.shadow, springConfig),
          lift: spring(target.lift, springConfig),
          scale: spring(target.scale, springConfig),
        }}
      >
        {(interpolated) => (
          <div
            className="card-3d-inner"
            style={{
              transform: `rotateX(${interpolated.rotateX}deg) rotateY(${interpolated.rotateY}deg) translateY(${-interpolated.lift}px) scale(${interpolated.scale})`,
              boxShadow: `0 ${28 + interpolated.lift * 1.4}px ${64 + interpolated.lift * 1.2}px rgba(15,23,42,${interpolated.shadow})`,
            }}
          >
            {glare ? (
              <span
                className="card-3d-glare"
                aria-hidden="true"
                style={
                  {
                    "--glare-x": `${interpolated.glareX}%`,
                    "--glare-y": `${interpolated.glareY}%`,
                    "--glare-opacity": 0.34,
                  } as CSSProperties
                }
              />
            ) : null}
            {children}
          </div>
        )}
      </Motion>
    </div>
  );
}
