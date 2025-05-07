'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import { configureAmplify } from './utils/auth';

// Configure Amplify
configureAmplify();

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user is already authenticated
        await getCurrentUser();
        // User is authenticated, redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        // User is not authenticated, redirect to login
        router.push('/login');
      }
    };

    checkAuthStatus();
  }, [router]);

  // Show loading state while checking authentication
  return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
}