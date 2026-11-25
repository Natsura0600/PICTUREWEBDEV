'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Star } from '@/components/brand/Star';
import { cn } from '@/lib/utils';

export type ProjectSlide = {
  slug: string;
  title: string;
  short: string;
  word: string;
  color: string;
  chips: [string, string];
  mobile: { src: string; blur: string };
  desktop: { src: string; blur: string };
};

/* ---------------- Medidas (diseño de 1440 × 900, en px de diseño) ---------------- */

const FRAME_W = 1440;
const CAP_CENTER = 403.5;
const CAP = 0.698; // altura de mayúsculas de Poppins
const BASELINE = 0.85; // línea de base de Poppins con line-height 1
const WORD_MAX = 445;

/** Sombras de piso, iguales en todos los slides: centro x, centro y, ancho, alto. */
const SHADOWS = [
  [380, 662, 170, 24],
  [720, 740, 330, 30],
  [1245, 652, 170, 22],
  [1060, 742, 150, 22],
] as const;

/** El "producto": un celular con la captura de la web. */
const PHONE = { x: 576, y: 122, w: 288, h: 604 };

type Piece = {
  kind: 'shot' | 'star' | 'chip';
  x: number;
  y: number;
  w: number;
  rot: number;
  chip?: 0 | 1;
  layer: 'fruit' | 'corner';
};

/** Piezas flotantes: cinco nítidas alrededor del celular y dos grandes y desenfocadas en las esquinas. */
const PIECES: Piece[] = [
  { kind: 'shot', x: 300, y: 158, w: 232, rot: -7, layer: 'fruit' },
  { kind: 'star', x: 980, y: 196, w: 96, rot: 14, layer: 'fruit' },
  { kind: 'chip', x: 236, y: 476, w: 0, rot: -5, chip: 0, layer: 'fruit' },
  { kind: 'shot', x: 1118, y: 410, w: 256, rot: 6, layer: 'fruit' },
  { kind: 'chip', x: 950, y: 606, w: 0, rot: 4, chip: 1, layer: 'fruit' },
  { kind: 'star', x: -46, y: 556, w: 300, rot: -12, layer: 'corner' },
  { kind: 'shot', x: 1262, y: 150, w: 280, rot: 10, layer: 'corner' },
];

const LAYERS = ['word', 'shadow', 'bottle', 'fruit', 'corner'] as const;
type Layer = (typeof LAYERS)[number];
/** Cuánto viaja cada capa al entrar (fracción del ancho del lienzo): la fruta más que la palabra. */
const PARALLAX: Record<Layer, number> = { word: 0.4, shadow: 0.3, bottle: 0.15, fruit: 0.55, corner: 0.75 };

/** Curva de cobertura medida de la cortina (t → c), con smoothstep entre puntos. */
const COVER: [number, number][] = [
  [0, 0],
  [0.031, 0.006],
  [0.134, 0.012],
  [0.206, 0.023],
  [0.278, 0.047],
  [0.34, 0.07],
  [0.412, 0.105],
  [0.485, 0.158],
  [0.546, 0.246],
  [0.583, 0.55],
  [0.62, 0.825],
  [0.69, 0.9],
  [0.79, 0.94],
  [0.85, 0.956],
  [0.93, 0.975],
  [1, 1],
];

function cover(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  for (let i = 1; i < COVER.length; i++) {
    const [t1, c1] = COVER[i]!;
    const [t0, c0] = COVER[i - 1]!;
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return c0 + (c1 - c0) * (3 * k * k - 2 * k * k * k);
    }
  }
  return 1;
}

const easeOutQuad = (k: number) => 1 - (1 - k) * (1 - k);
const clamp01 = (k: number) => Math.min(1, Math.max(0, k));

const WIPE_MS = 970;
const AUTOPLAY_MS = 2600;
const IDLE_MS = 6000;

/** Valores "al azar" pero fijos (iguales en el servidor y en el navegador). */
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const isMobileLayout = () => window.innerWidth <= 820 || window.innerHeight > window.innerWidth;

/**
 * Sección Proyectos: slider a pantalla completa, un slide por proyecto, sobre el negro de la marca.
 * Una palabra gigante en el color del proyecto va detrás del celular
 * con la web del proyecto, y alrededor flotan capturas, estrellas y etiquetas a distintas profundidades.
 * Al cambiar, el slide actual se cubre de derecha a izquierda y el nuevo entra con parallax.
 */
export function ProjectsSlider({ slides }: { slides: ProjectSlide[] }) {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const current = useRef(0);
  const busy = useRef(false);
  const lastInteraction = useRef(0);
  const inView = useRef(true);
  const reduce = useRef(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  const slideEls = () => Array.from(root.current?.querySelectorAll<HTMLElement>('.hs-slide') ?? []);
  const layerEls = (slide: HTMLElement) =>
    Object.fromEntries(LAYERS.map((l) => [l, slide.querySelector<HTMLElement>(`.hs-${l}`)!])) as Record<
      Layer,
      HTMLElement
    >;
  /** Ancho real del lienzo de diseño (1440u), medido en el slide visible. */
  const frameWidth = () =>
    root.current?.querySelector<HTMLElement>('.hs-slide:not([hidden]) .hs-frame')?.offsetWidth || FRAME_W;

  /* -------- Tamaño de la palabra gigante (mide la tinta real con canvas) -------- */
  const sizeWords = useCallback(() => {
    const el = root.current;
    if (!el) return;
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    const family = getComputedStyle(el).fontFamily;
    ctx.font = `700 100px ${family}`;
    const mobile = isMobileLayout();
    const u = frameWidth() / FRAME_W;
    const visible = Math.min(FRAME_W, window.innerWidth / u) * 0.92;
    const maxW = mobile ? visible : 1330;
    const target = mobile ? visible : 1400;

    el.querySelectorAll<HTMLElement>('.hs-word-text').forEach((w) => {
      const text = w.textContent ?? '';
      const m = ctx.measureText(text);
      const ink100 = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const gaps = Math.max(0, text.length - 1);
      let size = WORD_MAX;
      let spacing = 0.005;
      const at445 = (ink100 / 100 + spacing * gaps) * WORD_MAX;
      if (at445 > maxW) {
        spacing = -0.035;
        size = Math.min(WORD_MAX, target / (ink100 / 100 + spacing * gaps));
      }
      const baseline = CAP_CENTER + (CAP * size) / 2;
      w.style.setProperty('--fs', String(size));
      w.style.setProperty('--top', String(baseline - BASELINE * size));
      w.style.letterSpacing = `${spacing}em`;
    });
    el.classList.remove('hs-sizing');
  }, []);

  /* -------- Subrayado de la pestaña activa -------- */
  const moveBar = useCallback((i: number) => {
    const tab = tabsRef.current?.querySelectorAll<HTMLElement>('button')[i];
    const b = bar.current;
    if (!tab || !b) return;
    b.style.width = `${tab.offsetWidth}px`;
    b.style.transform = `translateX(${tab.offsetLeft}px)`;
  }, []);

  /* -------- Cambio de slide: cortina medida + parallax -------- */
  const go = useCallback(
    (to: number, dir: 1 | -1) => {
      const els = slideEls();
      const from = current.current;
      if (busy.current || to === from || !els[to] || !els[from]) return;
      const A = els[from];
      const B = els[to];
      current.current = to;
      setIndex(to);
      moveBar(to);

      const finish = () => {
        els.forEach((s, i) => {
          s.style.clipPath = '';
          s.style.zIndex = i === to ? '2' : '';
          s.hidden = i !== to;
          Object.values(layerEls(s)).forEach((l) => (l.style.transform = ''));
        });
        busy.current = false;
      };

      if (reduce.current) {
        finish();
        return;
      }

      busy.current = true;
      B.hidden = false;
      B.style.zIndex = '1';
      A.style.zIndex = '2';
      const W = frameWidth();
      const la = layerEls(A);
      const lb = layerEls(B);
      LAYERS.forEach((l) => (lb[l].style.transform = `translateX(${dir * PARALLAX[l] * W}px)`));
      const start = performance.now();

      const frame = (now: number) => {
        const t = (now - start) / WIPE_MS;
        const c = cover(t);
        A.style.clipPath = dir > 0 ? `inset(0 ${c * 100}% 0 0)` : `inset(0 0 0 ${c * 100}%)`;
        LAYERS.forEach((l) => (la[l].style.transform = `translateX(${-dir * c * 0.14 * W}px)`));
        const k = easeOutQuad(clamp01((t - 0.5) / 0.42));
        LAYERS.forEach((l) => (lb[l].style.transform = `translateX(${dir * (1 - k) * PARALLAX[l] * W}px)`));
        if (t < 1 || k < 1) requestAnimationFrame(frame);
        else finish();
      };
      requestAnimationFrame(frame);
    },
    [moveBar],
  );

  const next = useCallback(() => go((current.current + 1) % slides.length, 1), [go, slides.length]);
  const prev = useCallback(
    () => go((current.current - 1 + slides.length) % slides.length, -1),
    [go, slides.length],
  );
  const touch = () => {
    lastInteraction.current = performance.now();
  };

  /* -------- Arranque: fuentes, tamaños, secuencia de entrada, autoplay -------- */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let failsafe = 0;
    let cancelled = false;

    const reveal = () => {
      el.classList.remove('hs-pre');
      window.clearTimeout(failsafe);
    };

    // La entrada se reproduce la primera vez que la sección aparece en pantalla (con las fuentes listas)
    let fontsReady = false;
    let played = false;
    const intro = () => {
      if (played || !fontsReady || !inView.current) return;
      played = true;
      if (reduce.current) {
        reveal();
        return;
      }
      const W = frameWidth();
      const first = slideEls()[current.current];
      const ease = 'cubic-bezier(0.22, 0.8, 0.3, 1)';
      if (first) {
        const l = layerEls(first);
        LAYERS.forEach((name) =>
          l[name].animate(
            [{ transform: `translateX(${PARALLAX[name] * W}px)` }, { transform: 'translateX(0)' }],
            { duration: 900, easing: ease, fill: 'backwards' },
          ),
        );
      }
      el.querySelectorAll<HTMLElement>('[data-rise]').forEach((node) => {
        node.animate(
          [
            { opacity: 0, translate: '0 14px' },
            { opacity: 1, translate: '0 0' },
          ],
          { duration: 1000, delay: Number(node.dataset.rise) - 200, easing: ease, fill: 'backwards' },
        );
      });
      reveal();
      lastInteraction.current = performance.now() - IDLE_MS + 1500; // el autoplay arranca después de la entrada
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      sizeWords();
      moveBar(current.current);
      fontsReady = true;
      intro();
    });

    const onResize = () => {
      sizeWords();
      moveBar(current.current);
    };
    window.addEventListener('resize', onResize);

    // En pantalla: corre el autoplay, responden las flechas del teclado y se esconde el botón flotante de WhatsApp
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = !!entry?.isIntersecting && entry.intersectionRatio > 0.35;
        document.documentElement.toggleAttribute(
          'data-slider',
          inView.current && entry!.intersectionRatio > 0.6,
        );
        if (inView.current) {
          intro();
          // Si algo se demora, a los 3 s se muestra todo igual
          if (!played) failsafe = window.setTimeout(reveal, 3000);
        }
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(el);

    const timer = window.setInterval(() => {
      if (document.hidden || !inView.current) return;
      if (performance.now() - lastInteraction.current < IDLE_MS) return;
      next();
    }, AUTOPLAY_MS);

    const onKey = (e: KeyboardEvent) => {
      if (!inView.current || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === 'ArrowRight') {
        touch();
        next();
      } else if (e.key === 'ArrowLeft') {
        touch();
        prev();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      window.clearInterval(timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      io.disconnect();
      document.documentElement.removeAttribute('data-slider');
    };
  }, [sizeWords, moveBar, next, prev]);

  /* -------- Deslizar con el dedo o arrastrar con el mouse -------- */
  useEffect(() => {
    const stage = root.current?.querySelector<HTMLElement>('.hs-stage');
    if (!stage) return;
    let sx = 0;
    let sy = 0;
    let down = false;
    const onDown = (e: PointerEvent) => {
      down = true;
      sx = e.clientX;
      sy = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        touch();
        if (dx < 0) next();
        else prev();
      }
    };
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [next, prev]);

  const active = slides[index];

  return (
    <section
      ref={root}
      aria-roledescription="carrusel"
      id="proyectos"
      aria-labelledby="proyectos-title"
      className="hs hs-pre hs-sizing"
    >
      <div className="hs-stage">
        {slides.map((s, i) => (
          <div
            key={s.slug}
            className="hs-slide"
            style={{ '--c': s.color, zIndex: i === 0 ? 2 : undefined } as CSSProperties}
            hidden={i !== 0}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${slides.length}: ${s.title}`}
          >
            <div className="hs-frame">
              <div className="hs-layer hs-word" aria-hidden="true">
                <span className="hs-word-text">{s.word}</span>
              </div>
              <div className="hs-layer hs-shadow" aria-hidden="true">
                {SHADOWS.map(([cx, cy, w, h], k) => (
                  <span
                    key={k}
                    className="hs-floor"
                    style={{ '--x': cx - w / 2, '--y': cy - h / 2, '--w': w, '--h': h } as CSSProperties}
                  />
                ))}
              </div>
              <div className="hs-layer hs-bottle">
                <div
                  className="hs-phone"
                  style={{ '--x': PHONE.x, '--y': PHONE.y, '--w': PHONE.w, '--h': PHONE.h } as CSSProperties}
                >
                  <div className="hs-screen">
                    <Image
                      src={s.mobile.src}
                      alt={`${s.title} en el celular`}
                      fill
                      sizes="(max-width: 820px) 45vw, 22vw"
                      priority={i === 0}
                      placeholder="blur"
                      blurDataURL={s.mobile.blur}
                      className="object-cover object-top"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
              {(['fruit', 'corner'] as const).map((layer) => (
                <div key={layer} className={`hs-layer hs-${layer}`} aria-hidden="true">
                  {PIECES.map((p, k) => {
                    if (p.layer !== layer) return null;
                    const flip = i % 2 === 1 ? -1 : 1;
                    const style = {
                      '--x': p.x,
                      '--y': p.y,
                      '--w': p.w,
                      '--rot': `${p.rot * flip}deg`,
                      '--dur': `${(3.2 + rand(i * 10 + k) * 1.8).toFixed(2)}s`,
                      '--delay': `${(-rand(i * 10 + k + 5) * 4).toFixed(2)}s`,
                    } as CSSProperties;
                    return (
                      <div key={k} className={cn('hs-piece', `hs-piece--${p.kind}`)} style={style}>
                        <div className="hs-bob">
                          {p.kind === 'shot' ? (
                            <div className="hs-shot">
                              <Image
                                src={s.desktop.src}
                                alt=""
                                fill
                                sizes="(max-width: 820px) 30vw, 18vw"
                                placeholder="blur"
                                blurDataURL={s.desktop.blur}
                                className="object-cover object-top"
                                draggable={false}
                              />
                            </div>
                          ) : p.kind === 'star' ? (
                            <Star className="hs-star" />
                          ) : (
                            <span className="hs-chip">{s.chips[p.chip ?? 0]}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interfaz: arriba logo, proyectos y accesos; abajo "ver caso" y flechas */}
      <div className="hs-ui">
        <div className="hs-header">
          <h2 id="proyectos-title" className="hs-title" data-rise="250">
            <span className="hs-title-num">02 ·</span> Proyectos
          </h2>
          <div className="hs-tabs" data-rise="330" ref={tabsRef} role="group" aria-label="Proyectos">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                aria-current={i === index ? 'true' : undefined}
                onClick={() => {
                  touch();
                  go(i, i > current.current ? 1 : -1);
                }}
              >
                {s.short}
              </button>
            ))}
            <span ref={bar} className="hs-bar" aria-hidden="true" />
          </div>
        </div>

        <button
          type="button"
          className="hs-arrow hs-arrow--prev"
          data-rise="490"
          aria-label="Proyecto anterior"
          onClick={() => {
            touch();
            prev();
          }}
        >
          <svg viewBox="0 0 28 28" aria-hidden="true">
            <path d="M24 14H4 M12 6l-8 8 8 8" />
          </svg>
        </button>
        {active ? (
          <Link href={`/proyectos/${active.slug}`} className="hs-cta" data-rise="570">
            Ver caso
          </Link>
        ) : null}
        <button
          type="button"
          className="hs-arrow hs-arrow--next"
          data-rise="650"
          aria-label="Proyecto siguiente"
          onClick={() => {
            touch();
            next();
          }}
        >
          <svg viewBox="0 0 28 28" aria-hidden="true">
            <path d="M4 14h20 M16 6l8 8-8 8" />
          </svg>
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {active ? `Proyecto ${index + 1} de ${slides.length}: ${active.title}` : ''}
      </p>
    </section>
  );
}
