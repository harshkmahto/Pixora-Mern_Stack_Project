import React, { useEffect, useState, useRef } from "react";
import SummaryApi from "../common";
import apiRequest from "../utils/apiRequest";
import AllServiceCard from "../components/service/AllServiceCard";

/* ─────────────────────────────────────────────
   Tiny hook: fires once when element enters view
───────────────────────────────────────────── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/* ─────────────────────────────────────────────
   Skeleton card loader
───────────────────────────────────────────── */
const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ animation: `skelePulse 1.6s ${delay}s ease-in-out infinite` }}
  >
    <div style={{ background: "var(--skel-bg)", height: 180, borderRadius: "12px 12px 0 0" }} />
    <div style={{ background: "var(--card-bg)", padding: "1rem", borderRadius: "0 0 12px 12px" }}>
      <div style={{ background: "var(--skel-bg)", height: 14, borderRadius: 6, marginBottom: 8, width: "70%" }} />
      <div style={{ background: "var(--skel-bg)", height: 10, borderRadius: 6, width: "50%" }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Animated category pill
───────────────────────────────────────────── */
const CategoryPill = ({ label, active, onClick, index }) => (
  <button
    onClick={onClick}
    style={{
      animationDelay: `${index * 60}ms`,
      background: active ? "var(--accent)" : "var(--pill-bg)",
      color: active ? "#fff" : "var(--text-muted)",
      border: active ? "1.5px solid var(--accent)" : "1.5px solid var(--pill-border)",
      boxShadow: active ? "0 4px 20px var(--accent-glow)" : "none",
      transform: active ? "scale(1.04)" : "scale(1)",
    }}
    className="sc-pill"
  >
    {active && <span className="sc-pill-dot" />}
    {label}
  </button>
);

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const ServiceCategory = () => {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [gridVisible, setGridVisible] = useState(false);
  const [heroRef, heroInView] = useInView(0.1);
  const [panelRef, panelInView] = useInView(0.1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiRequest(SummaryApi.services.getPublicServices);
        setServices(response.services);
        setFiltered(response.services);
        const uniqueCategories = [...new Set(response.services.map((s) => s.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
        setTimeout(() => setGridVisible(true), 100);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    setGridVisible(false);
    const t = setTimeout(() => {
      setFiltered(
        selectedCategory === "all" ? services : services.filter((s) => s.category === selectedCategory)
      );
      setGridVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [selectedCategory, services]);

  return (
    <>
      {/* ── Global styles injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;0,900;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --accent: #e8633a;
          --accent-soft: #f5a07a;
          --accent-glow: rgba(232,99,58,0.35);
          --bg: #f7f5f1;
          --card-bg: #ffffff;
          --pill-bg: rgba(255,255,255,0.9);
          --pill-border: #e2ddd8;
          --text: #1a1714;
          --text-muted: #7a736b;
          --panel-bg: #ffffff;
          --skel-bg: #e8e4df;
          --grid-line: rgba(0,0,0,0.06);
        }
        .dark-sc {
          --bg: #111010;
          --card-bg: #1b1918;
          --pill-bg: rgba(35,32,30,0.9);
          --pill-border: #2e2a27;
          --text: #f0ece6;
          --text-muted: #8a8078;
          --panel-bg: #1b1918;
          --skel-bg: #2a2725;
          --grid-line: rgba(255,255,255,0.04);
        }

        .sc-page {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Subtle grid texture */
        .sc-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        /* Ambient blobs */
        .sc-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.18;
          pointer-events: none;
          z-index: 0;
        }
        .sc-blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #e8633a, transparent);
          top: -120px; right: -100px;
        }
        .sc-blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #6b9cdb, transparent);
          bottom: 10%; left: -80px;
        }

        .sc-inner { position: relative; z-index: 1; padding: 2rem 1rem 4rem; max-width: 1400px; margin: 0 auto; }
        @media(min-width: 768px){ .sc-inner { padding: 3rem 2.5rem 5rem; } }

        /* Hero */
        .sc-hero { text-align: center; margin-bottom: 3.5rem; }
        .sc-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--accent); font-weight: 500; margin-bottom: 1rem;
        }
        .sc-eyebrow-line { width: 28px; height: 1.5px; background: var(--accent); }
        .sc-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.4rem, 6vw, 5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--text);
          margin: 0 0 1rem;
        }
        .sc-title em { font-style: italic; color: var(--accent); }
        .sc-subtitle {
          font-size: 0.95rem; color: var(--text-muted); font-weight: 300;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .sc-count-badge {
          background: var(--accent); color: #fff;
          font-size: 0.72rem; font-weight: 600;
          padding: 2px 9px; border-radius: 20px;
          letter-spacing: 0.05em;
        }

        /* Animate hero in */
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-visible { animation: heroFade 0.7s cubic-bezier(0.22,1,0.36,1) both; }

        /* Layout */
        .sc-layout { display: grid; gap: 2rem; }
        @media(min-width: 900px){ .sc-layout { grid-template-columns: 260px 1fr; } }

        /* Filter Panel */
        .sc-panel {
          background: var(--panel-bg);
          border-radius: 20px;
          border: 1px solid var(--pill-border);
          padding: 1.5rem;
          height: fit-content;
          position: sticky;
          top: 88px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.06);
        }
        @keyframes panelSlide {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .panel-visible { animation: panelSlide 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) both; }

        .sc-panel-label {
          font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-muted); font-weight: 500; margin-bottom: 1.1rem;
          padding-bottom: 0.8rem; border-bottom: 1px solid var(--pill-border);
        }

        /* Pills */
        .sc-pills { display: flex; flex-direction: column; gap: 6px; }
        .sc-pill {
          width: 100%; text-align: left;
          padding: 9px 14px; border-radius: 10px;
          font-size: 0.85rem; font-weight: 400;
          cursor: pointer; transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
          display: flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif;
        }
        .sc-pill:hover { transform: translateX(4px) !important; }
        @keyframes pillIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .panel-visible .sc-pill { animation: pillIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .sc-pill-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.8); flex-shrink: 0;
        }

        /* Mobile horizontal scroll pills */
        @media(max-width: 899px){
          .sc-panel { position: static; padding: 1rem 1.2rem; }
          .sc-pills { flex-direction: row; overflow-x: auto; padding-bottom: 4px; gap: 8px; flex-wrap: nowrap; }
          .sc-pills::-webkit-scrollbar { display: none; }
          .sc-pill { white-space: nowrap; width: auto; flex-shrink: 0; }
          .sc-panel-label { display: none; }
        }

        /* Service grid */
        .sc-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: 1fr;
        }
        @media(min-width: 540px){ .sc-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1024px){ .sc-grid { grid-template-columns: repeat(3, 1fr); } }

        @keyframes gridFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .grid-visible { animation: gridFade 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .grid-hidden { opacity: 0; }

        /* Card stagger wrapper */
        .sc-card-wrap { animation: cardPop 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes cardPop {
          from { opacity: 0; transform: translateY(22px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Empty state */
        .sc-empty {
          grid-column: 1/-1;
          text-align: center; padding: 5rem 1rem;
        }
        .sc-empty-icon {
          font-size: 3.5rem; margin-bottom: 1rem;
          display: block; animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .sc-empty-title {
          font-family: 'Fraunces', serif; font-size: 1.5rem;
          color: var(--text); margin-bottom: 0.4rem;
        }
        .sc-empty-sub { color: var(--text-muted); font-size: 0.9rem; }

        /* Skeleton pulse */
        @keyframes skelePulse {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }

        /* Section divider decoration */
        .sc-divider {
          display: none;
        }
        @media(min-width: 900px){
          .sc-divider {
            display: block;
            width: 1px; background: var(--pill-border);
            position: absolute; top: 0; bottom: 0;
            left: 282px;
          }
        }
      `}</style>

      <div className={`sc-page ${document.documentElement.classList.contains('dark') ? 'dark-sc' : ''}`}>
        <div className="sc-blob sc-blob-1" />
        <div className="sc-blob sc-blob-2" />

        <div className="sc-inner">

          {/* ── Hero heading ── */}
          <div ref={heroRef} className={`sc-hero ${heroInView ? 'hero-visible' : ''}`} style={{ opacity: heroInView ? undefined : 0 }}>
            <div className="sc-eyebrow">
              <span className="sc-eyebrow-line" />
              Explore Our Offerings
              <span className="sc-eyebrow-line" />
            </div>
            <h1 className="sc-title">
              All <em>Services</em> &amp;<br />Categories
            </h1>
            <p className="sc-subtitle">
              {loading ? "Loading…" : (
                <>
                  Showing <span className="sc-count-badge">{filtered.length}</span> service{filtered.length !== 1 ? "s" : ""}
                  {selectedCategory !== "all" && <> in <strong style={{ color: "var(--accent)" }}>{selectedCategory}</strong></>}
                </>
              )}
            </p>
          </div>

          {/* ── Layout ── */}
          <div className="sc-layout" style={{ position: "relative" }}>
            <div className="sc-divider" />

            {/* ── Filter Panel ── */}
            <aside ref={panelRef} className={`sc-panel ${panelInView ? 'panel-visible' : ''}`} style={{ opacity: panelInView ? undefined : 0 }}>
              <p className="sc-panel-label">Categories</p>
              <div className="sc-pills">
                {[{ key: "all", label: "All Services" }, ...categories.map((c) => ({ key: c, label: c }))].map(
                  ({ key, label }, i) => (
                    <CategoryPill
                      key={key}
                      label={label}
                      active={selectedCategory === key}
                      onClick={() => setSelectedCategory(key)}
                      index={i}
                    />
                  )
                )}
              </div>
            </aside>

            {/* ── Service Grid ── */}
            <main>
              <div className={`sc-grid ${gridVisible ? 'grid-visible' : 'grid-hidden'}`}>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} delay={i * 0.08} />)
                  : filtered.length === 0
                  ? (
                    <div className="sc-empty">
                      <span className="sc-empty-icon">🔍</span>
                      <p className="sc-empty-title">No services found</p>
                      <p className="sc-empty-sub">Try selecting a different category above.</p>
                    </div>
                  )
                  : filtered.map((service, i) => (
                    <div
                      key={service._id}
                      className="sc-card-wrap"
                      style={{ animationDelay: `${i * 55}ms` }}
                    >
                      <AllServiceCard service={service} />
                    </div>
                  ))
                }
              </div>
            </main>
          </div>

        </div>
      </div>
    </>
  );
};

export default ServiceCategory;