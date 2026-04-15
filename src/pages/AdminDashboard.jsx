import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const cards = [
    {
      title: 'Pending Verifications',
      count: 2,
      description: 'Review caregiver ID checks, certificates and background checks.',
      link: '/admin/verifications',
      button: 'Open Verification Queue'
    },
    {
      title: 'Open Complaints',
      count: 2,
      description: 'Review user complaints and update their resolution status.',
      link: '/admin/complaints',
      button: 'Open Complaint Manager'
    },
    {
      title: 'Reported Reviews',
      count: 1,
      description: 'Monitor disputed or inappropriate reviews.',
      link: '/admin/complaints',
      button: 'Review Reports'
    }
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <p style={styles.subtitle}>
        Manage caregiver verification, user complaints and content moderation.
      </p>

      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.title} style={styles.card}>
            <p style={styles.count}>{card.count}</p>
            <h2 style={styles.cardTitle}>{card.title}</h2>
            <p style={styles.text}>{card.description}</p>
            <Link style={styles.link} to={card.link}>
              {card.button}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '32px',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  title: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#555',
    marginBottom: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px'
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '22px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
  },
  count: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0f766e',
    margin: '0 0 8px'
  },
  cardTitle: {
    fontSize: '20px',
    marginBottom: '8px'
  },
  text: {
    color: '#555',
    marginBottom: '18px'
  },
  link: {
    display: 'inline-block',
    padding: '10px 14px',
    background: '#0f766e',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600'
  }
};