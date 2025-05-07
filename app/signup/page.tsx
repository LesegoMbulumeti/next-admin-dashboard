'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './signup.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Amplify } from 'aws-amplify';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { configureAmplify } from '../utils/auth';

// Configure Amplify
configureAmplify();

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      // Sign up with Cognito
      const signUpResult = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });

      toast.success('Verification code sent to your email');
      setShowConfirmation(true);
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific error messages
      if (error.name === 'UsernameExistsException') {
        toast.error('An account with this email already exists');
      } else if (error.name === 'InvalidPasswordException') {
        toast.error('Password does not meet requirements. Please ensure your password has at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Confirm signup
      await confirmSignUp({
        username: email,
        confirmationCode,
      });

      toast.success('Account verified successfully!');
      
      // Sign in automatically after successful verification
      try {
        const signInResult = await signIn({
          username: email,
          password,
        });

        if (signInResult.isSignedIn) {
          toast.success('Login successful!');
          
          // Redirect to dashboard after successful login
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          // If auto-signin fails, redirect to login
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        }
      } catch (signInError) {
        console.error('Auto-login error:', signInError);
        // If auto-signin fails, redirect to login
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Confirmation error:', error);
      toast.error(error.message || 'Failed to verify account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.formWrapper}>
        {!showConfirmation ? (
          <>
            <h1 className={styles.title}>Create Account</h1>
            <form onSubmit={handleSignup} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className={styles.input}
                />
                <div className={styles.passwordRequirements}>
                  Password must:
                  <ul>
                    <li>Be at least 8 characters long</li>
                    <li>Include at least one uppercase letter (A-Z)</li>
                    <li>Include at least one lowercase letter (a-z)</li>
                    <li>Include at least one number (0-9)</li>
                    <li>Include at least one special character (e.g., !@#$%^&*)</li>
                  </ul>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className={styles.input}
                />
              </div>
              <button 
                type="submit" 
                className={styles.button}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            <div className={styles.switchMode}>
              Already have an account? <Link href="/login">Log in</Link>
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Verify Your Email</h1>
            <form onSubmit={handleConfirmSignup} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="confirmationCode">Verification Code</label>
                <input
                  id="confirmationCode"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Enter verification code"
                  required
                  className={styles.input}
                />
              </div>
              <button 
                type="submit" 
                className={styles.button}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Account'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}