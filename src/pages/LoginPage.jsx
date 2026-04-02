import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dog, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { authService } from '../services/authService';
import { validateEmail } from '../utils/validation';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { addToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and UI states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    // 1. Run Input Validation
    const emailErr = validateEmail(email);
    const passErr = !password ? 'Password is required' : null;

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    // 2. Perform Async API Request
    setIsSubmitting(true);
    try {
      const user = await authService.login(email, password);
      loginUser(user);
      addToast(`Welcome back, ${user.firstName}!`, 'success');
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(forgotEmail);
    if (emailErr) {
      addToast(emailErr, 'error');
      return;
    }

    setIsSendingReset(true);
    try {
      const result = await authService.resetPassword(forgotEmail);
      addToast(result.message, 'success');
      setShowForgot(false);
      setForgotEmail('');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Clickable logo to go home */}
      <div className={styles.backBar}>
        <div className={styles.logoLink} onClick={() => navigate('/')}>
          <Dog size={22} />
          <span>PetMinder</span>
        </div>
      </div>

      <div className={styles.container}>
        <Card className={styles.loginCard}>
          <div className={styles.header}>
            <h2>Welcome Back</h2>
            <p>Login to your PetMinder account</p>
          </div>

          {apiError && <div className={styles.errorBanner}>{apiError}</div>}

          <form onSubmit={handleLogin} className={styles.form} noValidate>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? styles.inputError : ''}
                placeholder="you@example.com" 
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? styles.inputError : ''}
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.forgotRow}>
              <button type="button" className={styles.forgotLink} onClick={() => setShowForgot(true)}>
                Forgot password?
              </button>
            </div>
            
            <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className={styles.spinnerRow}>
                  <span className={styles.spinner}></span> Authenticating...
                </span>
              ) : 'Log In'}
            </Button>
          </form>

          <p className={styles.footerText}>
            Don't have an account? <span onClick={() => navigate('/register')}>Register here</span>
          </p>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className={styles.modalOverlay} onClick={() => setShowForgot(false)}>
          <Card className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Reset Password</h3>
            <p className={styles.modalDescription}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="forgotEmail">Email Address</label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className={styles.modalActions}>
                <Button type="button" variant="outline" onClick={() => setShowForgot(false)}>Cancel</Button>
                <Button type="submit" disabled={isSendingReset}>
                  {isSendingReset ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
