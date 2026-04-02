import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dog, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { authService } from '../services/authService';
import { validateEmail, validatePassword, validateName, validateHourlyRate, getPasswordStrength } from '../utils/validation';
import styles from './LoginPage.module.css'; 

export function Register() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { addToast } = useToast();
  const [role, setRole] = useState('PetOwner');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    addressLine: '',
    city: '',
    postcode: '',
    hourlyRate: '', 
    bio: '' 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    // Run input validation
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const firstErr = validateName(formData.firstName, 'First Name');
    const lastErr = validateName(formData.lastName, 'Last Name');
    const confirmErr = formData.password !== formData.confirmPassword ? 'Passwords do not match' : null;
    
    let rateErr = null;
    if (role === 'PetCaregiver') {
      rateErr = validateHourlyRate(formData.hourlyRate);
    }

    if (emailErr || passErr || firstErr || lastErr || rateErr || confirmErr) {
      setErrors({
        email: emailErr,
        password: passErr,
        firstName: firstErr,
        lastName: lastErr,
        hourlyRate: rateErr,
        confirmPassword: confirmErr
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        address: [formData.addressLine, formData.city, formData.postcode].filter(Boolean).join(', ')
      };
      const newUser = await authService.register(submissionData, role);
      loginUser(newUser);
      addToast(`Welcome to PetMinder, ${newUser.firstName}! 🎉`, 'success');
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.backBar}>
        <div className={styles.logoLink} onClick={() => navigate('/')}>
          <Dog size={22} />
          <span>PetMinder</span>
        </div>
      </div>

      <div className={styles.container}>
        <Card className={styles.loginCard}>
          <div className={styles.header}>
            <h2>Create an Account</h2>
            <p>Join PetMinder today.</p>
          </div>

          {apiError && <div className={styles.errorBanner}>{apiError}</div>}

          <div className={styles.roleToggle}>
            <button 
              type="button" 
              className={role === 'PetOwner' ? styles.activeRole : styles.inactiveRole}
              onClick={() => setRole('PetOwner')}
            >
              Pet Owner
            </button>
            <button 
              type="button" 
              className={role === 'PetCaregiver' ? styles.activeRole : styles.inactiveRole}
              onClick={() => setRole('PetCaregiver')}
            >
              Pet Minder
            </button>
          </div>

          <form onSubmit={handleRegister} className={styles.form} noValidate>
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? styles.inputError : ''} />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? styles.inputError : ''} />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="regEmail">Email</label>
              <input type="email" id="regEmail" name="email" value={formData.email} onChange={handleChange} className={errors.email ? styles.inputError : ''} />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="regPassword">Password</label>
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="regPassword" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className={errors.password ? styles.inputError : ''} 
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
              {/* Password strength indicator */}
              {formData.password && (
                <>
                  <div className={styles.strengthBar}>
                    {[1, 2, 3].map(level => (
                      <div
                        key={level}
                        className={styles.strengthSegment}
                        style={{
                          background: passwordStrength.score >= level ? passwordStrength.color : undefined
                        }}
                      />
                    ))}
                  </div>
                  <span className={styles.strengthLabel} style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </>
              )}
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className={errors.confirmPassword ? styles.inputError : ''} 
                />
              </div>
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>

            {role === 'PetOwner' && (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="addressLine">Address Line</label>
                  <input type="text" id="addressLine" name="addressLine" placeholder="123 Dogwood Lane" value={formData.addressLine} onChange={handleChange} />
                </div>
                <div className={styles.nameRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" placeholder="London" value={formData.city} onChange={handleChange} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="postcode">Postcode</label>
                    <input type="text" id="postcode" name="postcode" placeholder="SW1A 1AA" value={formData.postcode} onChange={handleChange} />
                  </div>
                </div>
              </>
            )}

            {role === 'PetCaregiver' && (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="hourlyRate">Hourly Rate (£)</label>
                  <input type="number" id="hourlyRate" name="hourlyRate" placeholder="15" value={formData.hourlyRate} onChange={handleChange} className={errors.hourlyRate ? styles.inputError : ''} />
                  {errors.hourlyRate && <span className={styles.errorText}>{errors.hourlyRate}</span>}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="bio">Profile Bio</label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    rows="3" 
                    placeholder="Tell owners about your experience..." 
                    value={formData.bio} 
                    onChange={handleChange} 
                    style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical' }}
                  ></textarea>
                </div>
              </>
            )}
            
            <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className={styles.spinnerRow}>
                  <span className={styles.spinner}></span> Registering...
                </span>
              ) : `Register as ${role === 'PetOwner' ? 'Owner' : 'Caregiver'}`}
            </Button>
          </form>

          <p className={styles.footerText}>
            Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
          </p>
        </Card>
      </div>
    </div>
  );
}
