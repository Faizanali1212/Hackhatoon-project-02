import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase/firebase.js';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useState } from 'react';

const PUBLIC_PORTAL_PATH = '/public-assets';

function Navbar() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate('/login');
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .site-navbar-links { display: none !important; }
          .site-navbar-toggle { display: inline-flex !important; }
          .site-navbar-menu { display: block !important; }
          .site-navbar-menu[data-open='false'] { display: none !important; }
        }
      `}</style>
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <Link to="/" style={styles.logoLink}>MaintainIQ 🛠️</Link>
          </div>
          <div className="site-navbar-links" style={styles.links}>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to={PUBLIC_PORTAL_PATH} style={styles.link}>Public Portal</Link>

            {user ? (
              <>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={styles.loginBtn}>Login</Link>
                <Link to="/register" style={styles.registerBtn}>Register</Link>
              </>
            )}
          </div>
          <button
            type="button"
            className="site-navbar-toggle"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            style={styles.menuToggle}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      <div className="site-navbar-menu" data-open={isMenuOpen} style={styles.menuPanel}>
        <Link to="/" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to={PUBLIC_PORTAL_PATH} style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Public Portal</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.mobileButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a', padding: '15px 30px', color: '#fff', fontFamily: 'sans-serif', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  navInner: { width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' },
  logo: { fontSize: '20px', fontWeight: 'bold' },
  logoLink: { color: '#fff', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: '#e2e8f0', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  logoutBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  loginBtn: { backgroundColor: '#10b981', color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' },
  registerBtn: { backgroundColor: '#f59e0b', color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' },
  menuToggle: { display: 'none', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '20px', cursor: 'pointer', flexShrink: 0 },
  menuPanel: { display: 'none', padding: '10px 30px 16px', backgroundColor: '#1e3a8a', boxShadow: '0 6px 14px rgba(0,0,0,0.08)' },
  mobileLink: { display: 'block', color: '#e2e8f0', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '12px 0' },
  mobileButton: { width: '100%', textAlign: 'left', backgroundColor: 'transparent', color: '#fff', border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }
};

export default Navbar;