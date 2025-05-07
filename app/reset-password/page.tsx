'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './reset-password.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Amplify } from 'aws-amplify';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { configureAmplify } from '../utils/auth';

// Configure Amplify
configureAmplify();

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Requesting password reset for:', email);
      const result = await resetPassword({ username: email });
      console.log('Reset password response:', result);
      
      toast.success('Reset code sent to your email. Please check your inbox and spam folder.');
      setShowConfirmation(true);
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.name === 'UserNotFoundException') {
        toast.error('No account found with this email');
      } else if (error.name === 'LimitExceededException') {
        toast.error('Too many attempts. Please try again later.');
      } else if (error.name === 'InvalidParameterException') {
        toast.error('Invalid email format or user does not exist');
      } else {
        toast.error(`Failed to request password reset: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      console.log('Confirming password reset for:', email);
      await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });

      toast.success('Password reset successful!');
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Confirm reset error:', error);
      
      if (error.name === 'CodeMismatchException') {
        toast.error('Invalid verification code');
      } else if (error.name === 'ExpiredCodeException') {
        toast.error('Verification code has expired. Please request a new one.');
        setShowConfirmation(false);
      } else if (error.name === 'InvalidPasswordException') {
        toast.error('Password does not meet requirements. Please ensure your password has at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.');
      } else {
        toast.error(`Failed to reset password: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className={styles.formWrapper}>
        {!showConfirmation ? (
          <>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.subtitle}>Enter your email to receive a password reset code</p>
            <form onSubmit={handleResetRequest} className={styles.form}>
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
                <small className={styles.helpText}>
                  Make sure to use the exact email address you registered with
                </small>
              </div>
              <button 
                type="submit" 
                className={styles.button}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
            <div className={styles.switchMode}>
              Remember your password? <Link href="/login">Log in</Link>
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Create New Password</h1>
            <p className={styles.subtitle}>Enter the code sent to your email and create a new password</p>
            <form onSubmit={handleConfirmReset} className={styles.form}>
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
                <small className={styles.helpText}>
                  Check your inbox and spam folder for the code
                </small>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
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
                  placeholder="Confirm new password"
                  required
                  className={styles.input}
                />
              </div>
              <button 
                type="submit" 
                className={styles.button}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button 
                type="button" 
                className={styles.secondaryButton}
                onClick={() => setShowConfirmation(false)}
              >
                Request New Code
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}