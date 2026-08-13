import type { ReactNode, CSSProperties } from "react";
import { roughEdgeH, roughEdgeV, roughUnderline, tilt } from "@/lib/rough";

/* ------------------------------------------------------------------ *
 * Ink primitives
 * ------------------------------------------------------------------ */

type BoxProps = {
  children: ReactNode;
  seed: string;
  className?: string;
  /**
   * Layout for the content layer. The box paints its ink and fill as absolute
   * siblings, so children live one level in; flex and grid belong here, not on
   * `className`, or they would only ever lay out this single wrapper.
   */
  contentClassName?: string;
  /** ink colour of the border */
  stroke?: string;
  width?: number;
  /** hard marker shadow, the way a second pass sits under the first */
  shadow?: boolean;
  fill?: string;
  style?: CSSProperties;
  as?: "div" | "li" | "section" | "article" | "aside";
};

/**
 * A panel with a hand-inked border. Two passes: a heavier one and a lighter
 * ghost, which is what stops it reading as a CSS rectangle.
 */
export function RoughBox({
  children,
  seed,
  className = "",
  contentClassName = "",
  stroke = "#111111",
  width = 2.4,
  shadow = false,
  fill,
  style,
  as: Tag = "div",
}: BoxProps) {
  const edges = [
    {
      k: "t",
      box: "0 0 100 20",
      cls: "-top-2.5 right-0 left-0 h-5 w-full",
      d: roughEdgeH(seed + "-t"),
      g: roughEdgeH(seed + "-tg", 4.2),
    },
    {
      k: "b",
      box: "0 0 100 20",
      cls: "-bottom-2.5 right-0 left-0 h-5 w-full",
      d: roughEdgeH(seed + "-b"),
      g: roughEdgeH(seed + "-bg", 4.2),
    },
    {
      k: "l",
      box: "0 0 20 100",
      cls: "top-0 -left-2.5 h-full w-5",
      d: roughEdgeV(seed + "-l"),
      g: roughEdgeV(seed + "-lg", 4.2),
    },
    {
      k: "r",
      box: "0 0 20 100",
      cls: "top-0 -right-2.5 h-full w-5",
      d: roughEdgeV(seed + "-r"),
      g: roughEdgeV(seed + "-rg", 4.2),
    },
  ];

  return (
    <Tag className={`relative ${className}`} style={style}>
      {/* Colour sits just inside the ink, the way a hand fills within its own
          line. At inset-0 a flat fill pokes out past the wobble. */}
      {fill && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[3px] rounded-[4px]"
          style={{ background: fill }}
        />
      )}
      {/* the second pass a pen makes under a box it wants to emphasise */}
      {shadow &&
        edges.map((e) => (
          <svg
            key={`sh-${e.k}`}
            className={`pointer-events-none absolute translate-x-[3.5px] translate-y-[4.5px] overflow-visible ${e.cls}`}
            viewBox={e.box}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={e.g}
              fill="none"
              stroke={stroke}
              strokeWidth={width * 0.85}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.42}
            />
          </svg>
        ))}
      {edges.map((e) => (
        <svg
          key={e.k}
          className={`pointer-events-none absolute overflow-visible ${e.cls}`}
          viewBox={e.box}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={e.g}
            fill="none"
            stroke={stroke}
            strokeWidth={width * 0.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0.3}
          />
          <path
            d={e.d}
            fill="none"
            stroke={stroke}
            strokeWidth={width}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ))}
      <div className={`relative h-full ${contentClassName}`}>{children}</div>
    </Tag>
  );
}

/** Two marker passes under a word or phrase. */
export function Underline({
  seed,
  color = "#2dd4bf",
  className = "",
  draw = false,
}: {
  seed: string;
  color?: string;
  className?: string;
  draw?: boolean;
}) {
  const [a, b] = roughUnderline(seed);
  return (
    <svg
      className={`block h-[0.4em] w-full overflow-visible ${className}`}
      viewBox="0 0 100 14"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={a}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className={draw ? "ink-path" : undefined}
        style={draw ? ({ "--len": 140 } as CSSProperties) : undefined}
      />
      <path
        d={b}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.5}
        className={draw ? "ink-path" : undefined}
        style={
          draw
            ? ({ "--len": 140, transitionDelay: "180ms" } as CSSProperties)
            : undefined
        }
      />
    </svg>
  );
}

/** Highlighter swipe behind inline text. */
export function Swipe({
  children,
  color = "#ffe84d",
  draw = false,
}: {
  children: ReactNode;
  color?: string;
  draw?: boolean;
}) {
  return (
    <span
      className={`swipe ${draw ? "swipe-draw" : ""}`}
      style={{ ["--swipe-color" as string]: color }}
    >
      {children}
    </span>
  );
}

/** A strip of masking tape. */
export function Tape({
  seed,
  className = "",
  color = "rgba(255,232,77,0.62)",
}: {
  seed: string;
  className?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`tape ${className}`}
      style={{
        background: color,
        transform: `rotate(${tilt(seed, 3.2)}deg)`,
      }}
    />
  );
}

/**
 * Real code, photocopied and taped onto the page. This is how the zine keeps
 * technical material credible: the marker does the explaining, the photocopy
 * carries the facts.
 */
export function Photocopy({
  file,
  children,
  seed,
  className = "",
  note,
}: {
  file: string;
  children: ReactNode;
  seed: string;
  className?: string;
  note?: ReactNode;
}) {
  return (
    <figure
      className={`relative ${className}`}
      style={{ transform: `rotate(${tilt(seed, 1.1)}deg)` }}
    >
      <RoughBox
        seed={seed}
        className="bg-white/70 px-4 pt-3 pb-4 shadow-[0_2px_14px_rgba(17,17,17,0.10)]"
        width={2}
      >
        <Tape seed={seed + "-t1"} className="-top-6 -left-7 z-10" />
        <Tape
          seed={seed + "-t2"}
          className="-right-7 -bottom-6 z-10"
          color="rgba(45,212,191,0.5)"
        />
        <figcaption className="mb-2.5 flex items-center gap-2 border-b-2 border-dashed border-[#111]/22 pb-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff6fae]"
            aria-hidden="true"
          />
          <span
            className="inline-block h-2.5 w-2.5 rounded-full bg-[#ffe84d]"
            aria-hidden="true"
          />
          <span
            className="inline-block h-2.5 w-2.5 rounded-full bg-[#2dd4bf]"
            aria-hidden="true"
          />
          <code className="ml-1.5 font-mono text-[0.78rem] font-medium text-[#3d3934]">
            {file}
          </code>
        </figcaption>
        <pre className="overflow-x-auto font-mono text-[0.76rem] leading-[1.75] text-[#111] sm:text-[0.82rem]">
          {children}
        </pre>
      </RoughBox>
      {note && (
        <p className="hand mt-2.5 text-xl leading-tight text-[#c2185b]">
          {note}
        </p>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ *
 * Doodle icons — one consistent marker stroke, drawn not borrowed
 * ------------------------------------------------------------------ */

function Doodle({
  children,
  className = "",
  size = 44,
  color = "#111111",
}: {
  children: ReactNode;
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      /* marker weight: the page is drawn in heavy ink, so the icons are too */
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const Icon = {
  /** two stacked posts — the in-network pile */
  Stack: (p: { size?: number; color?: string; className?: string }) => (
    <Doodle {...p}>
      <path d="M9 16.5c4-1 9-1.4 15-1.2 6 .2 11 .9 15 1.6" />
      <path d="M8.6 16.8c-.4 4-.5 8 .1 12.2M39.4 17c.5 4.2.4 8.3-.2 12.4" />
      <path d="M8.9 29.4c4.2 1 9.3 1.4 15.2 1.3 5.9-.1 10.9-.6 15.1-1.3" />
      <path d="M12.5 35.6c3.6.9 8 1.3 13 1.2 5-.1 9.3-.6 12.6-1.3" />
      <path d="M15 41c3 .7 6.6 1 10.7 1 4.1-.1 7.7-.5 10.4-1.1" />
    </Doodle>
  ),
  /** radar sweep — retrieval from outside your follows */
  Radar: (p: { size?: number; color?: string; className?: string }) => (
    <Doodle {...p}>
      <path d="M24 6.5C14.3 6.6 6.6 14.4 6.6 24S14.4 41.5 24 41.5 41.4 33.7 41.4 24c0-4.6-1.8-8.9-4.7-12" />
      <path d="M24 13.6c-5.7 0-10.3 4.6-10.4 10.3 0 5.7 4.6 10.4 10.3 10.5" />
      <path d="M24 24 38.6 11.2" />
      <circle cx="24" cy="24" r="2.2" />
    </Doodle>
  ),
  /** a brain with a wire — the model */
  Brain: (p: { size?: number; color?: string; className?: string }) => (
    <Doodle {...p}>
      <path d="M20 10.5c-4.2-1.3-8.4 1-9.2 5-3.6.9-5.4 4.6-4 8-2.6 2.4-2.3 6.6.6 8.6-.6 3.9 2.6 7.3 6.6 6.9 1.4 3.1 5.2 4.3 8.1 2.4" />
      <path d="M22 10c2-2.4 5.8-2.3 7.7.2 3.7-1.1 7.4 1.6 7.5 5.5 3.2 1.5 4.1 5.6 1.9 8.3 1.8 3.2.1 7.2-3.4 8.2-.2 3.6-3.9 5.9-7.2 4.6" />
      <path d="M22 10.2v27.4" />
      <path d="M22 19c-2.2.3-4.3-1-5-3M22 27.5c2.3.4 4.6-.9 5.4-3.1" />
    </Doodle>
  ),
  /** sieve — the filters */
  Sieve: (p: { size?: number; color?: string; className?: string }) => (
    <Doodle {...p}>
      <path d="M7.5 13.5c4.6-1.4 10-2.1 16.5-2.1s11.9.7 16.5 2.1" />
      <path d="M7.6 13.7 20 33.5c1.7 2.7 6.5 2.8 8.3.1L40.4 13.6" />
      <path d="M12.5 20.5h23M16.5 27h15" />
      <path d="M24 36.5v6M18.5 38.5l-1.5 4M29.5 38.5l1.6 4" />
    </Doodle>
  ),
  /** eye with a slash — dropped */
  EyeOff: (p: { size?: number; color?: string; className?: string }) => (
    <Doodle {...p}>
      <path d="M6 24.5c4.5-6.4 10.6-9.7 18-9.7 7.3 0 13.4 3.2 18 9.6-2.6 3.7-5.7 6.4-9.2 8" />
      <path d="M27.8 33.3c-1.2.3-2.5.4-3.8.4-7.4 0-13.5-3.2-18-9.2" />
      <circle cx="24" cy="24" r="5.2" />
      <path d="M10 39 38 9.5" />
    </Doodle>
  ),
  /** a post under a cover you tap through — the interstitial */
  Curtain: (p: { size?: number; color?: string; className?: string }) => (
    <Doodle {...p}>
      {/* the covered post */}
      <path d="M10 10.5c9.3-1 18.9-1 28.2.2.9 9.2.9 18.3.1 27.5-9.4 1-19 1-28.4-.1-.9-9.2-.8-18.4.1-27.6Z" />
      {/* hatching: the cover itself */}
      <path d="M13 25.5 25 13M13 34.5 34.5 13M21.5 35.5 35.5 21.5M31 36.5l4.5-4.5" />
    </Doodle>
  ),
  /** check in a hand-drawn circle */
  Check: (p: { size?: number; color?: string; className?: string }) => (
    <Doodle {...p}>
      <path d="M24 6.6c-9.5 0-17.3 7.7-17.4 17.2 0 9.6 7.6 17.4 17.2 17.6 9.6.1 17.5-7.5 17.6-17.1.1-4.4-1.5-8.4-4.3-11.5" />
      <path d="M15.5 24.5 21.8 31 33.5 17.5" />
    </Doodle>
  ),
  /** clock — the 48 hour cut */
  Clock: (p: { size?: number; color?: string; className?: string }) => (
    <Doodle {...p}>
      <path d="M24 7c-9.4 0-17 7.6-17 17s7.6 17 17 17 17-7.6 17-17c0-4.3-1.6-8.3-4.3-11.3" />
      <path d="M24 13.5V24l7.5 5" />
    </Doodle>
  ),
  /** arrow that loops back — repeat authors */
  Loop: (p: { size?: number; color?: string; className?: string }) => (
    <Doodle {...p}>
      <path d="M11 20.5c2.5-6 7.4-9 13.7-8.6 6.2.4 10.6 4 12.6 9.8" />
      <path d="M37 27.5c-2.6 6-7.6 9-13.9 8.5-6.2-.4-10.5-4-12.4-9.9" />
      <path d="M31.5 20.8h6.2l-.8-6.4M16.5 27.2h-6.2l.8 6.4" />
    </Doodle>
  ),
};

/* ------------------------------------------------------------------ *
 * Zine Bot — the mascot, with expressions for the states it marks
 * ------------------------------------------------------------------ */

export function Mascot({
  mood = "happy",
  size = 120,
  className = "",
  seed = "bot",
}: {
  mood?: "happy" | "point" | "pointUp" | "warn" | "sad";
  size?: number;
  className?: string;
  seed?: string;
}) {
  const teal = "#2dd4bf";
  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={(size * 140) / 120}
      fill="none"
      className={className}
      style={{ transform: `rotate(${tilt(seed, 2)}deg)` }}
      role="img"
      aria-label="The zine's guide character"
    >
      <g
        stroke="#111111"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* teal halo, the way the board draws it */}
        <path
          d="M60 15c-19 0-34 13.5-34 31 0 8 3 15 8 20.5"
          stroke={teal}
          strokeWidth={4}
        />
        <path
          d="M92 56c1.4-3.4 2-7 2-10.5C94 28.5 79.5 15.5 61 15"
          stroke={teal}
          strokeWidth={4}
        />

        {/* head */}
        <path d="M60 22c-16.5 0-29 11-29 25.5 0 13 10.5 23 24 24.3 3.3.3 6.7.3 10 0 13.5-1.3 24-11.3 24-24.3C89 33 76.5 22 60 22Z" />

        {/* hair spikes */}
        <path d="M46 20.5 43 10M56 18.5l-1.5-11M66 18.8 68.5 8M75 22.5l5-8.5" />

        {/* glasses */}
        <circle cx="48" cy="46" r="10.5" />
        <circle cx="72" cy="46" r="10.5" />
        <path d="M58.5 45.5h3" />

        {/* eyes */}
        {mood === "sad" ? (
          <>
            <path d="M44.5 48.5c1.5-2 4.5-2 6 0" />
            <path d="M69.5 48.5c1.5-2 4.5-2 6 0" />
          </>
        ) : mood === "warn" ? (
          <>
            <circle cx="48" cy="46" r="3.4" fill="#111111" stroke="none" />
            <circle cx="72" cy="46" r="3.4" fill="#111111" stroke="none" />
            <path d="M40 35.5 52 32M80 35.5 68 32" />
          </>
        ) : (
          <>
            <circle cx="48.5" cy="46" r="3.6" fill="#111111" stroke="none" />
            <circle cx="72.5" cy="46" r="3.6" fill="#111111" stroke="none" />
          </>
        )}

        {/* mouth */}
        {mood === "sad" ? (
          <path d="M52 63c2.5-3 8-3.5 12-1" />
        ) : mood === "warn" ? (
          <path d="M52 62.5c4 1.5 8 1.5 12 0" />
        ) : (
          <path d="M50 59c3 6 12 7.5 17 1.5" />
        )}

        {/* body */}
        <path d="M60 72v28" />
        <path d="M42 88c5.5-4 11.5-6 18-6s12.5 2 18 6" />
        <path d="M48 100c-3 8-4 15-3 22M72 100c3 8 4 15 3 22" />

        {/* arms */}
        {mood === "pointUp" ? (
          <>
            <path d="M44 84c-6 2-10 6-12 11" />
            {/* arm raised straight up, index finger extended above the head */}
            <path d="M74 84c5-6 7-14 7-23" />
            <path d="M81 61c.5-6 .5-11 .2-15.5" />
            <path
              d="M74 40 69 34M81 36.5l.5-7M89 40.5l5.5-5.5"
              stroke={teal}
              strokeWidth={2.6}
            />
          </>
        ) : mood === "point" ? (
          <>
            <path d="M44 84c-6 2-10 6-12 11" />
            <path d="M76 84c7 1 12 5 16 10" />
            <path d="M92 94c3.5-1 6-3 7-6" />
            {/* spark lines by the pointing hand */}
            <path
              d="M100 82.5 106 79M101 88.5l7 .5M97 76l3.5-5.5"
              stroke={teal}
              strokeWidth={2.6}
            />
          </>
        ) : (
          <>
            <path d="M44 84c-7 2.5-11.5 7-13 13" />
            <path d="M76 84c7 2.5 11.5 7 13 13" />
          </>
        )}
      </g>
    </svg>
  );
}
