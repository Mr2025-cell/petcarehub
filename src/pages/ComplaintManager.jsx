import { useState } from 'react';
import { Admin } from '../classes/Admin';
import { Complaint } from '../classes/Complaint';
import { Rating } from '../classes/Rating';

export default function ComplaintManager() {
  const admin = new Admin(1, 'System Admin', 'admin@petcarehub.com');

  const [complaints, setComplaints] = useState([
    new Complaint(1, 'Pet Owner', 'Caregiver', 'Caregiver arrived late for the booking'),
    new Complaint(2, 'Caregiver', 'Pet Owner', 'Unfair review after completed session')
  ]);

  const [ratings, setRatings] = useState([
    new Rating(
      1,
      'Emily Carter',
      'James Wilson',
      2,
      'The caregiver was late and did not follow the care plan properly.',
      'reported'
    )
  ]);

  function updateComplaintStatus(id, status) {
    setComplaints(
      complaints.map((complaint) => {
        if (complaint.id !== id) return complaint;

        const updated = new Complaint(
          complaint.id,
          complaint.raisedBy,
          complaint.against,
          complaint.reason,
          complaint.status
        );

        if (status === 'under review') {
          return admin.markComplaintUnderReview(updated);
        }

        if (status === 'resolved') {
          return admin.resolveComplaint(updated);
        }

        return updated;
      })
    );
  }

  function updateRatingStatus(id, status) {
    setRatings(
      ratings.map((rating) => {
        if (rating.id !== id) return rating;

        const updated = new Rating(
          rating.id,
          rating.reviewerName,
          rating.caregiverName,
          rating.score,
          rating.comment,
          rating.status
        );

        if (status === 'hidden') {
          return admin.hideRating(updated);
        }

        if (status === 'visible') {
          return admin.restoreRating(updated);
        }

        return updated;
      })
    );
  }

  return (
    <div style={styles.page}>
      <h1>Complaint Manager</h1>
      <p style={styles.subtitle}>
        Review complaints, resolve disputes, and moderate reported reviews.
      </p>

      <h2>Open Complaints</h2>

      {complaints.map((complaint) => (
        <div key={complaint.id} style={styles.card}>
          <h3>Complaint #{complaint.id}</h3>
          <p><strong>Raised by:</strong> {complaint.raisedBy}</p>
          <p><strong>Against:</strong> {complaint.against}</p>
          <p><strong>Reason:</strong> {complaint.reason}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span style={styles.badge}>{complaint.status}</span>
          </p>

          <div style={styles.buttons}>
            <button
              style={styles.review}
              onClick={() => updateComplaintStatus(complaint.id, 'under review')}
            >
              Mark Under Review
            </button>
            <button
              style={styles.resolve}
              onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
            >
              Resolve
            </button>
          </div>
        </div>
      ))}

      <h2 style={styles.sectionTitle}>Reported Reviews</h2>

      {ratings.map((rating) => (
        <div key={rating.id} style={styles.card}>
          <h3>Reported Review #{rating.id}</h3>
          <p><strong>Reviewer:</strong> {rating.reviewerName}</p>
          <p><strong>Caregiver:</strong> {rating.caregiverName}</p>
          <p><strong>Score:</strong> {rating.score}/5</p>
          <p><strong>Comment:</strong> {rating.comment}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span style={styles.badge}>{rating.status}</span>
          </p>

          <div style={styles.buttons}>
            <button
              style={styles.hide}
              onClick={() => updateRatingStatus(rating.id, 'hidden')}
            >
              Hide Review
            </button>
            <button
              style={styles.resolve}
              onClick={() => updateRatingStatus(rating.id, 'visible')}
            >
              Restore Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    padding: '32px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  subtitle: {
    color: '#555',
    marginBottom: '24px'
  },
  sectionTitle: {
    marginTop: '32px'
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '22px',
    marginBottom: '18px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
  },
  badge: {
    background: '#dbeafe',
    padding: '4px 10px',
    borderRadius: '999px',
    fontWeight: '600'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
    flexWrap: 'wrap'
  },
  review: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    background: '#f59e0b',
    color: '#fff',
    cursor: 'pointer'
  },
  resolve: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    background: '#0f766e',
    color: '#fff',
    cursor: 'pointer'
  },
  hide: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer'
  }
};