import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2026 MaintainIQ | Hackathon Smart Asset Management System</p>
      <p style={styles.subText}>Automated QR Triage Control Panel</p>
    </footer>
  );
}

const styles = {
  footer: { backgroundColor: '#1f2937', color: '#9ca3af', textAlign: 'center', padding: '15px 10px', fontFamily: 'sans-serif', borderTop: '1px solid #374151', marginTop: 'auto' },
  text: { margin: '0', fontSize: '14px', color: '#f3f4f6' },
  subText: { margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }
};

export default Footer;