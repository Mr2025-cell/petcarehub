import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { authService } from '../services/authService';
import { validateName } from '../utils/validation';
import { User, Mail, MapPin, Clock, Shield, Edit3, Save, X } from 'lucide-react';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, isOwner, isMinder } = useAuth();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    address: currentUser?.address || '',
    bio: currentUser?.bio || '',
  });

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const firstErr = validateName(editData.firstName, 'First Name');
    const lastErr = validateName(editData.lastName, 'Last Name');
    if (firstErr || lastErr) {
      addToast(firstErr || lastErr, 'error');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await authService.updateProfile(currentUser.email, editData);
      updateProfile(updated);
      setIsEditing(false);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      address: currentUser?.address || '',
      bio: currentUser?.bio || '',
    });
    setIsEditing(false);
  };

  // Format join date nicely
  const joinDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : 'Unknown';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Profile</h2>
        <p>Manage your account information and preferences.</p>
      </div>

      <div className={styles.grid}>
        {/* Profile Card */}
        <Card className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <span>{currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}</span>
            </div>
            <h3>{currentUser?.firstName} {currentUser?.lastName}</h3>
            <div className={styles.roleBadge}>
              <Shield size={14} />
              {isOwner ? 'Pet Owner' : isMinder ? 'Pet Minder' : 'User'}
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <Mail size={18} className={styles.infoIcon} />
              <div>
                <label>Email Address</label>
                <span>{currentUser?.email}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Clock size={18} className={styles.infoIcon} />
              <div>
                <label>Member Since</label>
                <span>{joinDate}</span>
              </div>
            </div>

            {isOwner && (
              <div className={styles.infoItem}>
                <MapPin size={18} className={styles.infoIcon} />
                <div>
                  <label>Address</label>
                  <span>{currentUser?.address || 'Not provided'}</span>
                </div>
              </div>
            )}

            {isMinder && (
              <>
                <div className={styles.infoItem}>
                  <User size={18} className={styles.infoIcon} />
                  <div>
                    <label>Bio</label>
                    <span>{currentUser?.bio || 'No bio provided'}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Clock size={18} className={styles.infoIcon} />
                  <div>
                    <label>Hourly Rate</label>
                    <span>£{currentUser?.hourlyRate || 0}/hr</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Edit Form */}
        <Card className={styles.editCard}>
          <div className={styles.editHeader}>
            <h3>{isEditing ? 'Edit Profile' : 'Profile Details'}</h3>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} /> Edit
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={16} /> Cancel
              </Button>
            )}
          </div>

          <div className={styles.form}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="profileFirstName">First Name</label>
                <input
                  type="text"
                  id="profileFirstName"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="profileLastName">Last Name</label>
                <input
                  type="text"
                  id="profileLastName"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isOwner && (
              <div className={styles.field}>
                <label htmlFor="profileAddress">Address</label>
                <input
                  type="text"
                  id="profileAddress"
                  name="address"
                  value={editData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            )}

            {isMinder && (
              <div className={styles.field}>
                <label htmlFor="profileBio">Bio</label>
                <textarea
                  id="profileBio"
                  name="bio"
                  rows="4"
                  value={editData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            )}

            {isEditing && (
              <Button onClick={handleSave} fullWidth disabled={isSaving}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
