import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('barbod_demo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  function signIn(email, password) {
    if (!email?.trim() || !password?.trim()) return false;
    const nextUser = { email: email.trim(), name: email.split('@')[0] || 'Admin' };
    sessionStorage.setItem('barbod_demo_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return true;
  }

  function signOut() {
    sessionStorage.removeItem('barbod_demo_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, isSignedIn: Boolean(user), signIn, signOut }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
