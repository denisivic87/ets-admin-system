import React, { useState, useEffect } from 'react';
import { Users, Settings, Activity, Plus, CreditCard as Edit, Trash2, Check, X, Eye, EyeOff, LogOut, Shield, Calendar, TrendingUp, Mail, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { User, AdminCredentials, MonthlyActivity } from '../types/auth';
import XmlValidator from './XmlValidator';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateAdminCredentials,
  getMonthlyActivities
} from '../utils/auth';
import { sendUserWelcomeEmail } from '../services/emailService';
import { generatePassword } from '../utils/passwordUtils';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'activity'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<MonthlyActivity[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<User> | null>(null);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [showXmlValidator, setShowXmlValidator] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'created_at' | 'last_login'>>({
    username: '',
    email: '',
    password: '',
    budget_user_id: '',
    treasury: '',
    role: 'user' as const,
    status: 'active' as const,
    pdf_display_name: ''
  });

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({
    username: '',
    password: ''
  });

  useEffect(() => {
    loadData();

    // Slušaj email notifikacije
    const handleEmailNotification = (event: Event) => {
      const customEvent = event as CustomEvent;
      setNotification({
        message: customEvent.detail.message,
        type: customEvent.detail.success ? 'success' : 'error'
      });

      setTimeout(() => setNotification(null), 5000);
    };

    window.addEventListener('emailNotification', handleEmailNotification);
    return () => window.removeEventListener('emailNotification', handleEmailNotification);
  }, []);

  const loadData = () => {
    setUsers(getAllUsers());
    setActivities(getMonthlyActivities());
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if username already exists
    if (users.some(u => u.username === newUser.username)) {
      setNotification({ message: 'Korisničko ime već postoji!', type: 'error' });
      return;
    }

    // Validate email
    if (!newUser.email || !newUser.email.includes('@')) {
      setNotification({ message: 'Unesite validnu email adresu!', type: 'error' });
      return;
    }

    try {
      setIsSendingEmail(true);

      // Kreiraj korisnika
      createUser(newUser);

      // Pošalji email
      await sendUserWelcomeEmail({
        to_email: newUser.email,
        username: newUser.username,
        password: newUser.password
      });

      setNotification({
        message: `Korisnik uspešno kreiran! Email sa pristupnim podacima je poslat na ${newUser.email}`,
        type: 'success'
      });

      setNewUser({
        username: '',
        email: '',
        password: '',
        budget_user_id: '',
        treasury: '',
        role: 'user',
        status: 'active',
        pdf_display_name: ''
      });
      setShowUserForm(false);
      loadData();
    } catch {
      setNotification({
        message: 'Greška pri kreiranju korisnika ili slanju emaila',
        type: 'error'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    updateUser(userId, updates);
    loadData();
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setEditUserData({
      email: user.email,
      password: user.password,
      pdf_display_name: user.pdf_display_name,
      status: user.status
    });
    setShowEditUserModal(true);
    setShowEditPassword(false);
  };

  const handleSaveEditUser = () => {
    if (!editingUser || !editUserData) return;

    try {
      updateUser(editingUser.id, editUserData);
      setNotification({
        message: `Korisnik ${editingUser.username} uspešno ažuriran!`,
        type: 'success'
      });
      setShowEditUserModal(false);
      setEditingUser(null);
      setEditUserData(null);
      loadData();
    } catch {
      setNotification({
        message: 'Greška pri ažuriranju korisnika',
        type: 'error'
      });
    }

    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      deleteUser(userId);
      loadData();
    }
  };

  const handleUpdateAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminCredentials(adminCredentials);
    setShowSettingsForm(false);
    setAdminCredentials({ username: '', password: '' });
    alert('Admin podaci su uspešno ažurirani!');
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };

    const labels = {
      active: 'Aktivan',
      pending: 'Na čekanju',
      suspended: 'Suspendovan'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTotalStats = () => {
    const currentMonth = new Date().toLocaleString('sr-RS', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const currentMonthActivities = activities.filter(a => a.month === currentMonth && a.year === currentYear);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      currentMonthRecords: currentMonthActivities.reduce((sum, a) => sum + a.records_created, 0),
      currentMonthAmount: currentMonthActivities.reduce((sum, a) => sum + a.total_amount, 0)
    };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-transparent text-white">
      {/* Header */}
      <div className="glass-panel border-b border-white/10 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-red-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Shield className="h-8 w-8 text-red-500 relative z-10" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
            </div>
            <button
              onClick={onLogout}
              className="glass-button flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Odjavi se</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 relative overflow-hidden ${notification.type === 'success'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : notification.type === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}>
            <div className={`absolute inset-0 opacity-10 ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} blur-xl`} />
            {notification.type === 'success' && <Check className="h-5 w-5 flex-shrink-0 relative z-10" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0 relative z-10" />}
            {notification.type === 'info' && <Mail className="h-5 w-5 flex-shrink-0 relative z-10" />}
            <p className="text-sm font-medium relative z-10">
              {notification.message}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
            <div className="flex items-center relative z-10">
              <Users className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Ukupno korisnika</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500" />
            <div className="flex items-center relative z-10">
              <Check className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Aktivni korisnici</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />
            <div className="flex items-center relative z-10">
              <Calendar className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Zapisi ovaj mesec</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.currentMonthRecords}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
            <div className="flex items-center relative z-10">
              <TrendingUp className="h-8 w-8 text-orange-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Iznos ovaj mesec</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.currentMonthAmount.toLocaleString()} RSD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="border-b border-white/10 bg-black/20">
            <nav className="flex space-x-1 px-6 pt-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-4 font-medium text-sm transition-all relative ${activeTab === 'users'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 rounded-t-lg'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Users className={`h-4 w-4 ${activeTab === 'users' ? 'text-neon-blue' : ''}`} />
                  Upravljanje korisnicima
                </div>
                {activeTab === 'users' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-blue shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-4 font-medium text-sm transition-all relative ${activeTab === 'activity'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 rounded-t-lg'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className={`h-4 w-4 ${activeTab === 'activity' ? 'text-neon-blue' : ''}`} />
                  Mesečne aktivnosti
                </div>
                {activeTab === 'activity' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-blue shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-4 font-medium text-sm transition-all relative ${activeTab === 'settings'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 rounded-t-lg'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className={`h-4 w-4 ${activeTab === 'settings' ? 'text-neon-blue' : ''}`} />
                  Podešavanja
                </div>
                {activeTab === 'settings' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-blue shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                )}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-neon-blue rounded-full" />
                    Korisnici sistema
                  </h2>
                  <button
                    onClick={() => setShowUserForm(true)}
                    className="neon-button px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Dodaj korisnika</span>
                  </button>
                </div>

                {/* User Form Modal */}
                {showUserForm && (
                  <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowUserForm(false)} />
                    <div className="flex min-h-full items-center justify-center p-4">
                      <div className="glass-panel w-full max-w-4xl p-6 rounded-2xl border border-white/10 relative">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                          <h3 className="text-xl font-bold text-white">Dodaj novog korisnika</h3>
                          <button onClick={() => setShowUserForm(false)} className="text-gray-400 hover:text-white">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Account Info Column */}
                            <div className="space-y-4">
                              <h4 className="text-neon-blue font-semibold text-sm uppercase tracking-wider mb-2 border-b border-white/5 pb-2">
                                Pristupni podaci
                              </h4>

                              <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                                  Korisničko ime *
                                </label>
                                <input
                                  type="text"
                                  value={newUser.username}
                                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                                  Email *
                                </label>
                                <input
                                  type="email"
                                  value={newUser.email}
                                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                                  Šifra *
                                </label>
                                <div className="flex gap-2">
                                  <div className="flex-1 relative">
                                    <input
                                      type={showPassword ? "text" : "password"}
                                      value={newUser.password}
                                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 pr-10 transition-all font-medium"
                                      required
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setNewUser({ ...newUser, password: generatePassword() })}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors flex items-center justify-center text-gray-400 hover:text-white"
                                    title="Generiši random šifru"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* System Info Column */}
                            <div className="space-y-4">
                              <h4 className="text-neon-blue font-semibold text-sm uppercase tracking-wider mb-2 border-b border-white/5 pb-2">
                                Sistemski podaci
                              </h4>

                              <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                                  ID korisnika budžeta *
                                </label>
                                <input
                                  type="text"
                                  value={newUser.budget_user_id}
                                  onChange={(e) => setNewUser({ ...newUser, budget_user_id: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                                  Trezor *
                                </label>
                                <input
                                  type="text"
                                  value={newUser.treasury}
                                  onChange={(e) => setNewUser({ ...newUser, treasury: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                                  Status
                                </label>
                                <select
                                  value={newUser.status}
                                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as 'active' | 'pending' | 'suspended' })}
                                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium cursor-pointer"
                                >
                                  <option value="active" className="bg-gray-900">Aktivan</option>
                                  <option value="pending" className="bg-gray-900">Na čekanju</option>
                                  <option value="suspended" className="bg-gray-900">Suspendovan</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Full Width Fields */}
                          <div className="pt-2">
                            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                              Ime za PDF dokumente
                            </label>
                            <input
                              type="text"
                              value={newUser.pdf_display_name}
                              onChange={(e) => setNewUser({ ...newUser, pdf_display_name: e.target.value })}
                              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium"
                              placeholder="Opciono (prikazuje se umesto korisničkog imena)"
                              maxLength={200}
                            />
                          </div>

                          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10 mt-6">
                            <button
                              type="button"
                              onClick={() => setShowUserForm(false)}
                              className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-medium"
                              disabled={isSendingEmail}
                            >
                              Otkaži
                            </button>
                            <button
                              type="submit"
                              disabled={isSendingEmail}
                              className="neon-button px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-neon-blue/20 hover:shadow-neon-blue/40"
                            >
                              {isSendingEmail && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              )}
                              <span>{isSendingEmail ? 'Slanje...' : 'Kreiraj korisnika'}</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit User Modal */}
                {showEditUserModal && editingUser && editUserData && (
                  <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowEditUserModal(false)} />
                    <div className="flex min-h-full items-center justify-center p-4">
                      <div className="glass-panel w-full max-w-4xl p-6 rounded-2xl border border-white/10 relative">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                          <h3 className="text-xl font-bold text-white">Uredi korisnika: {editingUser.username}</h3>
                          <button onClick={() => setShowEditUserModal(false)} className="text-gray-400 hover:text-white">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSaveEditUser(); }} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Account Info */}
                            <div className="space-y-4">
                              <h4 className="text-neon-blue font-semibold text-sm uppercase tracking-wider mb-2 border-b border-white/5 pb-2">
                                Pristupni podaci
                              </h4>
                              <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={editUserData.email || ''}
                                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                                  Šifra
                                </label>
                                <div className="flex gap-2">
                                  <div className="flex-1 relative">
                                    <input
                                      type={showEditPassword ? "text" : "password"}
                                      value={editUserData.password || ''}
                                      onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 pr-10 transition-all font-medium"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowEditPassword(!showEditPassword)}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                      {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setEditUserData({ ...editUserData, password: generatePassword() })}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors flex items-center justify-center text-gray-400 hover:text-white"
                                    title="Generiši random šifru"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="mt-1.5 text-[10px] text-gray-500">
                                  Unesite novu šifru ili kliknite na ikonicu za generisanje
                                </p>
                              </div>
                            </div>

                            {/* System Info */}
                            <div className="space-y-4">
                              <h4 className="text-neon-blue font-semibold text-sm uppercase tracking-wider mb-2 border-b border-white/5 pb-2">
                                Podešavanja naloga
                              </h4>
                              <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                                  Status
                                </label>
                                <select
                                  value={editUserData.status || 'active'}
                                  onChange={(e) => setEditUserData({ ...editUserData, status: e.target.value as 'active' | 'pending' | 'suspended' })}
                                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium cursor-pointer"
                                >
                                  <option value="active" className="bg-gray-900">Aktivan</option>
                                  <option value="pending" className="bg-gray-900">Na čekanju</option>
                                  <option value="suspended" className="bg-gray-900">Suspendovan</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Full Width */}
                          <div className="pt-2">
                            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                              Ime za PDF dokumente
                            </label>
                            <input
                              type="text"
                              value={editUserData.pdf_display_name || ''}
                              onChange={(e) => setEditUserData({ ...editUserData, pdf_display_name: e.target.value })}
                              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium"
                              placeholder="Opciono (prikazuje se umesto korisničkog imena)"
                              maxLength={200}
                            />
                          </div>

                          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10 mt-6">
                            <button
                              type="button"
                              onClick={() => setShowEditUserModal(false)}
                              className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-medium"
                            >
                              Otkaži
                            </button>
                            <button
                              type="submit"
                              className="neon-button px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-neon-blue/20 hover:shadow-neon-blue/40"
                            >
                              Sačuvaj izmjene
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Table */}
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/40">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Korisnik
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          ID budžeta
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Trezor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Poslednja prijava
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Akcije
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-transparent">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <Users className="h-12 w-12 text-gray-600 mb-2" />
                              <p className="text-lg font-medium text-gray-400">Nema pronađenih korisnika</p>
                              <p className="text-sm text-gray-600">Kliknite na dugme "Dodaj korisnika" da kreirate novi nalog.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{user.username}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {user.budget_user_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {user.treasury}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(user.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.last_login ? new Date(user.last_login).toLocaleDateString('sr-RS') : 'Nikad'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleOpenEditModal(user)}
                                  className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors"
                                  title="Uredi korisnika"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateUser(user.id, {
                                    status: user.status === 'active' ? 'suspended' : 'active'
                                  })}
                                  className={`p-2 rounded-lg transition-colors ${user.status === 'active'
                                    ? 'text-red-400 hover:text-white hover:bg-red-500/20'
                                    : 'text-green-400 hover:text-white hover:bg-green-500/20'
                                    }`}
                                  title={user.status === 'active' ? 'Suspenduj' : 'Aktiviraj'}
                                >
                                  {user.status === 'active' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                                  title="Obriši"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-neon-blue rounded-full" />
                  Mesečne aktivnosti korisnika
                </h2>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/40">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Korisnik
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Mesec/Godina
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Kreirani zapisi
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Izmenjeni zapisi
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Ukupan iznos
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Poslednja aktivnost
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-transparent">
                      {activities.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <Activity className="h-12 w-12 text-gray-600 mb-2" />
                              <p className="text-lg font-medium text-gray-400">Nema zabeleženih aktivnosti</p>
                              <p className="text-sm text-gray-600">Aktivnosti korisnika će se pojaviti ovde kada počnu da koriste sistem.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        activities.map((activity) => (
                          <tr key={activity.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {activity.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {activity.month} {activity.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {activity.records_created}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {activity.records_modified}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                              {activity.total_amount.toLocaleString()} RSD
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(activity.last_activity).toLocaleDateString('sr-RS')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-neon-blue rounded-full" />
                  Admin podešavanja
                </h2>

                <div className="max-w-md space-y-4">
                  <button
                    onClick={() => setShowSettingsForm(true)}
                    className="w-full glass-button p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/20 rounded-lg text-red-400 group-hover:text-red-300 transition-colors">
                        <Settings className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">Promeni admin podatke</p>
                        <p className="text-sm text-gray-400">Ažurirajte korisničko ime i lozinku</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowXmlValidator(true)}
                    className="w-full glass-button p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">Validiraj XML</p>
                        <p className="text-sm text-gray-400">Provera validnosti XML fajlova</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Settings Form Modal */}
                {showSettingsForm && (
                  <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSettingsForm(false)} />
                    <div className="flex min-h-full items-center justify-center p-4">
                      <div className="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-white/10 relative">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                          <h3 className="text-xl font-bold text-white">Promeni admin podatke</h3>
                          <button onClick={() => setShowSettingsForm(false)} className="text-gray-400 hover:text-white">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <form onSubmit={handleUpdateAdminCredentials} className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                              Novo korisničko ime
                            </label>
                            <input
                              type="text"
                              value={adminCredentials.username}
                              onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                              Nova lozinka
                            </label>
                            <input
                              type="password"
                              value={adminCredentials.password}
                              onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all font-medium"
                              required
                            />
                          </div>

                          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10 mt-6">
                            <button
                              type="button"
                              onClick={() => setShowSettingsForm(false)}
                              className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-medium"
                            >
                              Otkaži
                            </button>
                            <button
                              type="submit"
                              className="neon-button px-6 py-2.5 rounded-xl text-sm font-medium"
                            >
                              Sačuvaj izmjene
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
                {showXmlValidator && (
                  <XmlValidator onClose={() => setShowXmlValidator(false)} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};