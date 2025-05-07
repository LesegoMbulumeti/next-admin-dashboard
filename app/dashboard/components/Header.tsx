'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import styles from './Header.module.css';

export default function Header() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Admin Dashboard</div>
      <div className={styles.actions}>
        <button 
          onClick={handleSignOut} 
          disabled={isSigningOut}
          className={styles.signOutButton}
        >
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </header>
  );
}