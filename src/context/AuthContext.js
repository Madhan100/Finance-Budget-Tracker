import React, { createContext, useState, useContext } from 'react';

// Default Demo Accounts
const DEMO_USERS = [
  {
    id: 'user-admin',
    name: 'Madhan',
    email: 'madhan.admin@example.com',
    password: 'Admin@123',
    role: 'Admin',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    currencySymbol: '₹',
    monthlyBudget: 100000,
    joinedDate: 'January 2026',
    department: 'System & Finance Administration',
  },
  {
    id: 'user-customer',
    name: 'Gokul',
    email: 'gokul.customer@example.com',
    password: 'Customer@123',
    role: 'Customer',
    phone: '+91 98421 55678',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    currencySymbol: '₹',
    monthlyBudget: 25000,
    joinedDate: 'March 2026',
    department: 'Personal Budget Management',
  },
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState(null); // null when logged out
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  /**
   * Role-based login function
   * @param {string} email
   * @param {string} password
   * @param {'Admin' | 'Customer'} selectedRole
   */
  const login = (email, password, selectedRole) => {
    setIsLoading(true);
    setAuthError(null);

    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    // Find account by email
    const userMatch = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!userMatch) {
      setIsLoading(false);
      setAuthError('No account found with this email address.');
      return { success: false, message: 'No account found with this email address.' };
    }

    if (userMatch.password !== trimmedPass) {
      setIsLoading(false);
      setAuthError('Invalid password. Please check your credentials.');
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    // Role verification: Admin credentials must only allow access to Admin role
    if (userMatch.role !== selectedRole) {
      setIsLoading(false);
      const roleError = `Access Denied: This account is registered as '${userMatch.role}'. You cannot sign in under '${selectedRole}' role.`;
      setAuthError(roleError);
      return { success: false, message: roleError };
    }

    // Success: Set logged in user
    setCurrentUser({ ...userMatch });
    setIsLoading(false);
    return { success: true, user: userMatch };
  };

  /**
   * Register a new user (Customer or Admin)
   */
  const register = ({ name, email, password, role = 'Customer', phone = '' }) => {
    setIsLoading(true);
    setAuthError(null);

    const trimmedEmail = (email || '').trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (existing) {
      setIsLoading(false);
      setAuthError('An account with this email address already exists.');
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password: password.trim(),
      role: role,
      phone: phone.trim() || '+91 90000 00000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      currencySymbol: '₹',
      monthlyBudget: role === 'Admin' ? 100000 : 25000,
      joinedDate: 'October 2026',
      department: role === 'Admin' ? 'Finance Administration' : 'Personal Budgeting',
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoading(false);
    return { success: true, user: newUser };
  };

  /**
   * Update Profile details for customer
   */
  const updateProfile = (updatedFields) => {
    if (!currentUser) return false;

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));
    return true;
  };

  /**
   * Logout: Clears the current session and resets active user
   */
  const logout = () => {
    setCurrentUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'Admin',
        isCustomer: currentUser?.role === 'Customer',
        isLoading,
        authError,
        setAuthError,
        login,
        register,
        updateProfile,
        logout,
        demoUsers: DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
