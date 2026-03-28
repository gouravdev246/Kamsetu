import { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ user, onLogout, setCurrentPage }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const userId = user._id || user.id;
        const response = await axios.get(`/api/report/user/${userId}`);
        setReports(response.data.reports);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('Could not load your reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserReports();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return 'check_circle';
      case 'In Progress': return 'pending';
      default: return 'schedule';
    }
  };

  if (!user) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold">Please log in to view your profile.</h2>
        <button 
          onClick={() => setCurrentPage('login')}
          className="mt-4 bg-primary text-on-primary px-6 py-2 rounded-full font-bold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Profile Card */}
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] mb-12 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary relative shadow-inner">
              <span className="material-symbols-outlined text-6xl">person</span>
              <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                Citizen
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">
                {user?.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-on-surface-variant text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">call</span>
                  {user?.phone}
                </span>
                <span className="w-1 h-1 bg-outline-variant rounded-full hidden md:block"></span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  {user?.municipality}, {user?.pinCode}
                </span>
              </div>
              <p className="mt-4 text-on-surface-variant text-sm leading-relaxed max-w-lg">
                <span className="font-bold text-on-surface">Address:</span> {user?.address || 'No address provided'}
              </p>
            </div>

            <button 
              onClick={onLogout}
              className="px-6 py-3 border border-outline text-on-surface-variant hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 group"
            >
              <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">logout</span>
              Sign Out
            </button>
          </div>
        </div>

        {/* My Reports Section */}
        <div className="animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface">My Reported Issues</h2>
              <p className="text-on-surface-variant text-sm mt-1">Track the status of your contributions</p>
            </div>
            <div className="bg-surface-container-high px-4 py-2 rounded-2xl text-xs font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">analytics</span>
              {reports.length} Total Reports
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-on-surface-variant font-medium animate-pulse">Fetching your reports...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-[2rem] text-center border border-red-100">
              <span className="material-symbols-outlined text-4xl mb-3">error_circle</span>
              <p className="font-bold">{error}</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-surface-container-low p-12 rounded-[2.5rem] text-center border-2 border-dashed border-outline-variant">
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant/40">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">No Reports Yet</h3>
              <p className="text-on-surface-variant text-sm mb-8">You haven't reported any issues. Start by helping your city!</p>
              <button 
                onClick={() => setCurrentPage('report')}
                className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
              >
                Report an Issue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <div 
                  key={report._id} 
                  className="bg-surface-container-lowest p-6 rounded-3xl border border-transparent hover:border-primary/20 transition-all group flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-xl"
                >
                  <div className="w-full md:w-32 h-32 rounded-2xl bg-surface-container-high overflow-hidden flex-shrink-0">
                    {report.media?.[0] ? (
                      <img src={report.media[0]} alt={report.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                        <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                      <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {report.category}
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${getStatusColor(report.status)}`}>
                        <span className="material-symbols-outlined text-[16px]">{getStatusIcon(report.status)}</span>
                        {report.status}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-on-surface mb-1 tracking-tight">
                       {report.category} issue in {report.municipality}
                    </h3>
                    
                    <p className="text-on-surface-variant text-sm line-clamp-1 leading-relaxed mb-4">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-auto">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">event</span>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {report.pinCode}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
