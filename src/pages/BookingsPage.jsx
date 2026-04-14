import React, { useEffect, useState } from 'react';
import { marketplaceService } from '../services/marketplaceService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

export function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  const refresh = () => {
    setBookings(marketplaceService.getBookings());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCancel = (id) => {
    marketplaceService.cancelBooking(id);
    refresh();
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Bookings</h2>
        <p style={{ margin: '6px 0 0', opacity: 0.8 }}>Your saved bookings appear here.</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <div style={{ padding: 16 }}>
            <p style={{ margin: 0 }}>No bookings yet. Go to Search Minders and book a session.</p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {bookings.map((b) => (
            <Card key={b.id}>
              <div style={{ padding: 16, display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 600 }}>{b.caregiverName || 'Caregiver'}</div>
                  <div style={{ opacity: 0.8 }}>{typeof b.price === 'number' ? `£${b.price}/hr` : ''}</div>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', opacity: 0.85 }}>
                  <div>Status: {b.status || 'Confirmed'}</div>
                  <div>Created: {formatDate(b.createdAt)}</div>
                  {b.sessionDate ? <div>Session: {formatDate(b.sessionDate)}</div> : null}
                  {b.payment?.status ? <div>Payment: {b.payment.status}</div> : null}
                </div>

                {b.status !== 'Cancelled' ? (
                  <div style={{ marginTop: 4 }}>
                    <Button
                      onClick={() => handleCancel(b.id)}
                      style={{ backgroundColor: '#dc2626', color: '#ffffff', borderColor: '#dc2626' }}
                    >
                      Cancel booking
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

