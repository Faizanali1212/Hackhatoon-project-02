import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';
import { QRCodeSVG } from 'qrcode.react';

function Home() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const assetSnapshot = await getDocs(collection(db, 'assets'));
        setAssets(assetSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error(error);
      }
    };

    fetchAssets();
  }, []);

  const statusBadgeStyle = (status) => ({
    ...styles.publicStatusBadge,
    backgroundColor: status === 'Operational' ? '#DCFCE7' : '#FEE2E2',
    color: status === 'Operational' ? '#16A34A' : '#DC2626',
  });

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; }
        .miq-navlink { color: #B6C2E0; text-decoration: none; font-size: 14px; font-weight: 500; transition: color .15s ease; }
        .miq-navlink:hover { color: #ffffff; }
        .miq-primary-btn:hover { background-color: #1d4ed8 !important; transform: translateY(-1px); }
        .miq-ghost-btn:hover { background-color: rgba(255,255,255,0.08) !important; }
        .miq-home-menu-toggle { display: none; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.16); background: rgba(255,255,255,0.04); color: #fff; font-size: 20px; cursor: pointer; flex-shrink: 0; }
        .miq-home-menu-panel { display: none; }
        .miq-home-menu-link { width: 100%; display: block; padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.04); color: #E2E8F0; text-decoration: none; font-size: 14px; font-weight: 600; min-height: 44px; line-height: 20px; }
        .miq-home-menu-btn { width: 100%; min-height: 44px; justify-content: center; }
        .miq-feature-card { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
        .miq-feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(15,23,42,0.12); border-color: #CBD5E1; }
        .miq-stat-card { transition: box-shadow .18s ease, border-color .18s ease; }
        .miq-stat-card:hover { box-shadow: 0 8px 20px -6px rgba(15,23,42,0.10); border-color: #CBD5E1; }
        .miq-home-asset-card { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
        .miq-home-asset-card:hover { transform: translateY(-3px); box-shadow: 0 14px 28px -12px rgba(15,23,42,0.12); border-color: #CBD5E1; }

        @media (max-width: 1024px) {
          .miq-home-hero { padding-bottom: 64px !important; }
          .miq-home-hero-inner { grid-template-columns: 1fr !important; gap: 36px !important; }
          .miq-home-hero-copy { text-align: center !important; }
          .miq-home-btn-group, .miq-home-trust-row { justify-content: center !important; }
          .miq-home-section-head-wrap { margin-bottom: 36px !important; }
        }

        @media (max-width: 768px) {
          .miq-home-nav-inner { align-items: center !important; gap: 12px !important; padding-left: 16px !important; padding-right: 16px !important; }
          .miq-home-nav-links, .miq-home-nav-actions { display: none !important; }
          .miq-home-menu-toggle { display: inline-flex !important; }
          .miq-home-menu-panel { display: block !important; }
          .miq-home-menu-panel[data-open='false'] { display: none !important; }
          .miq-home-footer-inner { flex-direction: column !important; align-items: flex-start !important; }
          .miq-home-hero, .miq-home-stats-section, .miq-home-features-section, .miq-home-assets-section { padding-left: 16px !important; padding-right: 16px !important; }
          .miq-home-hero-inner, .miq-home-stats-grid, .miq-home-features-grid, .miq-home-assets-grid { grid-template-columns: 1fr !important; }
          .miq-home-trust-row { flex-wrap: wrap !important; gap: 12px !important; }
          .miq-home-trust-divider { display: none !important; }
          .miq-home-preview-card { width: 100% !important; max-width: 320px !important; }
          .miq-home-card, .miq-home-asset-card { padding: 24px 20px !important; }
        }

        @media (max-width: 520px) {
          .miq-home-title { font-size: 34px !important; }
          .miq-home-asset-qr-url { word-break: break-all !important; }
          .miq-home-asset-meta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Top Bar */}
      <nav style={styles.navbar}>
        <div className="miq-home-nav-inner" style={styles.navInner}>
          <div style={styles.brand}>
            <div style={styles.brandMark}>M</div>
            <span style={styles.brandName}>MaintainIQ</span>
          </div>
          <div className="miq-home-nav-links" style={styles.navLinks}>
            <a className="miq-navlink" href="#features">Features</a>
            <a className="miq-navlink" href="#how-it-works">How it works</a>
            <a className="miq-navlink" href="#contact">Contact</a>
          </div>
          <div className="miq-home-nav-actions" style={styles.navActions}>
            <button
              className="miq-ghost-btn"
              onClick={() => navigate('/login')}
              style={styles.ghostBtn}
            >
              Admin Login
            </button>
            <button
              className="miq-primary-nav-btn"
              onClick={() => navigate('/dashboard')}
              style={styles.primaryNavBtn}
            >
              Go to Dashboard
            </button>
          </div>
          <button
            type="button"
            className="miq-home-menu-toggle"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        <div className="miq-home-menu-panel" data-open={isMenuOpen} style={styles.menuPanel}>
          <a className="miq-home-menu-link" href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a className="miq-home-menu-link" href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</a>
          <a className="miq-home-menu-link" href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          <button
            className="miq-ghost-btn miq-home-menu-btn"
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/login');
            }}
            style={styles.ghostBtn}
          >
            Admin Login
          </button>
          <button
            className="miq-primary-nav-btn miq-home-menu-btn"
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/dashboard');
            }}
            style={styles.primaryNavBtn}
          >
            Go to Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="miq-home-hero" style={styles.hero}>
        <div className="miq-home-hero-inner" style={styles.heroInner}>
          <div className="miq-home-hero-copy" style={styles.heroCopy}>
            <div style={styles.eyebrow}>ASSET &amp; MAINTENANCE OPERATIONS</div>
            <h1 className="miq-home-title" style={styles.title}>
              Smart Asset Management,<br />built for real-time control.
            </h1>
            <p style={styles.subtitle}>
              MaintainIQ gives every asset a digital identity, turns field reports into
              structured issues with AI, and keeps your maintenance history a click away.
            </p>
            <div className="miq-home-btn-group" style={styles.btnGroup}>
              <button onClick={() => navigate('/login')} style={styles.primaryBtn}>
                Admin Login
              </button>
            </div>

            <div className="miq-home-trust-row" style={styles.trustRow}>
              <div style={styles.trustItem}>
                <span style={styles.trustNumber}>1,248</span>
                <span style={styles.trustLabel}>Assets tracked</span>
              </div>
              <div className="miq-home-trust-divider" style={styles.trustDivider} />
              <div style={styles.trustItem}>
                <span style={styles.trustNumber}>2.4d</span>
                <span style={styles.trustLabel}>Avg. resolution</span>
              </div>
              <div className="miq-home-trust-divider" style={styles.trustDivider} />
              <div style={styles.trustItem}>
                <span style={styles.trustNumber}>99.2%</span>
                <span style={styles.trustLabel}>Uptime SLA</span>
              </div>
            </div>
          </div>

          {/* Signature widget: live asset preview card */}
          <div style={styles.heroVisual}>
            <div className="miq-home-preview-card" style={styles.previewCard}>
              <div style={styles.previewHeader}>
                <span style={styles.previewLabel}>Asset ID</span>
                <span style={styles.statusPill}>● Operational</span>
              </div>
              <div style={styles.qrBlock}>
                <div style={styles.qrGrid}>
                  {Array.from({ length: 49 }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        ...styles.qrCell,
                        backgroundColor: [3,5,9,13,17,20,24,28,31,35,39,43,45].includes(i) ? '#0B1330' : 'transparent'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div style={styles.previewFooter}>
                <span style={styles.previewAssetName}>Split AC — Room 101</span>
                <span style={styles.previewAssetId}>AC-001 · HVAC</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics strip — mirrors the live dashboard */}
      <section className="miq-home-stats-section" style={styles.statsSection}>
        <div className="miq-home-stats-grid" style={styles.statsGrid}>
          <div className="miq-stat-card" style={styles.statCard}>
            <span style={styles.statLabel}>Total Assets</span>
            <span style={styles.statValue}>1,248</span>
            <span style={styles.statDelta}>+12 this month</span>
          </div>
          <div className="miq-stat-card" style={{ ...styles.statCard, borderLeft: '3px solid #DC2626' }}>
            <span style={styles.statLabel}>Open Issues</span>
            <span style={{ ...styles.statValue, color: '#DC2626' }}>32</span>
            <span style={styles.statDelta}>High priority: 5</span>
          </div>
          <div className="miq-stat-card" style={{ ...styles.statCard, borderLeft: '3px solid #D97706' }}>
            <span style={styles.statLabel}>In Progress</span>
            <span style={{ ...styles.statValue, color: '#D97706' }}>18</span>
            <span style={styles.statDelta}>Ongoing tasks</span>
          </div>
          <div className="miq-stat-card" style={{ ...styles.statCard, borderLeft: '3px solid #16A34A' }}>
            <span style={styles.statLabel}>Completed</span>
            <span style={{ ...styles.statValue, color: '#16A34A' }}>156</span>
            <span style={styles.statDelta}>This month</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="miq-home-features-section" style={styles.featuresSection}>
        <div className="miq-home-section-head-wrap" style={styles.sectionHeadWrap}>
          <div style={styles.eyebrowDark}>CORE CAPABILITIES</div>
          <h2 style={styles.sectionHeading}>Everything your maintenance team needs</h2>
          <p style={styles.sectionSubheading}>
            One system to register assets, triage issues, and keep a complete service history.
          </p>
        </div>

        <div className="miq-home-features-grid" style={styles.grid}>
          <div className="miq-feature-card miq-home-card" style={styles.card}>
            <div style={styles.iconBadge}>📱</div>
            <h3 style={styles.cardTitle}>Instant QR Code Registry</h3>
            <p style={styles.cardText}>
              Every asset gets a unique system-generated identity and public-facing QR tag instantly.
            </p>
          </div>

          <div className="miq-feature-card miq-home-card" style={styles.card}>
            <div style={styles.iconBadge}>🤖</div>
            <h3 style={styles.cardTitle}>AI Issue Triage</h3>
            <p style={styles.cardText}>
              Users report faults in plain language; our AI automatically structures titles, categories, and priority levels.
            </p>
          </div>

          <div className="miq-feature-card miq-home-card" style={styles.card}>
            <div style={styles.iconBadge}>⚙️</div>
            <h3 style={styles.cardTitle}>Technician Control Panel</h3>
            <p style={styles.cardText}>
              Real-time live logs board for technicians to track requests, append fix notes, and restore operational status.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ ...styles.featuresSection, paddingTop: '0' }}>
        <div className="miq-home-section-head-wrap" style={styles.sectionHeadWrap}>
          <div style={styles.eyebrowDark}>HOW IT WORKS</div>
          <h2 style={styles.sectionHeading}>A simple flow for teams and visitors</h2>
          <p style={styles.sectionSubheading}>
            Scan, review safe asset info, and navigate directly to the public asset page when needed.
          </p>
        </div>
      </section>

      {/* Public Asset Showcase */}
      <section id="public-assets" className="miq-home-assets-section" style={styles.assetsSection}>
        <div className="miq-home-section-head-wrap" style={styles.sectionHeadWrap}>
          <div style={styles.eyebrowDark}>PUBLIC ASSET ACCESS</div>
          <h2 style={styles.sectionHeading}>Our Registered Assets</h2>
          <p style={styles.sectionSubheading}>
            Safe public asset details only: name, code, category, location, and status.
          </p>
        </div>

        {assets.length === 0 ? (
          <div style={styles.emptyState}>No registered assets are available yet.</div>
        ) : (
          <div className="miq-home-assets-grid" style={styles.assetsGrid}>
            {assets.map((asset) => (
              <article key={asset.id} className="miq-home-asset-card" style={styles.assetCard}>
                <div style={styles.assetCardTop}>
                  <div style={styles.assetHeadingGroup}>
                    <span style={styles.assetCardLabel}>Asset Name</span>
                    <h3 style={styles.assetCardTitle}>{asset.name}</h3>
                  </div>
                  <span style={statusBadgeStyle(asset.status)}>{asset.status || 'Unknown'}</span>
                </div>

                <div className="miq-home-asset-meta-grid" style={styles.assetMetaGrid}>
                  <div>
                    <span style={styles.assetMetaLabel}>Asset Code</span>
                    <div style={styles.assetMetaValue}><code style={styles.publicCodeChip}>{asset.code}</code></div>
                  </div>
                  <div>
                    <span style={styles.assetMetaLabel}>Category</span>
                    <div style={styles.assetMetaValue}>{asset.category}</div>
                  </div>
                  <div>
                    <span style={styles.assetMetaLabel}>Location</span>
                    <div style={styles.assetMetaValue}>{asset.location}</div>
                  </div>
                </div>

                <div style={styles.assetQrSection}>
                  <div style={styles.assetQrFrame}>
                    <QRCodeSVG value={`${window.location.origin}/asset/${asset.id}`} size={132} />
                  </div>
                  <p className="miq-home-asset-qr-url" style={styles.assetQrText}>
                    {`${window.location.origin}/asset/${asset.id}`}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer id="contact" style={styles.footer}>
        <div className="miq-home-footer-inner" style={styles.footerInner}>
          <div style={styles.brand}>
            <div style={styles.brandMark}>M</div>
            <span style={{ ...styles.brandName, color: '#ffffff' }}>MaintainIQ</span>
          </div>
          <span style={styles.footerText}>© {new Date().getFullYear()} MaintainIQ. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

const NAVY = '#0B1330';
const NAVY_SOFT = '#131C3F';
const BLUE = '#2563EB';
const BORDER = '#E2E8F0';
const TEXT_PRIMARY = '#0F172A';
const TEXT_SECONDARY = '#64748B';

const styles = {
  page: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: TEXT_PRIMARY,
    backgroundColor: '#ffffff',
    minHeight: '100vh',
  },

  /* Navbar */
  navbar: { backgroundColor: NAVY, position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  navInner: { maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandMark: { width: '30px', height: '30px', borderRadius: '8px', backgroundColor: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px' },
  brandName: { fontSize: '18px', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.01em' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '28px' },
  navActions: { display: 'flex', alignItems: 'center', gap: '10px' },
  ghostBtn: { backgroundColor: 'transparent', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.18)', padding: '9px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  primaryNavBtn: { backgroundColor: BLUE, color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  menuPanel: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px 14px 24px', display: 'grid', gap: '10px' },

  /* Hero */
  hero: { backgroundColor: '#ffffff', padding: '80px 24px', borderBottom: `1px solid ${BORDER}` },
  heroInner: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)', gap: '56px', alignItems: 'center' },
  heroCopy: { textAlign: 'left' },
  eyebrow: { fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: BLUE, marginBottom: '16px' },
  eyebrowDark: { fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: BLUE, marginBottom: '10px', textAlign: 'center' },
  title: { fontSize: '44px', lineHeight: 1.15, fontWeight: 800, color: TEXT_PRIMARY, margin: '0 0 18px 0', letterSpacing: '-0.02em' },
  subtitle: { fontSize: '17px', color: TEXT_SECONDARY, maxWidth: '520px', margin: '0 0 32px 0', lineHeight: 1.65 },
  btnGroup: { display: 'flex', gap: '14px', marginBottom: '40px' },
  primaryBtn: { backgroundColor: BLUE, color: '#fff', border: 'none', padding: '13px 26px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 16px -6px rgba(37,99,235,0.45)' },
  secondaryBtn: { backgroundColor: '#ffffff', color: TEXT_PRIMARY, border: `1px solid ${BORDER}`, padding: '13px 26px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' },
  trustRow: { display: 'flex', alignItems: 'center', gap: '20px' },
  trustItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  trustNumber: { fontSize: '20px', fontWeight: 800, color: TEXT_PRIMARY },
  trustLabel: { fontSize: '12px', color: TEXT_SECONDARY },
  trustDivider: { width: '1px', height: '30px', backgroundColor: BORDER },

  /* Hero visual card */
  heroVisual: { display: 'flex', justifyContent: 'center' },
  previewCard: { width: '280px', backgroundColor: '#ffffff', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px', boxShadow: '0 20px 40px -18px rgba(15,23,42,0.25)' },
  previewHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  previewLabel: { fontSize: '12px', fontWeight: 700, color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.05em' },
  statusPill: { fontSize: '11px', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '4px 10px', borderRadius: '999px' },
  qrBlock: { backgroundColor: '#F8FAFC', border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '18px', display: 'flex', justifyContent: 'center', marginBottom: '16px' },
  qrGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', width: '140px', height: '140px' },
  qrCell: { display: 'block', width: '100%', height: '100%', borderRadius: '1px' },
  previewFooter: { display: 'flex', flexDirection: 'column', gap: '2px' },
  previewAssetName: { fontSize: '14px', fontWeight: 700, color: TEXT_PRIMARY },
  previewAssetId: { fontSize: '12px', color: TEXT_SECONDARY },

  /* Metrics strip */
  statsSection: { padding: '48px 24px', backgroundColor: '#F8FAFC', borderBottom: `1px solid ${BORDER}` },
  statsGrid: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' },
  statCard: { backgroundColor: '#ffffff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '6px' },
  statLabel: { fontSize: '13px', fontWeight: 600, color: TEXT_SECONDARY },
  statValue: { fontSize: '28px', fontWeight: 800, color: TEXT_PRIMARY, letterSpacing: '-0.01em' },
  statDelta: { fontSize: '12px', color: TEXT_SECONDARY },

  /* Features */
  featuresSection: { padding: '88px 24px', maxWidth: '1200px', margin: '0 auto' },
  sectionHeadWrap: { textAlign: 'center', maxWidth: '620px', margin: '0 auto 48px auto' },
  sectionHeading: { fontSize: '30px', fontWeight: 800, color: TEXT_PRIMARY, margin: '0 0 12px 0', letterSpacing: '-0.01em' },
  sectionSubheading: { fontSize: '16px', color: TEXT_SECONDARY, lineHeight: 1.6, margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' },
  card: { backgroundColor: '#ffffff', padding: '32px 26px', borderRadius: '14px', border: `1px solid ${BORDER}`, textAlign: 'left' },
  iconBadge: { width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '18px' },
  cardTitle: { fontSize: '17px', fontWeight: 700, color: TEXT_PRIMARY, margin: '0 0 10px 0' },
  cardText: { fontSize: '14.5px', color: TEXT_SECONDARY, lineHeight: 1.65, margin: 0 },

  /* Public assets */
  assetsSection: { padding: '32px 24px 88px', maxWidth: '1200px', margin: '0 auto' },
  assetsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' },
  assetCard: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '14px', border: `1px solid ${BORDER}`, textAlign: 'left' },
  assetCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px' },
  assetHeadingGroup: { minWidth: 0 },
  assetCardLabel: { display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: TEXT_SECONDARY, textTransform: 'uppercase', marginBottom: '6px' },
  assetCardTitle: { fontSize: '18px', fontWeight: 800, color: TEXT_PRIMARY, margin: 0, letterSpacing: '-0.01em' },
  publicStatusBadge: { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block', whiteSpace: 'nowrap' },
  assetMetaGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px', backgroundColor: '#F8FAFC', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', marginBottom: '18px' },
  assetMetaLabel: { display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_SECONDARY, marginBottom: '6px' },
  assetMetaValue: { fontSize: '14px', color: TEXT_PRIMARY, fontWeight: 600, minWidth: 0 },
  publicCodeChip: { backgroundColor: '#EEF2FF', color: BLUE, padding: '3px 8px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 700 },
  assetQrSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  assetQrFrame: { backgroundColor: '#F8FAFC', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  assetQrText: { margin: 0, fontSize: '12px', color: TEXT_SECONDARY, textAlign: 'center' },
  emptyState: { padding: '22px 18px', borderRadius: '12px', border: `1px dashed ${BORDER}`, backgroundColor: '#ffffff', textAlign: 'center', color: TEXT_SECONDARY, fontSize: '14px' },

  /* Footer */
  footer: { backgroundColor: NAVY_SOFT, padding: '28px 24px' },
  footerInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' },
  footerText: { fontSize: '13px', color: '#94A3B8' },
};

export default Home;