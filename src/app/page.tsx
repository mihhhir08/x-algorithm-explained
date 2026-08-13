import { Reveal } from "@/components/Reveal";
import { WeightBench } from "@/components/WeightBench";
import {
  RoughBox,
  Underline,
  Swipe,
  Tape,
  Photocopy,
  Mascot,
  Icon,
} from "@/components/zine";
import { roughArrow, roughLine, roughDashedV } from "@/lib/rough";

const REPO = "https://github.com/xai-org/x-algorithm";

/* ------------------------------------------------------------------ *
 * small local pieces
 * ------------------------------------------------------------------ */

function DoodleArrow({
  seed,
  className = "",
  bend = 16,
  from = [4, 50] as [number, number],
  to = [96, 50] as [number, number],
  color = "#111111",
}: {
  seed: string;
  className?: string;
  bend?: number;
  from?: [number, number];
  to?: [number, number];
  color?: string;
}) {
  const { shaft, head } = roughArrow(seed, from, to, bend);
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d={shaft}
        fill="none"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="ink-path"
        style={{ ["--len" as string]: 220 }}
      />
      <path
        d={head}
        fill="none"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className="ink-path"
        style={{ ["--len" as string]: 60, transitionDelay: "600ms" }}
      />
    </svg>
  );
}

function SectionHeading({
  children,
  sub,
  color = "#2dd4bf",
  seed,
}: {
  children: React.ReactNode;
  sub?: React.ReactNode;
  color?: string;
  seed: string;
}) {
  return (
    <div className="mb-9">
      <h2 className="marker marker-lift max-w-[17ch] text-[2.1rem] leading-[0.95] text-balance sm:text-[3rem]">
        {children}
      </h2>
      <Underline seed={seed} color={color} draw className="mt-1.5 max-w-[11ch]" />
      {sub && (
        <p className="mt-5 max-w-[64ch] text-[1.05rem] leading-relaxed text-[#3d3934]">
          {sub}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

const QUICK = [
  {
    icon: Icon.Stack,
    title: "Posts get gathered",
    body: "From accounts you follow, and from accounts you don't. Two piles, thrown together.",
    color: "#ffe84d",
  },
  {
    icon: Icon.Brain,
    title: "A model guesses",
    body: "For every single post it predicts: will you like this? reply? share it? mute them?",
    color: "#2dd4bf",
  },
  {
    icon: Icon.Sieve,
    title: "Guesses become one number",
    body: "Each guess is multiplied by a weight and added up. Highest number goes to the top.",
    color: "#ffe84d",
  },
  {
    icon: Icon.EyeOff,
    title: "Separately, some get hidden",
    body: "A different system decides whether a post is allowed to be shown to you at all.",
    color: "#ff6fae",
  },
];

const STAGES = [
  {
    n: 1,
    title: "It looks you up",
    body: "What you recently engaged with, who you follow, who you block and mute, your muted words, what you've already been shown.",
    tag: "query hydration",
  },
  {
    n: 2,
    title: "It fetches candidates",
    body: "Thunder grabs recent posts from your follows. Phoenix and SimClusters go find posts from strangers. Both run at the same time.",
    tag: "candidate sources",
  },
  {
    n: 3,
    title: "It fills in the details",
    body: "Text, images, who wrote it, what language, engagement counts, whether it's subscriber-only.",
    tag: "candidate hydration",
  },
  {
    n: 4,
    title: "It throws a lot away",
    body: "Duplicates. Anything older than 48 hours. Your own posts. People you blocked. Words you muted. Posts you've already seen.",
    tag: "pre-scoring filters",
  },
  {
    n: 5,
    title: "It scores what's left",
    body: "The model predicts every action you might take, and those predictions get combined into one number per post.",
    tag: "scoring",
  },
  {
    n: 6,
    title: "It keeps the best ones",
    body: "Sort by score. Keep the top handful. Everything else is gone.",
    tag: "selection",
  },
  {
    n: 7,
    title: "It checks what's allowed",
    body: "Only now does it ask, post by post: is this one even allowed to be shown to you? Anything it says no to is dropped.",
    tag: "post-selection filters",
  },
];

const OUTCOMES = [
  {
    icon: Icon.Check,
    word: "Allow",
    body: "Show it normally. Most posts, most of the time.",
    color: "#2dd4bf",
    fill: "#2dd4bf",
  },
  {
    icon: Icon.Curtain,
    word: "Interstitial",
    body: "Show it, but behind a cover you have to tap through first.",
    color: "#ffe84d",
    fill: "#ffe84d",
  },
  {
    icon: Icon.EyeOff,
    word: "Drop",
    body: "Don't show it. You never learn it existed. So does anything replying to it, quoting it, or reposting it.",
    color: "#ff6fae",
    fill: "#ff6fae",
  },
];

export default function Home() {
  return (
    <main className="tex-vignette relative mx-auto w-full max-w-[1180px] px-5 sm:px-8">
      {/* ================= masthead ================= */}
      <header className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-2.5">
          <Mascot mood="happy" size={42} seed="masthead" />
          <span className="marker text-xl">The Feed, Explained</span>
        </div>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer noopener"
          className="hand text-xl underline decoration-2 underline-offset-4 transition-opacity hover:opacity-65"
        >
          read the real code →
        </a>
      </header>

      <svg
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
        className="h-1 w-full overflow-visible"
        aria-hidden="true"
      >
        <path
          d={roughLine("masthead-rule", [0, 2], [100, 2], 0.7)}
          fill="none"
          stroke="#111111"
          strokeWidth={2.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* ================= 1. hero ================= */}
      <Reveal as="section" className="pt-7 pb-12 sm:pt-14 sm:pb-20">
        <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-14">
          <div className="rise">
            <h1 className="marker marker-lift text-[2.7rem] leading-[0.9] sm:text-[4.2rem] lg:text-[5rem]">
              Why am I
              <br />
              seeing{" "}
              <Swipe color="#ff6fae" draw>
                this?
              </Swipe>
            </h1>

            <p className="mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-[#3d3934] sm:mt-7 sm:text-[1.12rem]">
              In August 2026, xAI published the code behind X&apos;s{" "}
              <strong className="font-semibold text-[#111]">For You</strong>{" "}
              feed. This is the short version — what actually happens between
              your refresh and a post reaching your eyes.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <RoughBox
                seed="hero-cta"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                fill="#ffe84d"
                shadow
                width={2.8}
              >
                <a
                  href="#sixty"
                  className="marker block px-7 py-3.5 text-xl text-[#111]"
                >
                  Start here ↓
                </a>
              </RoughBox>
              <a
                href="#score"
                className="hand text-xl underline decoration-2 underline-offset-4 transition-opacity hover:opacity-65"
              >
                or skip to the fun part
              </a>
            </div>

            <p className="hand mt-6 max-w-[40ch] text-lg leading-tight text-[#514a3f]">
              Not made by X or xAI. Just a reader&apos;s guide to their
              open-source repo.
            </p>
          </div>

          {/* mascot + taped code */}
          <div className="relative">
            <Photocopy
              file="ranking_scorer.rs"
              seed="hero-code"
              className="mx-auto max-w-[30rem]"
              note="↑ that's the whole ranking idea, honestly"
            >
              <span className="text-[#514a3f]">
                {"// every action you might take, weighted"}
              </span>
              {"\n"}
              {"score = Σ ( weight"}
              <sub>i</sub>
              {" × P(action"}
              <sub>i</sub>
              {") )"}
              {"\n\n"}
              <span className="text-[#514a3f]">{"// e.g."}</span>
              {"\n"}
              {"  reply    →   "}
              <span className="bg-[#ffe84d]">{"+5.0"}</span>
              {"\n"}
              {"  like     →   "}
              <span className="bg-[#ffe84d]">{"+0.5"}</span>
              {"\n"}
              {"  report   →  "}
              <span className="bg-[#ff6fae]">{"-234.0"}</span>
            </Photocopy>

            {/* the guide gestures up into the taped code */}
            <div className="mt-3 flex items-start gap-3">
              <Mascot
                mood="pointUp"
                size={104}
                seed="hero-bot"
                className="shrink-0"
              />
              <p className="hand max-w-[24ch] pt-7 text-xl leading-tight text-[#514a3f]">
                Those three numbers are real. They are sitting in a file you can
                open right now.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ================= 2. sixty seconds ================= */}
      <Reveal as="section" id="sixty" className="scroll-mt-8 py-16 sm:py-20">
        <SectionHeading
          seed="h-sixty"
          sub="Four things happen. If you only read one section, read this one."
        >
          The whole thing in sixty seconds
        </SectionHeading>

        <ol className="grid gap-x-7 gap-y-9 sm:grid-cols-2">
          {QUICK.map((item, i) => {
            const IconC = item.icon;
            return (
              <li
                key={item.title}
                className="rise relative flex gap-4"
                style={{ ["--delay" as string]: `${i * 110}ms` }}
              >
                <div className="shrink-0">
                  <RoughBox
                    seed={`quick-${i}`}
                    className="h-16 w-16"
                    contentClassName="grid place-items-center"
                    fill={item.color}
                  >
                    <IconC size={34} />
                  </RoughBox>
                </div>
                <div className="pt-1">
                  <h3 className="marker text-[1.35rem] leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-[42ch] text-[0.98rem] leading-relaxed text-[#3d3934]">
                    {item.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <RoughBox
          seed="sixty-note"
          className="rise mt-12 max-w-[74ch] px-6 py-5"
          fill="rgba(45,212,191,0.12)"
          style={{ ["--delay" as string]: "480ms" }}
        >
          <p className="text-[1.02rem] leading-relaxed">
            <strong className="marker mr-1.5 text-[1.2rem]">
              The one thing people get wrong:
            </strong>
            ranking and hiding are two different systems. One decides the{" "}
            <em>order</em>. The other decides whether a post is allowed on your
            screen at all. They run separately, on different inputs, with
            different rules.
          </p>
        </RoughBox>
      </Reveal>

      {/* ================= 3. where posts come from ================= */}
      <Reveal as="section" className="py-16 sm:py-20">
        <SectionHeading
          seed="h-sources"
          color="#ffe84d"
          sub="Every refresh pulls from two pools at once."
        >
          Where the posts come from
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <RoughBox
            seed="src-in"
            className="rise px-6 py-7"
            fill="rgba(255,255,255,0.55)"
          >
            <Icon.Stack size={46} />
            <h3 className="marker mt-3 text-[1.6rem]">People you follow</h3>
            <p className="hand text-xl text-[#514a3f]">in-network</p>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-[#3d3934]">
              A service called <strong>Thunder</strong> keeps recent posts
              sitting in memory as they&apos;re published, so it can hand over
              your follows&apos; latest posts immediately.
            </p>
          </RoughBox>

          <RoughBox
            seed="src-out"
            className="rise px-6 py-7"
            fill="rgba(255,255,255,0.55)"
            style={{ ["--delay" as string]: "140ms" }}
          >
            <Icon.Radar size={46} />
            <h3 className="marker mt-3 text-[1.6rem]">Total strangers</h3>
            <p className="hand text-xl text-[#514a3f]">out-of-network</p>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-[#3d3934]">
              <strong>Phoenix</strong> turns you and every post into vectors and
              finds the closest ones. <strong>SimClusters</strong> groups
              accounts by who engages with what, then pulls from your clusters.
            </p>
          </RoughBox>
        </div>

        <div className="rise mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <DoodleArrow
            seed="merge"
            className="h-12 w-full sm:w-40"
            bend={-18}
            color="#2dd4bf"
          />
          <p className="hand max-w-[44ch] text-center text-2xl leading-tight sm:text-left">
            …and then both piles get ranked{" "}
            <span className="underline decoration-[#ff6fae] decoration-4 underline-offset-4">
              by the same model
            </span>
            , together, in one list.
          </p>
        </div>
      </Reveal>

      {/* ================= 4. the pipeline ================= */}
      <Reveal as="section" className="py-16 sm:py-20">
        <SectionHeading
          seed="h-pipe"
          sub="Seven steps, in this order, every single time you refresh. The repo calls it the Post Pipeline."
        >
          What happens when you refresh
        </SectionHeading>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-14">
        <ol className="relative">
          {STAGES.map((stage, i) => (
            <li
              key={stage.n}
              className="rise relative pb-8 pl-14 last:pb-0 sm:pl-20"
              style={{ ["--delay" as string]: `${i * 80}ms` }}
            >
              {/* the running thread down the left */}
              {i < STAGES.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-11 bottom-1 left-[15px] block w-2.5 sm:left-[21px]"
                >
                  <svg
                    className="h-full w-full overflow-visible"
                    viewBox="0 0 20 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={roughDashedV(`thread-${stage.n}`, 5)}
                      fill="none"
                      stroke="#111111"
                      strokeWidth={2.6}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      opacity={0.62}
                    />
                  </svg>
                </span>
              )}

              <span className="marker absolute top-0 left-0 grid h-10 w-10 place-items-center rounded-full bg-[#111] text-[1.25rem] text-[#fff8e8] sm:h-[52px] sm:w-[52px] sm:text-[1.5rem]">
                {stage.n}
              </span>

              <h3 className="marker text-[1.45rem] leading-tight sm:text-[1.7rem]">
                {stage.title}
              </h3>
              <p className="hand -mt-0.5 text-lg text-[#514a3f]">{stage.tag}</p>
              <p className="mt-2 max-w-[58ch] text-[1rem] leading-relaxed text-[#3d3934]">
                {stage.body}
              </p>
            </li>
          ))}
        </ol>

          <aside className="rise flex flex-col gap-6 lg:h-full lg:justify-between lg:gap-8">
            <Mascot mood="warn" size={84} seed="pipe-bot" className="mb-2" />
            <RoughBox
              seed="pipe-note"
              className="px-6 py-5"
              fill="#fdf3c2"
            >
              <p className="text-[1rem] leading-relaxed">
                Notice the order: posts are{" "}
                <strong>scored and sorted first</strong>, and only then checked
                for whether they&apos;re allowed. Ranking never sees the safety
                rules. That separation is deliberate.
              </p>
            </RoughBox>
            <div className="mt-5 flex items-start gap-3">
              <DoodleArrow
                seed="pipe-arrow"
                className="mt-1 h-14 w-12 shrink-0"
                from={[80, 4]}
                to={[18, 92]}
                bend={22}
                color="#ff6fae"
              />
              <p className="hand text-xl leading-tight text-[#514a3f]">
                Steps 1&ndash;6 decide the <em>order</em>. Step 7 decides what
                you are allowed to see at all.
              </p>
            </div>

            <RoughBox
              seed="pipe-scrap"
              className="mt-6 px-5 py-4"
              fill="#ffffff"
            >
              <p className="text-[0.95rem] leading-relaxed">
                <strong className="marker text-[1.05rem]">48 hours.</strong>{" "}
                That is the age cut in step 4. Older than that and a post never
                reaches scoring at all.
              </p>
            </RoughBox>
          </aside>
        </div>
      </Reveal>

      {/* ================= 5. the score ================= */}
      <Reveal as="section" id="score" className="scroll-mt-8 py-16 sm:py-20">
        <SectionHeading
          seed="h-score"
          color="#ff6fae"
          sub="The model predicts a probability for roughly twenty different actions. Each one is multiplied by a weight, and the results are added together. That sum is the post's score — and you can play with the weights yourself."
        >
          The part that decides the order
        </SectionHeading>

        <WeightBench />

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
          <div className="rise">
            <h3 className="marker text-[1.6rem]">
              The weights are just… sitting there
            </h3>
            <p className="mt-3 max-w-[54ch] text-[1rem] leading-relaxed text-[#3d3934]">
              They&apos;re plain numbers in a file anyone can read. A few of them
              say a lot about what the feed is built to want:
            </p>

            <ul className="mt-5 flex flex-col gap-3.5">
              {[
                {
                  t: "A reply is worth 10 likes.",
                  d: "5.0 against 0.5. Conversation beats approval.",
                },
                {
                  t: "Copying a link to send someone is worth the most.",
                  d: "20.0 — more than a reply, a repost and a like combined.",
                },
                {
                  t: "Muting hurts more than blocking.",
                  d: "−58.8 against −31.2. Quietly walking away is the stronger signal.",
                },
                {
                  t: "Plain dwell time is switched off.",
                  d: "0.0. Time-on-post, on its own, counts for nothing.",
                },
              ].map((row, i) => (
                <li key={row.t} className="flex gap-3">
                  <span
                    className="mt-2 h-2.5 w-2.5 shrink-0 rotate-45 bg-[#ff6fae]"
                    aria-hidden="true"
                    style={{ ["--delay" as string]: `${i * 60}ms` }}
                  />
                  <p className="text-[0.99rem] leading-relaxed">
                    <strong className="font-semibold">{row.t}</strong>{" "}
                    <span className="text-[#3d3934]">{row.d}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <Photocopy
            file="home-mixer/params/param.rs"
            seed="weights-code"
            className="rise mx-auto max-w-[26rem]"
            note="↑ real defaults, straight out of the repo"
          >
            {"reply              "}
            <span className="bg-[#ffe84d]">{"  5.0"}</span>
            {"\n"}
            {"quote              "}
            <span className="bg-[#ffe84d]">{"  5.0"}</span>
            {"\n"}
            {"share via DM       "}
            <span className="bg-[#ffe84d]">{"  5.0"}</span>
            {"\n"}
            {"share via link     "}
            <span className="bg-[#2dd4bf]">{" 20.0"}</span>
            {"\n"}
            {"follow author      "}
            <span className="bg-[#ffe84d]">{"  4.0"}</span>
            {"\n"}
            {"share              "}
            {"  2.0\n"}
            {"repost             "}
            {"  1.0\n"}
            {"like               "}
            {"  0.5\n"}
            {"dwell              "}
            {"  0.0\n"}
            {"\n"}
            {"not interested   "}
            <span className="bg-[#ff6fae]">{" -43.2"}</span>
            {"\n"}
            {"block author     "}
            <span className="bg-[#ff6fae]">{" -31.2"}</span>
            {"\n"}
            {"mute author      "}
            <span className="bg-[#ff6fae]">{" -58.8"}</span>
            {"\n"}
            {"report          "}
            <span className="bg-[#ff6fae]">{" -234.0"}</span>
          </Photocopy>
        </div>

        <RoughBox
          seed="score-after"
          className="rise mt-12 max-w-[76ch] px-6 py-5"
          fill="rgba(255,255,255,0.5)"
        >
          <h3 className="marker text-[1.35rem]">Then three thumbs on the scale</h3>
          <p className="mt-2.5 text-[1rem] leading-relaxed text-[#3d3934]">
            After the sum, the score gets adjusted.{" "}
            <strong className="text-[#111]">Same author twice?</strong> Each
            extra post from them is worth less than the last.{" "}
            <strong className="text-[#111]">From a stranger?</strong> Multiplied
            down a little.{" "}
            <strong className="text-[#111]">A brand-new author?</strong> Given a
            lift, so new accounts aren&apos;t invisible forever.
          </p>
        </RoughBox>
      </Reveal>

      {/* ================= 6. what gets hidden ================= */}
      <Reveal as="section" className="py-16 sm:py-20">
        <SectionHeading
          seed="h-hidden"
          color="#ff6fae"
          sub="A separate service is asked about every surviving post: can this be shown to this person? It answers one of three ways."
        >
          The other system: what gets hidden
        </SectionHeading>

        <div className="grid gap-7 md:grid-cols-3 md:gap-9">
          {OUTCOMES.map((o, i) => {
            const IconC = o.icon;
            return (
              <RoughBox
                key={o.word}
                seed={`out-${o.word}`}
                className="rise px-6 py-7"
                fill={o.fill}
                shadow={o.word === "Drop"}
                style={{ ["--delay" as string]: `${i * 130}ms` }}
              >
                <IconC size={44} />
                <h3 className="marker mt-3 text-[1.7rem]">{o.word}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-[#3d3934]">
                  {o.body}
                </p>
              </RoughBox>
            );
          })}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <div className="rise">
            <h3 className="marker text-[1.6rem]">Where the labels come from</h3>
            <p className="mt-3 max-w-[56ch] text-[1rem] leading-relaxed text-[#3d3934]">
              That decision reads <strong>labels</strong> — tags attached to
              posts and accounts by a whole separate set of systems running
              continuously in the background, nowhere near your refresh:
            </p>
            <ul className="mt-4 flex max-w-[56ch] flex-col gap-2.5 text-[0.98rem] leading-relaxed">
              <li>
                <strong>Classifiers</strong> read posts, images and video as
                they&apos;re published.
              </li>
              <li>
                <strong>Account models</strong> score accounts on how others
                respond to them, on patterns of behaviour over time, and on
                their position in the follow graph.
              </li>
              <li>
                <strong>Rules</strong> react to events as they happen and stick
                labels on.
              </li>
            </ul>
            <p className="mt-4 max-w-[56ch] text-[1rem] leading-relaxed text-[#3d3934]">
              Plus your own settings: who you block, who you mute, words
              you&apos;ve muted, your country, whether you&apos;ve asked to see
              sensitive media.
            </p>
          </div>

          <RoughBox
            seed="hidden-nuance"
            className="rise h-fit px-6 py-6"
            fill="rgba(255,232,77,0.3)"
          >
            <Icon.Loop size={46} />
            <h3 className="marker mt-2.5 text-[1.3rem]">
              The same post can go both ways
            </h3>
            <p className="mt-2 text-[0.98rem] leading-relaxed text-[#3d3934]">
              Some rules only fire when a post is being{" "}
              <em>recommended to a stranger</em>. If you follow the author, that
              same post comes through fine. Suspected spam gets caught
              aggressively on the recommendation path and left alone on the
              follow path.
            </p>
          </RoughBox>
        </div>
      </Reveal>

      {/* ================= 7. close ================= */}
      <Reveal as="section" className="py-16 sm:py-24">
        <RoughBox
          seed="close"
          className="relative px-7 py-12 sm:px-14 sm:py-16"
          fill="#ffffff"
          width={3}
        >
          <span className="tex-dots pointer-events-none absolute inset-[3px] opacity-40" />
          <Tape seed="close-tape" className="-top-3 left-1/2 -ml-[54px]" />

          <div className="relative text-center">
            <h2 className="marker marker-lift mx-auto max-w-[16ch] text-[2.3rem] leading-[0.95] sm:text-[3.2rem]">
              Now go read
              <br />
              <Swipe color="#2dd4bf" draw>
                the real thing
              </Swipe>
            </h2>
            <p className="mx-auto mt-6 max-w-[54ch] text-[1.05rem] leading-relaxed text-[#3d3934]">
              Everything on this page is a simplification of code you can open
              yourself. The filters have names. The weights are numbers in a
              file. You can disagree with any of it — but now you know where to
              look.
            </p>

            <div className="mt-10 flex flex-col items-center gap-5">
              <span className="relative inline-block">
                {/* doink marks, the way the board draws an emphasised button */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 -right-7 h-10 w-10 overflow-visible"
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  strokeLinecap="round"
                >
                  <path d="M22 14 33 6M26 22l12 1.5M18 8l2.5-8" />
                </svg>
                <RoughBox
                  seed="close-cta"
                  className="transition-transform duration-200 hover:-translate-y-0.5"
                  fill="#111111"
                  stroke="#111111"
                  shadow
                  width={3}
                >
                  <a
                    href={REPO}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="marker block px-8 py-4 text-xl text-[#fff8e8]"
                  >
                    xai-org/x-algorithm ↗
                  </a>
                </RoughBox>
              </span>

              <a
                href="https://x.com/i/under_the_hood"
                target="_blank"
                rel="noreferrer noopener"
                className="hand text-xl underline decoration-2 underline-offset-4 transition-opacity hover:opacity-65"
              >
                check the labels on your own account ↗
              </a>
            </div>

            <div className="mt-10 flex items-end justify-center gap-4">
              <Mascot mood="happy" size={96} seed="close-bot" />
              <p className="hand max-w-[22ch] pb-3 text-left text-xl leading-tight text-[#514a3f]">
                It only looks like a black box from the outside.
              </p>
            </div>
          </div>
        </RoughBox>
      </Reveal>

      {/* ================= colophon ================= */}
      <footer className="border-t-2 border-dashed border-[#111]/25 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-[58ch] text-[0.92rem] leading-relaxed text-[#3d3934]">
            An independent explainer of{" "}
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-2 underline-offset-4"
            >
              xai-org/x-algorithm
            </a>
            , written from the repository as published on 13 August 2026. Not
            affiliated with, endorsed by, or connected to X Corp. or xAI. The
            example posts are invented; the weights and stage names are real.
            The algorithm changes — the code is the source of truth, not this
            page.
          </p>
          <div className="shrink-0">
            <a
              href="https://mihirsinhchavda.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="hand text-xl underline decoration-2 underline-offset-4 transition-opacity hover:opacity-65"
            >
              made by Mihir Chavda ↗
            </a>
            <p className="hand text-xl text-[#514a3f]">
              made to be argued with
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
