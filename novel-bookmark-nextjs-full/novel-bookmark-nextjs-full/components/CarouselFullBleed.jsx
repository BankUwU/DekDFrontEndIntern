import { useEffect, useMemo, useRef, useState } from "react";

const slides = [
  { id: "b1", image: "/img/b1.png" },
  { id: "b2", image: "/img/b2.png" },
  { id: "b3", image: "/img/b3.png" },
];

export default function BannerCarousel() {
  // Seamless loop with clones
  const trackSlides = useMemo(
    () => [slides[slides.length - 1], ...slides, slides[0]],
    []
  );

  const [index, setIndex] = useState(1);
  const [animating, setAnimating] = useState(true);
  const autoplayRef = useRef(null);

  // ---- viewport width (SSR safe) ----
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const getVW = () =>
      Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
    const update = () => setVw(getVW());
    update(); // set once on mount
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // layout knobs
  const SLIDE_VW = 70;  // slide width as % of viewport
  const GAP_PX   = 16;  // gap between slides
  const HEIGHT   = 220; // banner height px

  // ---- autoplay ----
  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []);
  const startAuto = () => {
    stopAuto();
    autoplayRef.current = setInterval(() => setIndex((i) => i + 1), 3000);
  };
  const stopAuto = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  // ---- seamless jump for clones ----
  const onTransitionEnd = () => {
    setAnimating(false);
    if (index === trackSlides.length - 1) setIndex(1);
    else if (index === 0) setIndex(slides.length);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
  };

  // ---- center current slide ----
  const computeTranslate = () => {
    if (!vw) return 0; // during SSR/very first render
    const slideW = (SLIDE_VW / 100) * vw; // px
    const cardSpace = slideW + GAP_PX;
    const slideCenter = index * cardSpace + slideW / 2;
    const viewportCenter = vw / 2;
    return viewportCenter - slideCenter; // px
  };

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") { stopAuto(); setIndex((i) => i + 1); startAuto(); }
      if (e.key === "ArrowLeft")  { stopAuto(); setIndex((i) => i - 1); startAuto(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // styles
  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: `${HEIGHT}px`,
    overflow: "hidden",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
  };
  const trackStyle = {
    display: "flex",
    gap: `${GAP_PX}px`,
    height: "100%",
    transform: `translateX(${computeTranslate()}px)`,
    transition: animating ? "transform 500ms ease-in-out" : "none",
  };
  const cardStyle = {
    flex: `0 0 ${SLIDE_VW}vw`,
    height: "100%",
    borderRadius: "10px",
    overflow: "hidden",
  };
  const arrowStyle = (side) => ({
    position: "absolute",
    [side]: 8,
    top: "50%",
    transform: "translateY(-50%)",
    height: 40,
    width: 40,
    borderRadius: "9999px",
    background: "rgba(0,0,0,0.4)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    lineHeight: 1,
  });

  return (
    <div
      style={containerStyle}
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
      aria-roledescription="carousel"
    >
      <div style={trackStyle} onTransitionEnd={onTransitionEnd}>
        {trackSlides.map((s, i) => (
          <div key={`${s.id}-${i}`} style={cardStyle}>
            <img
              src={s.image}
              alt={`Banner ${s.id}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              draggable={false}
              loading="eager"
              decoding="async"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous banner"
        onClick={() => { stopAuto(); setIndex((i) => i - 1); startAuto(); }}
        style={arrowStyle("left")}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next banner"
        onClick={() => { stopAuto(); setIndex((i) => i + 1); startAuto(); }}
        style={arrowStyle("right")}
      >
        ›
      </button>
    </div>
  );
}
