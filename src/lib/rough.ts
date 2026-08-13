/**
 * Hand-drawn geometry.
 *
 * Every path is generated from a string seed, so the server and the client
 * draw the identical wobble and hydration stays quiet. Amplitudes are in
 * viewBox units; boxes draw into a 0 0 100 100 box stretched with
 * preserveAspectRatio="none" and vector-effect="non-scaling-stroke", which
 * keeps the ink weight even while the geometry follows the element.
 */

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rng(seed: string) {
  const r = mulberry32(hashSeed(seed));
  return {
    /** signed jitter in [-amp, amp] */
    j: (amp: number) => (r() * 2 - 1) * amp,
    /** float in [min, max] */
    f: (min: number, max: number) => min + r() * (max - min),
    next: r,
  };
}

type Pt = [number, number];

/** One marker stroke between two points: a cubic with drifting control points. */
function stroke(a: Pt, b: Pt, r: ReturnType<typeof rng>, amp: number): string {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const c1x = x1 + (x2 - x1) * 0.32 + r.j(amp);
  const c1y = y1 + (y2 - y1) * 0.32 + r.j(amp);
  const c2x = x1 + (x2 - x1) * 0.68 + r.j(amp);
  const c2y = y1 + (y2 - y1) * 0.68 + r.j(amp);
  return `C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/**
 * A rectangle drawn by hand. Corners overshoot slightly, the way a pen does
 * when the wrist carries past the turn.
 */
export function roughRect(seed: string, amp = 1.5, overshoot = 2.4): string {
  const r = rng(seed);
  const o = () => r.f(0, overshoot);
  const p = 2; // inset so the stroke is not clipped

  const tl: Pt = [p + r.j(amp), p + r.j(amp)];
  const tr: Pt = [100 - p + r.j(amp), p + r.j(amp)];
  const br: Pt = [100 - p + r.j(amp), 100 - p + r.j(amp)];
  const bl: Pt = [p + r.j(amp), 100 - p + r.j(amp)];

  return [
    `M ${(tl[0] - o()).toFixed(2)} ${tl[1].toFixed(2)}`,
    stroke(tl, tr, r, amp),
    stroke(tr, br, r, amp),
    stroke(br, bl, r, amp),
    stroke(bl, [tl[0], tl[1] - o()], r, amp),
  ].join(" ");
}

/** Smooth a run of points into one continuous curve. */
function smooth(pts: Pt[]): string {
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

function edgePoints(seed: string, amp: number, overshoot: number): Pt[] {
  const r = rng(seed);
  const n = 5;
  const pts: Pt[] = [];
  const start = -overshoot + r.j(1.5);
  const end = 100 + overshoot + r.j(1.5);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([start + t * (end - start), 10 + r.j(amp)]);
  }
  return pts;
}

/**
 * One edge of a hand-drawn box.
 *
 * Each edge draws into a strip (100x12 across, 12x100 down) that is stretched
 * along its own axis only, so the wobble runs perpendicular to the stretch and
 * its amplitude survives at any element size. The edges overshoot their
 * corners and cross, the way a pen does when the wrist carries past the turn.
 */
export function roughEdgeH(seed: string, amp = 3.4, overshoot = 4): string {
  return smooth(edgePoints(seed, amp, overshoot));
}

export function roughEdgeV(seed: string, amp = 3.4, overshoot = 4): string {
  return smooth(
    edgePoints(seed, amp, overshoot).map(([a, b]) => [b, a] as Pt),
  );
}

/**
 * A hand-dashed vertical thread for a 0 0 20 100 strip.
 *
 * The dashes are drawn as separate sub-paths rather than a strokeDasharray,
 * because a dash pattern under a non-uniform stretch plus a non-scaling stroke
 * renders at an unpredictable length. Drawing them means the thread always
 * spans the gap it is given.
 */
export function roughDashedV(seed: string, dashes = 6): string {
  const r = rng(seed);
  const out: string[] = [];
  const span = 100 / dashes;
  for (let i = 0; i < dashes; i++) {
    const y0 = i * span + span * 0.16;
    const y1 = (i + 1) * span - span * 0.16;
    const x0 = 10 + r.j(2.6);
    const x1 = 10 + r.j(2.6);
    const cx = 10 + r.j(3.2);
    out.push(
      `M ${x0.toFixed(2)} ${y0.toFixed(2)} Q ${cx.toFixed(2)} ${((y0 + y1) / 2).toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    );
  }
  return out.join(" ");
}

/** A wobbling straight line across a 0 0 100 100 box. */
export function roughLine(
  seed: string,
  from: Pt = [0, 50],
  to: Pt = [100, 50],
  amp = 1.6,
): string {
  const r = rng(seed);
  return `M ${from[0]} ${from[1]} ${stroke(from, to, r, amp)}`;
}

/**
 * A hand-drawn underline: two passes, the second lighter and trailing off.
 * Drawn into a 100x14 strip stretched horizontally only, so the wobble keeps
 * its amplitude however wide the word is.
 */
export function roughUnderline(seed: string): [string, string] {
  const a = rng(seed + "-a");
  const b = rng(seed + "-b");
  const pass = (r: ReturnType<typeof rng>, y: number, from: number, to: number) => {
    const pts: Pt[] = [];
    const n = 4;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push([from + t * (to - from), y + r.j(2.1)]);
    }
    return smooth(pts);
  };
  return [pass(a, 5, -1, 101), pass(b, 9.5, 4, 94)];
}

/**
 * A doodled arrow from a to b with a curved shaft and a two-stroke head.
 * Returns the shaft and the head separately so they can draw on in sequence.
 */
export function roughArrow(
  seed: string,
  from: Pt,
  to: Pt,
  bend = 14,
): { shaft: string; head: string } {
  const r = rng(seed);
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // push the midpoint perpendicular to the run for the loop of a doodled arrow
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bend + r.j(2);
  const cy = my + ny * bend + r.j(2);

  const shaft = `M ${x1} ${y1} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x2} ${y2}`;

  // head angle follows the tangent at the end of the quadratic
  const tanx = x2 - cx;
  const tany = y2 - cy;
  const ta = Math.atan2(tany, tanx);
  const hl = Math.max(7, len * 0.16);
  const spread = 0.42;
  const h1x = x2 - hl * Math.cos(ta - spread);
  const h1y = y2 - hl * Math.sin(ta - spread);
  const h2x = x2 - hl * Math.cos(ta + spread);
  const h2y = y2 - hl * Math.sin(ta + spread);

  const head =
    `M ${h1x.toFixed(2)} ${h1y.toFixed(2)} L ${x2} ${y2} ` +
    `L ${h2x.toFixed(2)} ${h2y.toFixed(2)}`;

  return { shaft, head };
}

/** Deterministic small rotation, for taped-on things that sit crooked. */
export function tilt(seed: string, max = 1.4): number {
  return Number(rng(seed).j(max).toFixed(2));
}
