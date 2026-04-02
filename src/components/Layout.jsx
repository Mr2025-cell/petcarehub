import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, User, LogOut, Dog, Search, CalendarCheck, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import styles from './Layout.module.css';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isOwner, isMinder, currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  // Close menu on any nav
  const navTo = (path) => {
    navigate(path);
    closeMobile();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navTo('/')}>
          <Dog className={styles.logoIcon} />
          <span>PetMinder</span>
        </div>

        {/* Hamburger toggle — visible only on mobile */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Overlay */}
        {mobileOpen && <div className={styles.overlay} onClick={closeMobile} />}

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/" className={styles.navLink} onClick={closeMobile}>
                <Home size={18} /> Dashboard
              </Link>

              {isOwner && (
                <>
                  <Link to="/search" className={styles.navLink} onClick={closeMobile}>
                    <Search size={18} /> Search Minders
                  </Link>
                  <Link to="/pets" className={styles.navLink} onClick={closeMobile}>
                    <Dog size={18} /> My Pets
                  </Link>
                  <Link to="/bookings" className={styles.navLink} onClick={closeMobile}>
                    <CalendarCheck size={18} /> Bookings
                  </Link>
                </>
              )}

              {isMinder && (
                <>
                  <Link to="/tasks" className={styles.navLink} onClick={closeMobile}>
                    <CalendarCheck size={18} /> My Tasks
                  </Link>
                </>
              )}

              <div className={styles.actions}>
                <span className={styles.greeting}>Hi, {currentUser?.firstName}</span>
                <button className={styles.iconBtn} title="Profile">
                  <User size={20} />
                </button>
                <button className={styles.iconBtn} onClick={handleLogout} title="Log out">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className={styles.guestActions}>
              <button className={styles.loginBtn} onClick={() => navTo('/login')}>
                <LogIn size={18} /> Log In
              </button>
              <button className={styles.signupBtn} onClick={() => navTo('/register')}>
                <UserPlus size={18} /> Sign Up
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
