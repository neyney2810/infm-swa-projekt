import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>SWA Dashboard</div>
      <nav style={styles.nav}>
        {/* Notification Icon */}
        <div style={styles.notification}>
          <span style={styles.notificationIcon}>🔔</span>
          <span style={styles.notificationBadge}>3</span>
        </div>

        {/* Avatar */}
        <div style={styles.avatar}>
          <img src="" alt="User Avatar" style={styles.avatarImage} />
        </div>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  notification: {
    position: 'relative',
    cursor: 'pointer',
  },
  notificationIcon: {
    fontSize: '20px',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-10px',
    backgroundColor: 'red',
    color: '#fff',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

export default Header;
