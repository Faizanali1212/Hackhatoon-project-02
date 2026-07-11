import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase/firebase.js';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();
  const user = auth.currentUser;

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
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>MaintainIQ 🛠️</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/public-assets" style={styles.link}>Public Portal</Link>
        
        {user ? (
          <>
            {/* Logged In Users links */}
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            {/* Guest Users links */}
            <Link to="/login" style={styles.loginBtn}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e3a8a', padding: '15px 30px', color: '#fff', fontFamily: 'sans-serif', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  logo: { fontSize: '20px', fontWeight: 'bold' },
  logoLink: { color: '#fff', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: '#e2e8f0', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  logoutBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  loginBtn: { backgroundColor: '#10b981', color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' },
  registerBtn: { backgroundColor: '#f59e0b', color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }
};

export default Navbar;