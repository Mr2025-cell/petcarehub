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

  const navTo = (path) => {
    navigate(path);
    closeMobile();
  };

  // Helper for active link styling
  const isActive = (path) => location.pathname === path;

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
              <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`} onClick={closeMobile}>
                <Home size={18} /> Dashboard
              </Link>

              {isOwner && (
                <>
                  <Link to="/search" className={`${styles.navLink} ${isActive('/search') ? styles.navLinkActive : ''}`} onClick={closeMobile}>
                    <Search size={18} /> Search Minders
                  </Link>
                  <Link to="/pets" className={`${styles.navLink} ${isActive('/pets') ? styles.navLinkActive : ''}`} onClick={closeMobile}>
                    <Dog size={18} /> My Pets
                  </Link>
                  <Link to="/bookings" className={`${styles.navLink} ${isActive('/bookings') ? styles.navLinkActive : ''}`} onClick={closeMobile}>
                    <CalendarCheck size={18} /> Bookings
                  </Link>
                </>
              )}

              {isMinder && (
                <>
                  <Link to="/tasks" className={`${styles.navLink} ${isActive('/tasks') ? styles.navLinkActive : ''}`} onClick={closeMobile}>
                    <CalendarCheck size={18} /> My Tasks
                  </Link>
                </>
              )}

              <div className={styles.actions}>
                <span className={styles.greeting}>Hi, {currentUser?.firstName}</span>
                <button className={styles.iconBtn} title="Profile" onClick={() => navTo('/profile')}>
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

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Dog size={18} />
            <span>PetMinder</span>
          </div>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} PetMinder — Group 42. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link to="/">Home</Link>
            <Link to="/search">Find Minders</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
