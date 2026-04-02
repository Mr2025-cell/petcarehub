import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dog } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { validateEmail } from '../utils/validation';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation and UI states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    // 1. Run Input Validation — only check fields are filled (no complexity rules on login)
    const emailErr = validateEmail(email);
    const passErr = !password ? 'Password is required' : null;

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    // 2. Perform Async API Request securely
    setIsSubmitting(true);
    try {
      const user = await authService.login(email, password);
      // 3. Update global context
      loginUser(user);
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
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
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? styles.inputError : ''}
                placeholder="••••••••" 
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
            
            <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Authenticating...' : 'Log In'}
            </Button>
          </form>

          <p className={styles.footerText}>
            Don't have an account? <span onClick={() => navigate('/register')}>Register here</span>
          </p>
        </Card>
      </div>
    </div>
  );
}
