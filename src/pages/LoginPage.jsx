import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Toast import kiya

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);

            // Success Notification
            toast.success('🔑 Login successful! Redirecting to dashboard...');

            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            console.error("Firebase Login Error Code:", err.code);

            // Error Notifications using Switch Case
            switch (err.code) {
                case 'auth/invalid-credential':
                    toast.error('❌ Invalid credentials! Please check your email and password.');
                    break;
                case 'auth/invalid-email':
                    toast.error('⚠️ Invalid email address.');
                    break;
                case 'auth/too-many-requests':
                    toast.error('🚫 You have attempts many times  Please try again later ');
                    break;
                default:
                    toast.error('💥 There is something fishy Please try again later.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>MaintainIQ Login</h2>
                <p style={styles.subtitle}>Scan. Report. Diagnose. Maintain.</p>

                <form onSubmit={handleLogin} style={styles.form}>
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
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
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
    button: { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px', borderRadius: '4px', border: 'none', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }
};

export default LoginPage;