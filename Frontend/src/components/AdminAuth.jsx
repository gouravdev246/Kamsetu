import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [municipalities, setMunicipalities] = useState([]);
  
  // Registration State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    organisation: '',
    pincode: ''
  });

  // Fetch municipalities based on pincode (same logic as ReportIssue)
  useEffect(() => {
    if (regForm.pincode?.toString().length !== 6) {
      setMunicipalities([]);
      return;
    }

    const fetchMunicipalities = async () => {
      try {
        const { data } = await axios.get(`https://api.postalpincode.in/pincode/${regForm.pincode}`);
        if (data?.[0]?.Status === 'Success' && data[0].PostOffice) {
          // Remove duplicates
          const uniqueBlocks = Array.from(new Set(data[0].PostOffice.map(office => office.Block)));
          setMunicipalities(uniqueBlocks);
        } else {
          setMunicipalities([]);
        }
      } catch (err) {
        console.error('Failed to fetch municipalities:', err);
        setMunicipalities([]);
      }
    };

    fetchMunicipalities();
  }, [regForm.pincode]);

  // Login State
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/register', regForm);
      onAuthSuccess(response.data.admin);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/login', loginForm);
      onAuthSuccess(response.data.admin);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
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
              {isLogin ? 'admin_panel_settings' : 'app_registration'}
            </span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
            {isLogin ? 'Admin Portal Access' : 'Authority Registration'}
          </h1>
          <p className="text-on-surface-variant mt-3 text-sm font-medium">
            {isLogin 
              ? 'Authorized personnel only. Please sign in to continue.' 
              : 'Register your municipal organization for Kamsetu monitoring.'}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="admin@municipality.gov"
                  value={loginForm.email}
                  onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Security OTP</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter 4-digit code"
                  value={loginForm.otp}
                  onChange={e => setLoginForm({...loginForm, otp: e.target.value})}
                  required
                />
              </div>
            </div>
            {error && <p className="text-error text-xs text-center font-bold bg-error/10 py-3 rounded-xl">{error}</p>}
            <button 
              disabled={loading}
              className="w-full py-5 bg-primary text-on-primary rounded-full font-headline font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Authenticate'}
            </button>
            <p className="text-center text-sm text-on-surface-variant">
              New Authority? <button type="button" onClick={() => setIsLogin(false)} className="text-primary font-bold hover:underline">Register Organization</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Admin Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="John Doe"
                  value={regForm.name}
                  onChange={e => setRegForm({...regForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Official Email</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="admin@gov.in"
                  value={regForm.email}
                  onChange={e => setRegForm({...regForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="9876543210"
                  value={regForm.phone}
                  onChange={e => setRegForm({...regForm, phone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Municipality Pincode</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="123456"
                  value={regForm.pincode}
                  onChange={e => setRegForm({...regForm, pincode: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Municipal Organization</label>
                <select
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                  value={regForm.organisation}
                  onChange={e => setRegForm({...regForm, organisation: e.target.value})}
                  required
                >
                  <option value="">{municipalities.length > 0 ? "Select Your Authority" : "Enter Pincode First"}</option>
                  {municipalities.map(m => (
                    <option key={m} value={m}>{m} Municipal Council</option>
                  ))}
                  {municipalities.length === 0 && regForm.organisation && (
                     <option value={regForm.organisation}>{regForm.organisation}</option>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Account Password</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Create complex password"
                  value={regForm.password}
                  onChange={e => setRegForm({...regForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Office Address</label>
                <textarea 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  rows="2"
                  placeholder="Complete office address..."
                  value={regForm.address}
                  onChange={e => setRegForm({...regForm, address: e.target.value})}
                  required
                />
              </div>
            </div>

            {error && <p className="text-error text-xs text-center font-bold bg-error/10 py-3 rounded-xl">{error}</p>}
            
            <button 
              disabled={loading}
              className="w-full py-5 bg-secondary-fixed text-on-secondary-fixed rounded-full font-headline font-bold shadow-xl shadow-secondary-fixed/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Complete Registration'}
            </button>
            <p className="text-center text-sm text-on-surface-variant">
              Already registered? <button type="button" onClick={() => setIsLogin(true)} className="text-primary font-bold hover:underline">Sign In Portal</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminAuth;
