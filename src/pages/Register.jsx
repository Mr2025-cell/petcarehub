import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dog } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { validateEmail, validatePassword, validateName, validateHourlyRate } from '../utils/validation';
import styles from './LoginPage.module.css'; 

export function Register() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [role, setRole] = useState('PetOwner'); // 'PetOwner' | 'PetCaregiver'
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    addressLine: '',
    city: '',
    postcode: '',
    hourlyRate: '', 
    bio: '' 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field-specific error as user types
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
    
    let rateErr = null;
    if (role === 'PetCaregiver') {
      rateErr = validateHourlyRate(formData.hourlyRate);
    }

    if (emailErr || passErr || firstErr || lastErr || rateErr) {
      setErrors({
        email: emailErr,
        password: passErr,
        firstName: firstErr,
        lastName: lastErr,
        hourlyRate: rateErr
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Build combined address string for storage
      const submissionData = {
        ...formData,
        address: [formData.addressLine, formData.city, formData.postcode].filter(Boolean).join(', ')
      };
      const newUser = await authService.register(submissionData, role);
      // Immediately log the user into the global context
      loginUser(newUser);
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Registration failed.');
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
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? styles.inputError : ''} />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className={errors.password ? styles.inputError : ''} />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
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
                  <textarea id="bio" name="bio" rows="3" placeholder="Tell owners about your experience..." value={formData.bio} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)' }}></textarea>
                </div>
              </>
            )}
            
            <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : `Register as ${role === 'PetOwner' ? 'Owner' : 'Caregiver'}`}
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
