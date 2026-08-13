"use client";

import { useEffect, useMemo, useState } from "react";
import { RoughBox, Mascot } from "./zine";

/**
 * The signature interaction: drag a weight, watch the feed re-order.
 *
 * Weight defaults are the real production defaults from
 * home-mixer/params/param.rs in xai-org/x-algorithm. The six posts are
 * synthetic and labelled as such on the surface; their predicted
 * probabilities are illustrative, chosen so the arithmetic teaches what the
 * real weights do.
 */

type ActionKey =
  | "favorite"
  | "reply"
  | "retweet"
  | "copyLink"
  | "followAuthor"
  | "notInterested";

type Weight = {
  key: ActionKey;
  label: string;
  note: string;
  def: number;
  min: number;
  max: number;
  step: number;
  color: string;
};

const WEIGHTS: Weight[] = [
  {
    key: "favorite",
    label: "Like",
    note: "the cheapest signal there is",
    def: 0.5,
    min: 0,
    max: 20,
    step: 0.5,
    color: "#ffe84d",
  },
  {
    key: "reply",
    label: "Reply",
    note: "worth ten likes",
    def: 5,
    min: 0,
    max: 20,
    step: 0.5,
    color: "#ffe84d",
  },
  {
    key: "retweet",
    label: "Repost",
    note: "less than a reply, oddly",
    def: 1,
    min: 0,
    max: 20,
    step: 0.5,
    color: "#ffe84d",
  },
  {
    key: "copyLink",
    label: "Copy link & send it",
    note: "the biggest positive in the file",
    def: 20,
    min: 0,
    max: 40,
    step: 1,
    color: "#2dd4bf",
  },
  {
    key: "followAuthor",
    label: "Follow the author",
    note: "a whole new connection",
    def: 4,
    min: 0,
    max: 20,
    step: 0.5,
    color: "#2dd4bf",
  },
  {
    key: "notInterested",
    label: "Not interested",
    note: "negative, and it bites",
    def: -43.2,
    min: -120,
    max: 0,
    step: 1,
    color: "#ff6fae",
  },
];

type Post = {
  id: string;
  handle: string;
  text: string;
  kind: string;
  p: Record<ActionKey, number>;
};

const POSTS: Post[] = [
  {
    id: "thread",
    handle: "@stranger_who_writes",
    text: "I spent six months rebuilding our deploy pipeline. Here is everything that broke, in order.",
    kind: "someone you don't follow",
    p: {
      favorite: 0.11,
      reply: 0.01,
      retweet: 0.03,
      copyLink: 0.012,
      followAuthor: 0.03,
      notInterested: 0.004,
    },
  },
  {
    id: "news",
    handle: "@wire_service",
    text: "Court filing lands in the case everyone has been arguing about all week. Full document attached.",
    kind: "a link post",
    p: {
      favorite: 0.07,
      reply: 0.012,
      retweet: 0.04,
      copyLink: 0.02,
      followAuthor: 0.004,
      notInterested: 0.008,
    },
  },
  {
    id: "meme",
    handle: "@posting_hours",
    text: "nobody: / absolutely nobody: / my code at 4am:",
    kind: "a meme",
    p: {
      favorite: 0.3,
      reply: 0.008,
      retweet: 0.06,
      copyLink: 0.008,
      followAuthor: 0.002,
      notInterested: 0.006,
    },
  },
  {
    id: "dog",
    handle: "@your_actual_friend",
    text: "she found the one warm square of sun in the entire flat",
    kind: "someone you follow",
    p: {
      favorite: 0.22,
      reply: 0.015,
      retweet: 0.004,
      copyLink: 0.001,
      followAuthor: 0.001,
      notInterested: 0.002,
    },
  },
  {
    id: "take",
    handle: "@framework_wars",
    text: "Unpopular opinion: the framework you like is actually bad and the one you hate is fine.",
    kind: "a spicy take",
    p: {
      favorite: 0.09,
      reply: 0.06,
      retweet: 0.02,
      copyLink: 0.004,
      followAuthor: 0.006,
      notInterested: 0.02,
    },
  },
  {
    id: "bait",
    handle: "@reply_farm",
    text: "Reply with your city and I'll tell you something about you. Only 1% will be brave enough.",
    kind: "engagement bait",
    p: {
      favorite: 0.05,
      reply: 0.11,
      retweet: 0.01,
      copyLink: 0.001,
      followAuthor: 0.001,
      notInterested: 0.05,
    },
  },
];

const DEFAULTS = Object.fromEntries(
  WEIGHTS.map((w) => [w.key, w.def]),
) as Record<ActionKey, number>;

function score(post: Post, w: Record<ActionKey, number>): number {
  return WEIGHTS.reduce((sum, { key }) => sum + w[key] * post.p[key], 0);
}

export function WeightBench() {
  const [w, setW] = useState<Record<ActionKey, number>>(DEFAULTS);
  const [rowH, setRowH] = useState(104);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setRowH(mq.matches ? 112 : 148);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const ranked = useMemo(() => {
    const scored = POSTS.map((post) => ({ post, s: score(post, w) }));
    scored.sort((a, b) => b.s - a.s);
    const order = new Map(scored.map((row, i) => [row.post.id, i]));
    return { order, byId: new Map(scored.map((r) => [r.post.id, r.s])) };
  }, [w]);

  const dirty = WEIGHTS.some((x) => w[x.key] !== x.def);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
      {/* ---------------- the dials ---------------- */}
      <RoughBox
        seed="bench-controls"
        className="h-fit px-5 py-6 sm:px-7 sm:py-7"
        fill="rgba(255,255,255,0.5)"
      >
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h3 className="marker text-2xl sm:text-[1.7rem]">The dials</h3>
          <button
            type="button"
            onClick={() => setW(DEFAULTS)}
            disabled={!dirty}
            className="hand text-lg underline decoration-2 underline-offset-4 transition-opacity disabled:cursor-not-allowed disabled:opacity-35 hover:opacity-70"
          >
            put them back
          </button>
        </div>

        <ul className="flex flex-col gap-5">
          {WEIGHTS.map((weight) => {
            const val = w[weight.key];
            const changed = val !== weight.def;
            return (
              <li key={weight.key}>
                <label
                  className="flex items-baseline justify-between gap-3 pb-1.5"
                  htmlFor={`w-${weight.key}`}
                >
                  <span className="text-[0.95rem] font-semibold">
                    {weight.label}
                    <span className="hand ml-2 text-base font-bold text-[#514a3f]">
                      {weight.note}
                    </span>
                  </span>
                  <span
                    className={`marker tabular-nums text-lg ${changed ? "text-[#111]" : "text-[#514a3f]"}`}
                  >
                    {val > 0 ? "+" : ""}
                    {val.toFixed(val % 1 === 0 ? 0 : 1)}
                  </span>
                </label>
                <input
                  id={`w-${weight.key}`}
                  className="zine-range"
                  style={{ ["--thumb" as string]: weight.color }}
                  type="range"
                  min={weight.min}
                  max={weight.max}
                  step={weight.step}
                  value={val}
                  onChange={(e) =>
                    setW((prev) => ({
                      ...prev,
                      [weight.key]: Number(e.target.value),
                    }))
                  }
                />
              </li>
            );
          })}
        </ul>

        <p className="mt-6 border-t-2 border-dashed border-[#111]/25 pt-4 text-[0.9rem] leading-relaxed text-[#3d3934]">
          Every number starts at the real production default from{" "}
          <code className="rounded bg-[#111]/8 px-1.5 py-0.5 font-mono text-[0.82em]">
            param.rs
          </code>
          . Drag one and the feed on the right re-sorts as you drag.
        </p>
      </RoughBox>

      {/* ---------------- the feed ---------------- */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h3 className="marker text-2xl sm:text-[1.7rem]">Your feed</h3>
          <span className="hand rotate-[-1.5deg] bg-[#111] px-2.5 py-0.5 text-base font-bold text-[#fff8e8]">
            made-up posts, real arithmetic
          </span>
        </div>

        <ol
          className="relative"
          style={{ height: POSTS.length * rowH }}
          aria-label="Posts ranked by score"
        >
          {POSTS.map((post) => {
            const rank = ranked.order.get(post.id) ?? 0;
            const s = ranked.byId.get(post.id) ?? 0;
            const negative = s < 0;
            return (
              <li
                key={post.id}
                className="absolute inset-x-0 transition-transform duration-[520ms]"
                style={{
                  transform: `translateY(${rank * rowH}px)`,
                  transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                  height: rowH,
                  zIndex: POSTS.length - rank,
                }}
              >
                <RoughBox
                  seed={`post-${post.id}`}
                  className="mr-1 h-[calc(100%-14px)] overflow-hidden px-4 py-3 sm:px-5"
                  contentClassName="flex items-center gap-3 sm:gap-4"
                  fill={
                    rank === 0
                      ? "#ffe84d"
                      : negative
                        ? "#ffc9de"
                        : "#ffffff"
                  }
                  shadow={rank === 0}
                >
                  <span
                    className="marker w-6 shrink-0 text-2xl leading-none text-[#111] sm:w-8 sm:text-[1.7rem]"
                    aria-hidden="true"
                  >
                    {rank + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="hand text-lg leading-tight font-bold text-[#3d3934]">
                      {post.handle}{" "}
                      <span className="text-[#514a3f]">· {post.kind}</span>
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[0.88rem] leading-snug">
                      {post.text}
                    </p>
                  </div>

                  <span
                    className={`marker shrink-0 text-right text-lg leading-none tabular-nums sm:text-xl ${
                      negative ? "text-[#c2185b]" : "text-[#111]"
                    }`}
                  >
                    {s.toFixed(2)}
                  </span>
                </RoughBox>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 flex items-start gap-3">
          <Mascot mood="point" size={74} seed="bench-bot" className="shrink-0" />
          <p className="hand max-w-[46ch] pt-2 text-xl leading-snug">
            Drag <strong>Not interested</strong> up to zero and watch the reply
            farm climb straight to the top. The negative weights are most of
            what keeps bait out of your feed.
          </p>
        </div>
      </div>
    </div>
  );
}
