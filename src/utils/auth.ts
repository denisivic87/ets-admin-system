import { User, AdminCredentials, LoginCredentials } from '../types/auth';

const STORAGE_KEYS = {
  USERS: 'xml_app_users',
  ADMIN_CREDENTIALS: 'xml_app_admin_credentials',
  CURRENT_USER: 'xml_app_current_user',
  MONTHLY_ACTIVITIES: 'xml_app_monthly_activities'
};

// Default admin credentials
const DEFAULT_ADMIN = {
  username: 'denis.ivic',
  password: 'Gracanica1.'
};

export const initializeAuth = (): void => {
  const adminCreds = localStorage.getItem(STORAGE_KEYS.ADMIN_CREDENTIALS);
  if (!adminCreds) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_CREDENTIALS, JSON.stringify(DEFAULT_ADMIN));
  }

  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
};

export const authenticateAdmin = (credentials: AdminCredentials): boolean => {
  const storedCreds = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_CREDENTIALS) || '{}');
  return credentials.username === storedCreds.username && credentials.password === storedCreds.password;
};

export const updateAdminCredentials = (newCredentials: AdminCredentials): void => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_CREDENTIALS, JSON.stringify(newCredentials));
};

export const authenticateUser = (credentials: LoginCredentials): User | null => {
  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find(u => u.username === credentials.username && u.status === 'active');

  if (user && user.password === credentials.password) {
    // Update last login
    user.last_login = new Date().toISOString();
    saveUsers(users);
    return user;
  }

  return null;
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userData ? JSON.parse(userData) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getAllUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const createUser = (userData: Omit<User, 'id' | 'created_at'>): User => {
  const users = getAllUsers();
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>): void => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    saveUsers(users);
  }
};

export const deleteUser = (userId: string): void => {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  saveUsers(filteredUsers);
};

export const logActivity = (userId: string, recordsCreated: number, recordsModified: number, totalAmount: number): void => {
  const activities = JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_ACTIVITIES) || '[]');
  const user = getAllUsers().find(u => u.id === userId);

  if (!user) return;

  const now = new Date();
  const month = now.toLocaleString('sr-RS', { month: 'long' });
  const year = now.getFullYear();

  const existingActivity = activities.find((a: { user_id: string; month: string; year: number; records_created: number; records_modified: number; total_amount: number; last_activity: string }) =>
    a.user_id === userId && a.month === month && a.year === year
  );

  if (existingActivity) {
    existingActivity.records_created += recordsCreated;
    existingActivity.records_modified += recordsModified;
    existingActivity.total_amount += totalAmount;
    existingActivity.last_activity = now.toISOString();
  } else {
    activities.push({
      id: Date.now().toString(),
      user_id: userId,
      username: user.username,
      month,
      year,
      records_created: recordsCreated,
      records_modified: recordsModified,
      last_activity: now.toISOString(),
      total_amount: totalAmount
    });
  }

  localStorage.setItem(STORAGE_KEYS.MONTHLY_ACTIVITIES, JSON.stringify(activities));
};

export const getMonthlyActivities = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_ACTIVITIES) || '[]');
};

export const logout = (): void => {
  setCurrentUser(null);
};