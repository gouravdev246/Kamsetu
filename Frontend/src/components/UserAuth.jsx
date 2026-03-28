import { useState } from 'react';
import axios from 'axios';

const UserAuth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Registration State
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    password: '',
    address: ''
  });

  // Login State
  const [loginForm, setLoginForm] = useState({
    phone: '',
    password: ''
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/citizen/register', regForm);
      onAuthSuccess(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Mobile might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/citizen/login', loginForm);
      onAuthSuccess(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 py-32">
      <div className="w-full max-w-xl bg-surface-container-lowest p-8 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">
              {isLogin ? 'person_pin' : 'how_to_reg'}
            </span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
            {isLogin ? 'Citizen Login' : 'Join Kamsetu'}
          </h1>
          <p className="text-on-surface-variant mt-3 text-sm font-medium">
            {isLogin 
              ? 'Sign in to track your reports and contribute to your city.' 
              : 'Create an account to report issues and improve municipal transparency.'}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Mobile Number</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    className="w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="9876543210"
                    value={loginForm.phone}
                    onChange={e => setLoginForm({...loginForm, phone: e.target.value})}
                    required
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40">call</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40">lock</span>
                </div>
              </div>
            </div>
            {error && <p className="text-error text-xs text-center font-bold bg-error/10 py-3 rounded-xl">{error}</p>}
            <button 
              disabled={loading}
              className="w-full py-5 bg-primary text-on-primary rounded-full font-headline font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : (
                <>
                  <span className="material-symbols-outlined">login</span>
                  Access Account
                </>
              )}
            </button>
            <p className="text-center text-sm text-on-surface-variant">
              Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="text-primary font-bold hover:underline">Sign Up Now</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Gourav Dev"
                  value={regForm.name}
                  onChange={e => setRegForm({...regForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Mobile Number</label>
                <input 
                  type="tel" 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="9876543210"
                  value={regForm.phone}
                  onChange={e => setRegForm({...regForm, phone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Create a strong password"
                  value={regForm.password}
                  onChange={e => setRegForm({...regForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Current Address (Optional)</label>
                <textarea 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  rows="2"
                  placeholder="Your residential area or ward..."
                  value={regForm.address}
                  onChange={e => setRegForm({...regForm, address: e.target.value})}
                />
              </div>
            </div>

            {error && <p className="text-error text-xs text-center font-bold bg-error/10 py-3 rounded-xl">{error}</p>}
            
            <button 
              disabled={loading}
              className="w-full py-5 bg-primary text-on-primary rounded-full font-headline font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Complete Registration'}
            </button>
            <p className="text-center text-sm text-on-surface-variant">
              Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="text-primary font-bold hover:underline">Sign In</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserAuth;
