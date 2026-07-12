import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { collection, addDoc, getDocs, doc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';

function Dashboard() {
  const generateRandomCode = () => {
    return 'REQ-' + Math.floor(100000 + Math.random() * 900000);
  };

  const [assetCode, setAssetCode] = useState(generateRandomCode());
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  
  const [assets, setAssets] = useState([]);
  const [issues, setIssues] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  
  const [techNotes, setTechNotes] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const assetSnapshot = await getDocs(collection(db, "assets"));
      setAssets(assetSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const issueSnapshot = await getDocs(collection(db, "issues"));
      setIssues(issueSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
      toast.error("Data load karne mein masla hua.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newAsset = {
        code: assetCode.trim(),
        name: assetName,
        category: category,
        location: location,
        status: "Operational",
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "assets"), newAsset);
      await addDoc(collection(db, "history"), {
        assetId: docRef.id,
        action: "Asset Registered",
        timestamp: new Date().toISOString(),
        notes: `Asset ${assetName} register hua.`
      });
      toast.success("🎉 Asset successfully registered!");
      
      setAssetCode(generateRandomCode());
      setAssetName(''); 
      setCategory(''); 
      setLocation('');
      fetchData();
    } catch (error) {
      toast.error("Error saving asset.");
    } finally { setLoading(false); }
  };

  // 🔥 ACTION: Delete Asset Function
  const handleDeleteAsset = async (id) => {
    if (window.confirm("Bahi, kya aap sach mein is asset ko delete karna chahte hain?")) {
      try {
        const batch = writeBatch(db);

        const issueSnapshot = await getDocs(query(collection(db, "issues"), where("assetId", "==", id)));
        issueSnapshot.forEach((issueDoc) => {
          batch.delete(issueDoc.ref);
        });

        const requestSnapshot = await getDocs(query(collection(db, "requests"), where("assetId", "==", id)));
        requestSnapshot.forEach((requestDoc) => {
          batch.delete(requestDoc.ref);
        });

        batch.delete(doc(db, "assets", id));
        await batch.commit();

        toast.success("🗑️ Asset successfully deleted!");
        fetchData(); // Refresh list after deletion
      } catch (error) {
        console.error(error);
        toast.error("Asset delete karne mein error aaya.");
      }
    }
  };

  const handleResolveIssue = async (issueId, assetId) => {
    const notesText = techNotes[issueId] || "Maintenance successfully completed.";
    try {
      const issueRef = doc(db, "issues", issueId);
      await updateDoc(issueRef, { 
        status: "Resolved",
        notes: notesText 
      });

      const assetRef = doc(db, "assets", assetId);
      await updateDoc(assetRef, { status: "Operational" });

      await addDoc(collection(db, "history"), {
        assetId: assetId,
        action: "Issue Resolved",
        timestamp: new Date().toISOString(),
        notes: `Fix action: ${notesText}`
      });

      toast.success("✅ Issue resolved and asset is operational!");
      fetchData(); 
    } catch (error) {
      console.error(error);
      toast.error("Status update fail.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Purely presentational derived counts for the summary cards below.
  // Does not touch state management, Firestore calls, or any handler logic.
  const openIssuesCount = issues.filter(i => i.status !== 'Resolved').length;
  const highPriorityCount = issues.filter(i => i.priority === 'High' && i.status !== 'Resolved').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  const priorityBadgeStyle = (priority) => {
    const map = {
      High: { color: '#DC2626', backgroundColor: '#FEE2E2' },
      Medium: { color: '#D97706', backgroundColor: '#FEF3C7' },
      Low: { color: '#2563EB', backgroundColor: '#DBEAFE' },
    };
    return { ...styles.priorityBadge, ...(map[priority] || map.Low) };
  };

  const statusBadgeStyle = (status) => {
    return status === 'Resolved'
      ? { ...styles.statusBadge, backgroundColor: '#DCFCE7', color: '#16A34A' }
      : { ...styles.statusBadge, backgroundColor: '#FEE2E2', color: '#DC2626' };
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .miq-table-row:hover { background-color: #F8FAFC; }
        .miq-btn-logout:hover { background-color: #B91C1C !important; }
        .miq-btn-submit:hover { background-color: #1D4ED8 !important; }
        .miq-btn-qr:hover { background-color: #374151 !important; }
        .miq-btn-delete:hover { background-color: #B91C1C !important; }
        .miq-btn-resolve:hover { background-color: #059669 !important; }
        .miq-stat-card { transition: box-shadow .15s ease, border-color .15s ease; }
        .miq-stat-card:hover { box-shadow: 0 8px 20px -8px rgba(15,23,42,0.12); border-color: #CBD5E1; }
        input:focus { outline: none; border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
      `}</style>

      {/* Top Bar */}
      <div style={styles.header}>
        <div>
          <span style={styles.eyebrow}>MAINTAINIQ</span>
          <h2 style={styles.headerTitle}>Admin Control Panel</h2>
        </div>
        <button className="miq-btn-logout" onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Summary Metric Cards */}
      <div style={styles.statsGrid}>
        <div className="miq-stat-card" style={styles.statCard}>
          <span style={styles.statLabel}>Total Assets</span>
          <span style={styles.statValue}>{assets.length}</span>
        </div>
        <div className="miq-stat-card" style={{ ...styles.statCard, borderLeft: '3px solid #DC2626' }}>
          <span style={styles.statLabel}>Open Issues</span>
          <span style={{ ...styles.statValue, color: '#DC2626' }}>{openIssuesCount}</span>
          <span style={styles.statDelta}>High priority: {highPriorityCount}</span>
        </div>
        <div className="miq-stat-card" style={{ ...styles.statCard, borderLeft: '3px solid #D97706' }}>
          <span style={styles.statLabel}>Total Issues Logged</span>
          <span style={{ ...styles.statValue, color: '#D97706' }}>{issues.length}</span>
        </div>
        <div className="miq-stat-card" style={{ ...styles.statCard, borderLeft: '3px solid #16A34A' }}>
          <span style={styles.statLabel}>Resolved</span>
          <span style={{ ...styles.statValue, color: '#16A34A' }}>{resolvedCount}</span>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Register New Asset</h3>
          <form onSubmit={handleCreateAsset} style={styles.form}>
            <div>
              <label style={styles.label}>System Generated Code</label>
              <input type="text" value={assetCode} readOnly style={styles.inputReadOnly} />
            </div>

            <div>
              <label style={styles.label}>Asset Name</label>
              <input type="text" placeholder="e.g. Split AC - Room 101" value={assetName} onChange={(e) => setAssetName(e.target.value)} required style={styles.input} />
            </div>

            <div>
              <label style={styles.label}>Category</label>
              <input type="text" placeholder="e.g. HVAC" value={category} onChange={(e) => setCategory(e.target.value)} required style={styles.input} />
            </div>

            <div>
              <label style={styles.label}>Location</label>
              <input type="text" placeholder="e.g. Block A - Room 101" value={location} onChange={(e) => setLocation(e.target.value)} required style={styles.input} />
            </div>

            <button type="submit" disabled={loading} className="miq-btn-submit" style={styles.submitBtn}>
              {loading ? 'Registering...' : '+ Register Asset'}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Registered System Assets</h3>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="miq-table-row" style={styles.tr}>
                    <td style={styles.td}><code style={styles.codeChip}>{asset.code}</code></td>
                    <td style={styles.td}>{asset.name}</td>
                    <td style={styles.td}>{asset.location}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: asset.status === 'Operational' ? '#DCFCE7' : '#FEE2E2',
                        color: asset.status === 'Operational' ? '#16A34A' : '#DC2626'
                      }}>
                        {asset.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="miq-btn-qr" onClick={() => setSelectedQR(`${window.location.origin}/asset/${asset.id}`)} style={styles.qrViewBtn}>👁️ QR</button>
                        <button className="miq-btn-delete" onClick={() => handleDeleteAsset(asset.id)} style={styles.deleteBtn}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {assets.length === 0 && (
                  <tr>
                    <td colSpan={5} style={styles.emptyState}>No assets registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ ...styles.card, marginTop: '24px' }}>
        <h3 style={styles.cardTitle}>📢 Live Maintenance Requests &amp; Issues Triage</h3>
        {issues.length === 0 ? (
          <p style={styles.emptyState}>No complaints submitted yet.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>Asset Code</th>
                  <th style={styles.th}>Issue Title</th>
                  <th style={styles.th}>Priority</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Technician Resolution Notes</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="miq-table-row" style={styles.tr}>
                    <td style={styles.td}><strong>{issue.assetCode}</strong></td>
                    <td style={styles.td}>
                      <div style={styles.issueTitle}>{issue.title}</div>
                      <div style={styles.issueDesc}>{issue.description}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={priorityBadgeStyle(issue.priority)}>{issue.priority}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={statusBadgeStyle(issue.status)}>{issue.status}</span>
                    </td>
                    <td style={styles.td}>
                      {issue.status !== 'Resolved' ? (
                        <input
                          type="text"
                          placeholder="What did you fix? (e.g. Changed wire)"
                          value={techNotes[issue.id] || ''}
                          onChange={(e) => setTechNotes({ ...techNotes, [issue.id]: e.target.value })}
                          style={styles.tableInput}
                        />
                      ) : (
                        <span style={styles.resolvedNote}>{issue.notes}</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {issue.status !== 'Resolved' && (
                        <button
                          className="miq-btn-resolve"
                          onClick={() => handleResolveIssue(issue.id, issue.assetId)}
                          style={styles.resolveBtn}
                        >
                          ⚙️ Mark Fixed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedQR && (
        <div style={styles.modalOverlay} onClick={() => setSelectedQR(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Asset Safe Public QR Code</h3>
            <div style={styles.qrFrame}>
              <QRCodeSVG value={selectedQR} size={180} />
            </div>
            <p style={styles.modalUrl}>{selectedQR}</p>
            <button onClick={() => setSelectedQR(null)} style={styles.closeBtn}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const NAVY = '#0B1330';
const BLUE = '#2563EB';
const BORDER = '#E2E8F0';
const TEXT_PRIMARY = '#0F172A';
const TEXT_SECONDARY = '#64748B';

const styles = {
  container: {
    padding: '28px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#F8FAFC',
    minHeight: '100vh',
    color: TEXT_PRIMARY,
  },

  /* Header */
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', marginBottom: '24px', borderBottom: `1px solid ${BORDER}` },
  eyebrow: { fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: BLUE },
  headerTitle: { fontSize: '24px', fontWeight: 800, color: NAVY, margin: '4px 0 0 0', letterSpacing: '-0.01em' },
  logoutBtn: { backgroundColor: '#DC2626', color: '#fff', padding: '10px 18px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'background-color .15s ease' },

  /* Stats */
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#ffffff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' },
  statLabel: { fontSize: '13px', fontWeight: 600, color: TEXT_SECONDARY },
  statValue: { fontSize: '26px', fontWeight: 800, color: TEXT_PRIMARY, letterSpacing: '-0.01em' },
  statDelta: { fontSize: '12px', color: TEXT_SECONDARY },

  /* Layout */
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' },
  card: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '14px', border: `1px solid ${BORDER}`, boxShadow: '0 1px 2px rgba(15,23,42,0.04)' },
  cardTitle: { fontSize: '16px', fontWeight: 700, color: TEXT_PRIMARY, margin: '0 0 18px 0' },

  /* Form */
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: { display: 'block', fontSize: '12px', color: TEXT_SECONDARY, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${BORDER}`, boxSizing: 'border-box', fontSize: '14px', color: TEXT_PRIMARY, fontFamily: 'inherit' },
  inputReadOnly: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${BORDER}`, boxSizing: 'border-box', backgroundColor: '#F1F5F9', color: TEXT_SECONDARY, cursor: 'not-allowed', fontSize: '14px', fontFamily: 'inherit', fontWeight: 600 },
  submitBtn: { backgroundColor: BLUE, color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', marginTop: '4px', transition: 'background-color .15s ease' },

  /* Tables */
  tableWrap: { overflowX: 'auto', border: `1px solid ${BORDER}`, borderRadius: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  theadRow: { backgroundColor: '#F8FAFC' },
  th: { padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: `1px solid ${BORDER}` },
  tr: { borderBottom: `1px solid ${BORDER}`, transition: 'background-color .1s ease' },
  td: { padding: '14px 16px', color: TEXT_PRIMARY, verticalAlign: 'top' },
  codeChip: { backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px', fontSize: '12.5px', color: TEXT_PRIMARY },
  emptyState: { padding: '24px 16px', textAlign: 'center', color: TEXT_SECONDARY, fontSize: '14px' },

  /* Badges */
  statusBadge: { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' },
  priorityBadge: { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' },

  /* Issue cells */
  issueTitle: { fontWeight: 600, color: TEXT_PRIMARY },
  issueDesc: { fontSize: '12.5px', color: TEXT_SECONDARY, marginTop: '2px' },
  resolvedNote: { fontStyle: 'italic', color: TEXT_SECONDARY, fontSize: '13px' },
  tableInput: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${BORDER}`, fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' },

  /* Buttons */
  qrViewBtn: { backgroundColor: '#4B5563', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'background-color .15s ease' },
  deleteBtn: { backgroundColor: '#DC2626', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, transition: 'background-color .15s ease' },
  resolveBtn: { backgroundColor: '#10B981', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', transition: 'background-color .15s ease' },

  /* Modal */
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 },
  modalContent: { backgroundColor: '#fff', padding: '28px', borderRadius: '14px', textAlign: 'center', boxShadow: '0 20px 40px -18px rgba(15,23,42,0.35)' },
  modalTitle: { fontSize: '16px', fontWeight: 700, color: TEXT_PRIMARY, margin: '0 0 16px 0' },
  qrFrame: { backgroundColor: '#F8FAFC', border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '16px', display: 'inline-block' },
  modalUrl: { wordBreak: 'break-all', fontSize: '12px', marginTop: '12px', color: TEXT_SECONDARY },
  closeBtn: { backgroundColor: '#374151', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '14px', fontWeight: 600, fontSize: '13px' },
};

export default Dashboard;