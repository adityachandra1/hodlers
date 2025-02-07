'use client';
import { signIn } from 'next-auth/react';
import styles from './login.module.css';

export default function LoginPage() {
    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1>Welcome to HODLers</h1>
                <button 
                    className={styles.googleButton}
                    onClick={handleGoogleLogin}
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
