import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AlertCircle, MapPin, Send, CheckCircle, Clock, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Message } from '../classes/Message';
import { notificationService } from '../classes/NotificationService';
import styles from './EmergencyHandler.module.css';

// UC6: Emergency SOS & Notifications
// Handles: SOS trigger, emergency contact broadcast, message thread with responders.
export function EmergencyHandler() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(0);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [note, setNote] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sosResults, setSosResults] = useState(null);
  const countdownRef = useRef(null);

  // Mock emergency contacts — in a real app these come from Pet/Owner profile
  const emergencyContacts = [
    { id: 'vet-001',    name: 'Dr. Sarah (Vet)',        role: 'Veterinarian', phone: '+1-555-0101' },
    { id: 'owner-001',  name: 'Pet Owner',              role: 'Owner',        phone: '+1-555-0102' },
    { id: 'backup-001', name: 'Backup Caregiver',       role: 'Backup',       phone: '+1-555-0103' },
  ];

  const userId = currentUser?.email || 'guest-user';

  // Request notification permission + subscribe to incoming messages
  useEffect(() => {
    notificationService.requestPermission();

    const unsubscribe = notificationService.subscribe(userId, (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Try to grab location early so it's ready if SOS fires
    captureLocation();

    return () => {
      unsubscribe();
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get GPS location with fallback
  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: new Date().toISOString()
        });
        setLocationError(null);
      },
      (err) => {
        setLocationError(err.message);
        // fallback mock location for demo
        setLocation({ lat: 51.5074, lng: -0.1278, accuracy: 0, mock: true });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // 5-second countdown before actually firing SOS (prevents accidents)
  const initiateSOS = () => {
    setSosActive(true);
    setSosCountdown(5);
    countdownRef.current = setInterval(() => {
      setSosCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          fireSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cancel during countdown
  const cancelSOS = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setSosActive(false);
    setSosCountdown(0);
  };

  // Actually broadcast to all emergency contacts
  const fireSOS = async () => {
    const recipientIds = emergencyContacts.map(c => c.id);
    const results = await notificationService.triggerSOS(
      userId,
      recipientIds,
      location,
      note || 'Emergency assistance needed at current location.'
    );
    setSosResults(results);

    // Add a local system message to the thread for feedback
    const confirmMsg = new Message(
      'system',
      userId,
      `SOS broadcast to ${recipientIds.length} contact(s).`,
      'system'
    );
    confirmMsg.markDelivered();
    setMessages(prev => [...prev, confirmMsg]);
  };

  // Send a normal chat message (e.g. follow-up to responders)
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    // broadcast to first contact as a demo (in real app: pick recipient)
    const msg = new Message(userId, emergencyContacts[0].id, chatInput.trim(), 'chat');
    await notificationService.send(msg);
    setMessages(prev => [...prev, msg]);
    setChatInput('');
  };

  const handleChatKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2><AlertCircle size={24} /> Emergency Center</h2>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>Back</Button>
      </div>

      {/* SOS Panel */}
      <Card className={`${styles.sosPanel} ${sosActive ? styles.sosActive : ''}`}>
        <h3>SOS Alert</h3>
        <p className={styles.sosDescription}>
          Press and hold the SOS button to broadcast an emergency alert to all your
          emergency contacts with your current location.
        </p>

        <div className={styles.locationRow}>
          <MapPin size={16} />
          {location ? (
            <span>
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              {location.mock && <em className={styles.mockTag}> (demo)</em>}
            </span>
          ) : (
            <span className={styles.muted}>{locationError || 'Acquiring location…'}</span>
          )}
          <button className={styles.refreshBtn} onClick={captureLocation}>refresh</button>
        </div>

        <textarea
          className={styles.noteInput}
          placeholder="Optional: describe the emergency (e.g. 'Dog collapsed during walk')"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={sosActive}
          rows={2}
        />

        {!sosActive ? (
          <Button variant="danger" onClick={initiateSOS} className={styles.sosButton}>
            <AlertCircle size={20} /> TRIGGER SOS
          </Button>
        ) : sosCountdown > 0 ? (
          <div className={styles.countdownBox}>
            <div className={styles.countdown}>{sosCountdown}</div>
            <p>Broadcasting in {sosCountdown}s…</p>
            <Button variant="outline" onClick={cancelSOS}>Cancel</Button>
          </div>
        ) : (
          <div className={styles.sentBox}>
            <CheckCircle size={32} className={styles.sentIcon} />
            <p>SOS broadcast sent to {emergencyContacts.length} contacts.</p>
            <Button variant="outline" size="sm" onClick={() => { setSosActive(false); setSosResults(null); }}>
              Reset
            </Button>
          </div>
        )}
      </Card>

      {/* Emergency Contacts */}
      <Card className={styles.contactsPanel}>
        <h3>Emergency Contacts</h3>
        <ul className={styles.contactList}>
          {emergencyContacts.map(c => (
            <li key={c.id}>
              <div>
                <strong>{c.name}</strong>
                <span className={styles.contactRole}>{c.role}</span>
              </div>
              <a href={`tel:${c.phone}`} className={styles.callLink}>
                <Phone size={14} /> {c.phone}
              </a>
            </li>
          ))}
        </ul>
      </Card>

      {/* Message Thread */}
      <Card className={styles.chatPanel}>
        <h3>Messages</h3>
        <div className={styles.messageList}>
          {messages.length === 0 ? (
            <p className={styles.muted}>No messages yet.</p>
          ) : messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.messageItem} ${msg.isEmergency?.() ? styles.emergencyMsg : ''} ${msg.senderId === userId ? styles.ownMsg : ''}`}
            >
              <div className={styles.msgMeta}>
                <span>{msg.senderId === userId ? 'You' : msg.senderId}</span>
                <Clock size={12} />
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                <span className={styles.msgStatus}>{msg.status}</span>
              </div>
              <div className={styles.msgContent}>{msg.content}</div>
            </div>
          ))}
        </div>
        <div className={styles.chatInputRow}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleChatKey}
            placeholder="Type a message to responders…"
            className={styles.chatInput}
          />
          <Button onClick={sendChatMessage} disabled={!chatInput.trim()}>
            <Send size={16} /> Send
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default EmergencyHandler;
