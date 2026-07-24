import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock, frontend-only auth. Accounts and sessions live entirely in the
// browser's localStorage — nothing is sent to a server. This gives a real,
// working login/register/logout flow to build and test the UI against.
// A backend teammate can later swap the three functions below (register,
// login, logout) for real Supabase Auth calls without touching any
// component — the shape of `user` and the function signatures are the
// contract other pages rely on.

export interface AuthUser {
  name: string;
  email: string;
}

interface StoredAccount extends AuthUser {
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const USERS_KEY = 'smartspoon_users';
const SESSION_KEY = 'smartspoon_session';

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

// Simulates network latency so loading states feel real when a real API
// call replaces this later.
const fakeDelay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupted session data
    }
    setIsLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    await fakeDelay();
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = getStoredAccounts();

    if (accounts.some((a) => a.email === normalizedEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newAccount: StoredAccount = { name: name.trim(), email: normalizedEmail, password };
    saveStoredAccounts([...accounts, newAccount]);

    const sessionUser: AuthUser = { name: newAccount.name, email: newAccount.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { success: true };
  };

  const login = async (email: string, password: string) => {
    await fakeDelay();
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = getStoredAccounts();
    const match = accounts.find((a) => a.email === normalizedEmail && a.password === password);

    if (!match) {
      return { success: false, error: 'Incorrect email or password.' };
    }

    const sessionUser: AuthUser = { name: match.name, email: match.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
