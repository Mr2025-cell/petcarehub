import { useState } from 'react';
import { Admin } from '../classes/Admin';
import { Qualification } from '../classes/Qualification';

export default function VerificationQueue() {
  const admin = new Admin(1, 'System Admin', 'admin@petcarehub.com');

  const [qualifications, setQualifications] = useState([
    new Qualification(1, 'Sarah Brown', 'Pet First Aid Certificate', '12 Apr 2026'),
    new Qualification(2, 'James Wilson', 'ID Verification', '13 Apr 2026')
  ]);

  function updateStatus(id, status) {
    setQualifications(
      qualifications.map((item) => {
        if (item.id !== id) return item;

        const updated = new Qualification(
          item.id,
          item.caregiverName,
          item.type,
          item.submittedDate,
          item.status
        );

        if (status === 'approved') return admin.approveQualification(updated);
        if (status === 'rejected') return admin.rejectQualification(updated);

        return updated;
      })
    );
  }

  return (
    <div style={styles.page}>
      <h1>Verification Queue</h1>
      <p style={styles.subtitle}>Approve or reject caregiver credentials.</p>

      {qualifications.map((item) => (
        <div key={item.id} style={styles.card}>
          <div>
            <h2>{item.caregiverName}</h2>
            <p><strong>Qualification:</strong> {item.type}</p>
            <p><strong>Submitted:</strong> {item.submittedDate}</p>
            <p><strong>Status:</strong> <span style={styles.badge}>{item.status}</span></p>
          </div>

          <div style={styles.buttons}>
            <button style={styles.approve} onClick={() => updateStatus(item.id, 'approved')}>
              Approve
            </button>
            <button style={styles.reject} onClick={() => updateStatus(item.id, 'rejected')}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: { padding: '32px', maxWidth: '1000px', margin: '0 auto' },
  subtitle: { color: '#555', marginBottom: '24px' },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '22px',
    marginBottom: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
  },
  badge: {
    background: '#fef3c7',
    padding: '4px 10px',
    borderRadius: '999px',
    fontWeight: '600'
  },
  buttons: { display: 'flex', alignItems: 'center', gap: '10px' },
  approve: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    background: '#16a34a',
    color: '#fff',
    cursor: 'pointer'
  },
  reject: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer'
  }
};