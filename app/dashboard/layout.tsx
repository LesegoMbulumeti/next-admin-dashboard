'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import { configureAmplify } from '../utils/auth';
import Sidebar from '../ui/dashboard/sidebar/sidebar';

// Configure Amplify
configureAmplify();

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        await getCurrentUser();
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // User is not authenticated, redirect to login
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container">
      <div className="menu">
        <Sidebar />
      </div>
      <div className="content">
        <main>{children}</main>
      </div>
      <style jsx>{`
        .container {
          display: flex;
        }
        .menu {
          flex: 1;
          padding: 20px;
          background-color: var(--bgSoft, #f5f5f5);
          min-height: 100vh;
        }
        .content {
          flex: 4;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}