import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AdminCredentials } from '../types/auth';

interface AdminLoginFormProps {
  onLogin: (credentials: AdminCredentials) => void;
  onBack: () => void;
  error?: string;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLogin, onBack, error }) => {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10 p-6">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10 ring-1 ring-white/5 shadow-lg relative group">
              <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Shield className="h-10 w-10 text-red-400 relative z-10" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Panel</h1>
            <p className="text-gray-400">Pristup za administratore</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/5 blur-sm" />
              <p className="text-red-400 text-sm font-medium relative z-10 flex items-center gap-2 justify-center">
                <span>⚠️</span> {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Admin korisničko ime
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium"
                placeholder="Unesite admin ime..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Admin lozinka
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium"
                  placeholder="Unesite admin lozinku..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-red-900/20 hover:shadow-red-900/40 transform hover:-translate-y-0.5 transition-all duration-200 mt-2"
            >
              Prijavite se
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              onClick={onBack}
              className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Nazad na korisničku prijavu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};