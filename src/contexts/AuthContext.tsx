import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserRole, RiskLevel } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Found stored user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    console.log('Login attempt:', { email, role });
    setIsLoading(true);
    try {
      // Try API call first
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      try {
        console.log('Trying API login...');
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            role,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('API login successful, full response:', userData);

          // Handle different response formats - your API returns data.user and data.token
          const user = userData.data?.user || userData.user || userData;
          const token = userData.data?.token || userData.token;
          console.log('Extracted user:', user);
          console.log('Extracted token:', token);

          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          if (token) {
            localStorage.setItem('token', token);
          }
          return; // Success, exit early
        } else {
          console.log('API login failed, response:', response.status);
        }
      } catch (apiError) {
        // API call failed, fall back to demo authentication
        console.log('API not available, using demo authentication');
      }

      // Demo authentication fallback
      const isValidDemo =
        (email === 'customer' && password === 'password' && role === UserRole.USER) ||
        (email === 'admin' && password === 'password' && role === UserRole.ADMIN) ||
        (email === 'demo@example.com' && role === UserRole.USER);

      if (!isValidDemo) {
        console.log('Invalid demo credentials');
        throw new Error('Invalid credentials');
      }

      const mockUser: User = {
        id: role === UserRole.ADMIN ? 'admin-1' : 'user-1',
        first_name: role === UserRole.ADMIN ? 'Admin' : 'Customer',
        last_name: role === UserRole.ADMIN ? 'User' : 'Demo',
        email: email === 'demo@example.com' ? email : (role === UserRole.ADMIN ? 'admin@example.com' : 'customer@example.com'),
        role,
        risk_appetite: RiskLevel.MODERATE,
        balance: role === UserRole.ADMIN ? 0 : 50000,
      };

      console.log('Demo login successful, setting user:', mockUser);
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    riskLevel: RiskLevel
  ): Promise<void> => {
    console.log('Signup attempt:', { firstName, lastName, email, riskLevel });
    setIsLoading(true);
    try {
      // Try API call first
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      try {
        console.log('Trying API signup...');
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            risk_level: riskLevel,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('API signup successful, full response:', userData);

          // Handle different response formats - your API returns data.user and data.token
          const user = userData.data?.user || userData.user || userData;
          const token = userData.data?.token || userData.token;
          console.log('Extracted user:', user);
          console.log('Extracted token:', token);

          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          if (token) {
            localStorage.setItem('token', token);
          }
          return; // Success, exit early
        } else {
          console.log('API signup failed, response:', response.status);
        }
      } catch (apiError) {
        // API call failed, fall back to demo signup
        console.log('API not available, using demo signup');
      }

      // Demo signup fallback - create a new customer user
      const mockUser: User = {
        id: `user-${Date.now()}`,
        first_name: firstName,
        last_name: lastName,
        email,
        role: UserRole.USER, // Signup always creates customer users
        risk_appetite: riskLevel,
        balance: 50000, // Starting balance for new customers
      };

      console.log('Demo signup successful, setting user:', mockUser);
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    console.log('Updating user:', updatedUser);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  console.log('AuthProvider render:', { user, isAuthenticated: !!user, isLoading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};