import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

/**
 * Generic placeholder page displayed for routes that are under development
 * by other team members. Prevents 404 errors and app crashes.
 */
export function ComingSoonPage({ title = 'Coming Soon', description, icon: Icon = Construction }) {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={iconWrapStyle}>
          <Icon size={40} style={{ color: 'var(--primary-500)' }} />
        </div>
        <h2 style={{ color: 'var(--neutral-900)', marginBottom: '0.5rem' }}>{title}</h2>
        <p style={{ color: 'var(--neutral-500)', textAlign: 'center', maxWidth: 360, marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {description || 'This feature is currently being developed by our team. Check back soon for updates!'}
        </p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Button>
      </Card>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  padding: '2rem',
  animation: 'fadeInPage 0.4s ease-out',
};

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '3rem 2rem',
  maxWidth: 440,
  width: '100%',
};

const iconWrapStyle = {
  width: 72,
  height: 72,
  borderRadius: '50%',
  background: 'var(--primary-50)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem',
};
