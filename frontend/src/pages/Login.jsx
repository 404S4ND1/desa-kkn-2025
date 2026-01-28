import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_name', response.data.user.name);

      navigate('/admin-dashboard'); 
    } catch (err) {
      setError('Login Gagal! Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-neutral/20">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mx-auto mb-4">
                🏛️
            </div>
            <h1 className="text-2xl font-bold text-primary">Admin Desa</h1>
            <p className="text-secondary text-sm">Silakan masuk untuk mengelola data.</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-primary mb-1.5">Email</label>
            <input 
              type="email" 
              className="w-full border border-neutral/30 px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent outline-none bg-surface transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)} required 
              placeholder="admin@desa.id"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-primary mb-1.5">Password</label>
            <input 
              type="password" 
              className="w-full border border-neutral/30 px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent outline-none bg-surface transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 disabled:bg-neutral disabled:text-secondary">
            {loading ? 'Memproses...' : 'Masuk Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}