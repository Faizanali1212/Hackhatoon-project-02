import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase.js';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function PublicAsset() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  
  const [asset, setAsset] = useState(null);
  const [allAssets, setAllAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userComplaint, setUserComplaint] = useState('');
  
  const [aiTitle, setAiTitle] = useState('');
  const [aiCategory, setAiCategory] = useState('');
  const [aiPriority, setAiPriority] = useState('Medium');
  const [isAiTriaged, setIsAiTriaged] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        if (assetId) {
          // Normal Flow: Fetch specific asset from QR code link
          const docRef = doc(db, "assets", assetId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setAsset({ id: docSnap.id, ...docSnap.data() });
          } else {
            toast.error("Asset not found in database.");
          }
        } else {
          // Testing Fallback Flow: Direct URL access helper
          const querySnapshot = await getDocs(collection(db, "assets"));
          const assetsList = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setAllAssets(assetsList);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssetData();
  }, [assetId]);

  const handleAiTriage = (e) => {
    e.preventDefault();
    if (!userComplaint.trim()) return toast.warning("Please enter a complaint.");

    const text = userComplaint.toLowerCase();
    let title = "General Maintenance Request";
    let category = "Hardware / Infrastructure";
    let priority = "Medium";

    if (text.includes("ac") || text.includes("cool") || text.includes("leak")) {
      title = "AC System Failure & Leakage";
      category = "HVAC Systems";
      priority = "High";
    } else if (text.includes("projector") || text.includes("display") || text.includes("screen")) {
      title = "AV Projector Signal Interruption";
      category = "Multimedia / Electronics";
      priority = "High";
    }

    setAiTitle(title);
    setAiCategory(category);
    setAiPriority(priority);
    setIsAiTriaged(true);
    toast.success("🤖 AI suggestions loaded successfully!");
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const issueData = {
        assetId: assetId || asset.id,
        assetName: asset.name,
        assetCode: asset.code,
        title: aiTitle,
        description: userComplaint,
        category: aiCategory,
        priority: aiPriority,
        status: "Reported",
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "issues"), issueData);
      await updateDoc(doc(db, "assets", assetId || asset.id), { status: "Issue Reported" });

      toast.success("🚀 Maintenance request log submitted!");
      setUserComplaint('');
      setIsAiTriaged(false);
      if(!assetId) setAsset(null);
    } catch (error) {
      console.error(error);
      toast.error("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={styles.loadingScreen}>
      <style>{fontImport}</style>
      <div style={styles.spinner} />
      <span style={styles.loadingText}>Loading Systems Panel...</span>
    </div>
  );

  // Render direct selector view if no explicit assetId is targeted in the browser navigation bar
  if (!assetId && !asset) {
    return (
      <div className="miq-pa-page" style={styles.page}>
        <style>{`${fontImport}
        @media (max-width: 640px) {
          .miq-pa-center { width: 100% !important; max-width: none !important; }
          .miq-pa-card { padding: 22px 18px !important; }
        }

        @media (max-width: 520px) {
          .miq-pa-page { padding: 20px 12px !important; }
        }
        `}</style>
        <div className="miq-pa-center" style={styles.centerWrap}>
          <div className="miq-pa-brand-row" style={styles.brandRow}>
            <div style={styles.brandMark}>M</div>
            <span style={styles.brandName}>MaintainIQ</span>
          </div>

          <div style={styles.card}>
            <span style={styles.eyebrow}>PUBLIC PORTAL</span>
            <h2 style={styles.cardHeading}>Select an Asset</h2>
            <p style={styles.mutedText}>
              Choose an asset below to simulate a public QR code scanning sequence.
            </p>

            {allAssets.length === 0 ? (
              <div style={styles.alertError}>
                No registered assets found. Please add an asset from the Admin Dashboard first.
              </div>
            ) : (
              <div>
                <label style={styles.label}>Select Target System</label>
                <select
                  className="miq-pa-select"
                  onChange={(e) => {
                    const selected = allAssets.find(a => a.id === e.target.value);
                    if (selected) setAsset(selected);
                  }}
                  defaultValue=""
                  style={styles.select}
                >
                  <option value="" disabled>-- Click to Choose an Asset --</option>
                  {allAssets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.code}) - {a.location}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="miq-pa-page" style={styles.page}>
      <style>{`${fontImport}
      @media (max-width: 640px) {
        .miq-pa-center { width: 100% !important; max-width: none !important; }
        .miq-pa-card { padding: 22px 18px !important; }
        .miq-pa-asset-info-box { padding: 14px 14px !important; }
        .miq-pa-asset-info-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        .miq-pa-asset-info-row { flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
        .miq-pa-priority-group { flex-direction: column !important; }
      }

      @media (max-width: 520px) {
        .miq-pa-page { padding: 20px 12px !important; }
        .miq-pa-card-heading { font-size: 18px !important; }
      }
      `}</style>
      <div className="miq-pa-center" style={styles.centerWrap}>
        <div className="miq-pa-brand-row" style={styles.brandRow}>
          <div style={styles.brandMark}>M</div>
          <span style={styles.brandName}>MaintainIQ</span>
        </div>

        <div className="miq-pa-card" style={styles.card}>
          <span style={styles.eyebrow}>PUBLIC ASSET PORTAL</span>

          {/* Asset Information block */}
          <div className="miq-pa-asset-info-box" style={styles.assetInfoBox}>
            <div className="miq-pa-asset-info-header" style={styles.assetInfoHeader}>
              <h4 style={styles.assetName}>{asset.name}</h4>
              <span style={{
                ...styles.statusPill,
                backgroundColor: asset.status === 'Operational' ? '#DCFCE7' : '#FEE2E2',
                color: asset.status === 'Operational' ? '#16A34A' : '#DC2626'
              }}>
                {asset.status}
              </span>
            </div>
            <div className="miq-pa-asset-info-row" style={styles.assetInfoRow}>
              <span style={styles.assetInfoLabel}>Code</span>
              <code style={styles.codeChip}>{asset.code}</code>
            </div>
            <div className="miq-pa-asset-info-row" style={styles.assetInfoRow}>
              <span style={styles.assetInfoLabel}>Location</span>
              <span style={styles.assetInfoValue}>{asset.location}</span>
            </div>
          </div>

          {!isAiTriaged ? (
            <form onSubmit={handleAiTriage}>
              <label style={styles.label}>Describe the problem</label>
              <textarea
                className="miq-pa-textarea"
                rows="4"
                style={styles.textarea}
                placeholder="e.g. AC is leaking water or display is flickering..."
                value={userComplaint}
                onChange={(e) => setUserComplaint(e.target.value)}
                required
              />
              <button type="submit" className="miq-pa-btn-primary" style={styles.primaryBtn}>🤖 Run AI Triage</button>
            </form>
          ) : (
            <form onSubmit={handleReportIssue}>
              <div style={styles.aiBanner}>
                <span style={styles.aiBannerDot} />
                AI Triage complete — review and confirm before submitting.
              </div>

              <label style={styles.label}>Suggested Title</label>
              <input
                className="miq-pa-input"
                type="text"
                value={aiTitle}
                onChange={(e) => setAiTitle(e.target.value)}
                style={styles.input}
                required
              />

              <label style={styles.label}>Category</label>
              <input
                className="miq-pa-input"
                type="text"
                value={aiCategory}
                onChange={(e) => setAiCategory(e.target.value)}
                style={styles.input}
                required
              />

              <label style={styles.label}>Priority</label>
              <div className="miq-pa-priority-group" style={styles.priorityGroup}>
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setAiPriority(level)}
                    style={aiPriority === level ? priorityActiveStyle(level) : styles.priorityBtn}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <button type="submit" disabled={submitting} className="miq-pa-btn-danger" style={styles.dangerBtn}>
                {submitting ? 'Submitting...' : '📢 Confirm & Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const NAVY = '#0B1330';
const BLUE = '#2563EB';
const BORDER = '#E2E8F0';
const TEXT_PRIMARY = '#0F172A';
const TEXT_SECONDARY = '#64748B';

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  .miq-pa-textarea:focus, .miq-pa-input:focus, .miq-pa-select:focus {
    outline: none; border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .miq-pa-btn-primary:hover { background-color: #1D4ED8 !important; }
  .miq-pa-btn-danger:hover { background-color: #B91C1C !important; }
  @keyframes miq-spin { to { transform: rotate(360deg); } }
`;

const priorityColors = {
  Low: { color: '#2563EB', backgroundColor: '#DBEAFE', borderColor: '#BFDBFE' },
  Medium: { color: '#D97706', backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  High: { color: '#DC2626', backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
};

const priorityActiveStyle = (level) => ({
  ...styles.priorityBtn,
  ...priorityColors[level],
  fontWeight: 700,
});

const styles = {
  page: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#F8FAFC',
    minHeight: '100vh',
    padding: '32px 16px',
  },

  loadingScreen: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    backgroundColor: '#F8FAFC',
  },
  spinner: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: `3px solid ${BORDER}`,
    borderTopColor: BLUE,
    animation: 'miq-spin 0.8s linear infinite',
  },
  loadingText: { fontSize: '14px', color: TEXT_SECONDARY, fontWeight: 600 },

  centerWrap: { maxWidth: '420px', margin: '0 auto', width: '100%' },
  brandRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' },
  brandMark: { width: '28px', height: '28px', borderRadius: '8px', backgroundColor: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' },
  brandName: { fontSize: '17px', fontWeight: 700, color: NAVY, letterSpacing: '-0.01em' },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${BORDER}`,
    padding: '26px 24px',
    boxShadow: '0 12px 30px -16px rgba(15,23,42,0.18)',
  },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: BLUE, display: 'block', marginBottom: '6px' },
  cardHeading: { fontSize: '20px', fontWeight: 800, color: TEXT_PRIMARY, margin: '0 0 8px 0', letterSpacing: '-0.01em' },
  mutedText: { fontSize: '13.5px', color: TEXT_SECONDARY, lineHeight: 1.6, margin: '0 0 20px 0' },

  alertError: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 14px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 600 },

  label: { display: 'block', fontSize: '12px', fontWeight: 700, color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px', marginTop: '14px' },
  select: { width: '100%', padding: '11px 12px', borderRadius: '9px', border: `1px solid ${BORDER}`, fontSize: '14px', color: TEXT_PRIMARY, backgroundColor: '#fff', fontFamily: 'inherit' },
  input: { width: '100%', padding: '11px 12px', borderRadius: '9px', border: `1px solid ${BORDER}`, fontSize: '14px', color: TEXT_PRIMARY, boxSizing: 'border-box', fontFamily: 'inherit' },
  textarea: { width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${BORDER}`, fontSize: '14px', color: TEXT_PRIMARY, boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' },

  /* Asset info block, styled like the "Asset Information" panel in the reference */
  assetInfoBox: { backgroundColor: '#F8FAFC', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px 18px', marginTop: '16px', marginBottom: '18px' },
  assetInfoHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' },
  assetName: { margin: 0, fontSize: '15px', fontWeight: 700, color: TEXT_PRIMARY },
  statusPill: { fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' },
  assetInfoRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' },
  assetInfoLabel: { fontSize: '12.5px', color: TEXT_SECONDARY, fontWeight: 600 },
  assetInfoValue: { fontSize: '13px', color: TEXT_PRIMARY, fontWeight: 600 },
  codeChip: { backgroundColor: '#EEF2FF', color: BLUE, padding: '2px 8px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 700 },

  /* AI banner */
  aiBanner: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: '13px', fontWeight: 600, padding: '10px 12px', borderRadius: '10px', marginBottom: '4px' },
  aiBannerDot: { width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2563EB', flexShrink: 0 },

  /* Priority pill group */
  priorityGroup: { display: 'flex', gap: '8px' },
  priorityBtn: { flex: 1, padding: '9px 0', borderRadius: '8px', border: `1px solid ${BORDER}`, backgroundColor: '#ffffff', color: TEXT_SECONDARY, fontSize: '13px', fontWeight: 600, cursor: 'pointer' },

  /* Buttons */
  primaryBtn: { width: '100%', backgroundColor: BLUE, color: '#fff', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14.5px', marginTop: '18px', transition: 'background-color .15s ease' },
  dangerBtn: { width: '100%', backgroundColor: '#DC2626', color: '#fff', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14.5px', marginTop: '20px', transition: 'background-color .15s ease' },
};

export default PublicAsset;