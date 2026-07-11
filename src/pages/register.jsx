import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Toast import kiya

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);

      // Success Toast
      toast.success('Account is Successfully Created !');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setLoading(false);
      console.error("Firebase Register Error Code:", err.code);

      // Error Toasts
      switch (err.code) {
        case 'auth/email-already-in-use':
          toast.error('⚠️ This email is already registered. Please use a different email or login.');
          break;
        case 'auth/invalid-email':
          toast.error('❌ Invalid email address.');
          break;
        case 'auth/weak-password':
          toast.error('🔒 Password at least must be 8 character !');
          break;
        default:
          toast.error('💥 Your are making mistake to create your account !');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>MaintainIQ Register</h2>
        <p style={styles.subtitle}>Create an account to manage your assets.</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password (Min 6 chars)</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <p style={styles.redirectText}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' },
  card: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { margin: '0 0 10px 0', color: '#1f2937', fontSize: '24px' },
  subtitle: { margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', color: '#374151', fontSize: '14px', fontWeight: 'bold' },
  input: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' },
  button: { backgroundColor: '#10b981', color: '#ffffff', padding: '12px', borderRadius: '4px', border: 'none', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  redirectText: { marginTop: '20px', fontSize: '14px', color: '#4b5563' },
  link: { color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }
};

export default RegisterPage;