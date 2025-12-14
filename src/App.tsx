import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';

interface User {
  username: string;
  role: 'user' | 'admin';
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (credentials: { username: string; password: string }, isAdmin: boolean) => {
    // Simple demo login - in real app, verify with backend
    const user: User = {
      username: credentials.username,
      role: isAdmin ? 'admin' : 'user'
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} onAdminLogin={() => {}} error="" />;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>ETS Admin System</h1>
        <div>
          <p>Korisnik: <strong>{currentUser?.username}</strong> ({currentUser?.role})</p>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Odjava
          </button>
        </div>
      </div>
      <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
        <p>Dobrodošli u ETS Admin System!</p>
        <p>Korisnik je uspješno logovan i aplikacija je spremna za rad.</p>
      </div>
    </div>
  );
}