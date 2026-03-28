import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminAuth from './AdminAuth';

const AdminPanel = ({ admin, onLogout }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (admin) {
      fetchReports(admin.organisation);
    }
  }, [admin]);

  const fetchReports = async (municipality) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/report/all?municipality=${municipality}`);
      setReports(response.data.reports || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await axios.patch(`/api/report/status/${reportId}`, { status: newStatus });
      setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Could not update status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-widest rounded-full">
              {admin.organisation} Municipal Authority
            </span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight">Active Reports</h1>
          <p className="text-on-surface-variant mt-2">Monitoring civic issues in your jurisdiction.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
            {admin.name[0]}
          </div>
          <div className="pr-4">
            <p className="text-xs font-bold leading-tight">{admin.name}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Portal Admin</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-xl hover:bg-error/10 text-error transition-colors flex items-center justify-center"
            title="Logout"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Stats */}
        <aside className="space-y-4">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Quick Stats</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Reports</span>
                <span className="font-bold text-lg">{reports.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <span className="font-bold text-lg text-primary">{reports.filter(r => r.status === 'Pending').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Resolved</span>
                <span className="font-bold text-lg text-secondary">{reports.filter(r => r.status === 'Resolved').length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Reports Feed */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-[2.5rem] border border-dashed border-outline-variant/50">
              <span className="material-symbols-outlined text-primary text-5xl animate-spin mb-4">sync</span>
              <p className="text-on-surface-variant font-medium">Fetching municipal data...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-lowest rounded-[2.5rem] border border-dashed border-outline-variant/50">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-6xl mb-4">list_alt</span>
              <h3 className="font-headline text-xl font-bold">No issues reported yet</h3>
              <p className="text-on-surface-variant max-w-xs mx-auto mt-2">Reports from citizens will appear here based on your municipality.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports
                .sort((a, b) => {
                  const pMap = { High: 0, Medium: 1, Low: 2 };
                  return pMap[a.priority || 'Medium'] - pMap[b.priority || 'Medium'];
                })
                .map((report) => (
                <div key={report._id} className={`bg-surface-container-lowest rounded-3xl overflow-hidden border ${report.priority === 'High' ? 'border-error/30 shadow-error/5 ring-1 ring-error/10' : 'border-outline-variant/20'} shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative`}>
                  {report.priority === 'High' && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-error text-on-error px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <span className="material-symbols-outlined text-xs">warning</span> Safety Hazard
                      </div>
                    </div>
                  )}
                  
                  <div className="relative aspect-video bg-on-background overflow-hidden">
                    {report.media && report.media[0] ? (
                      <img src={report.media[0]} className="w-full h-full object-cover" alt={report.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-dim">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">image</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border-2 shadow-sm ${
                        report.status === 'Pending' ? 'bg-primary-container text-on-primary-container border-primary/20' : 
                        report.status === 'In Progress' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                        'bg-secondary-fixed text-on-secondary-fixed border-secondary/20'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="material-symbols-outlined text-primary-container text-sm bg-primary p-1 rounded-full overflow-hidden">smart_toy</span>
                       <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{report.priority} PRIORITY DIRECTIVE</span>
                    </div>
                    
                    <h3 className="font-headline font-extrabold text-xl leading-snug mb-2 group-hover:text-primary transition-colors">{report.title}</h3>
                    <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 italic">"{report.description}"</p>
                    
                    {/* AI Recommendation Box */}
                    <div className="bg-primary/5 p-4 rounded-2xl mb-6 border border-primary/10">
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase text-primary tracking-widest">AI Action Suggestion</span>
                       </div>
                       <p className="text-xs font-bold text-on-surface italic leading-relaxed">
                         {report.aiRecommendation || 'Assess urgency and dispatch personnel.'}
                       </p>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-outline-variant/20 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
                           <span className="text-xs font-medium text-on-surface-variant">{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                           <button 
                              title="Mark In Progress"
                              onClick={() => handleStatusChange(report._id, 'In Progress')}
                              disabled={report.status === 'In Progress' || report.status === 'Resolved'}
                              className={`w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-105 transition-transform active:scale-95 disabled:opacity-20 disabled:scale-100 shadow-lg shadow-primary-container/20`}
                           >
                             <span className="material-symbols-outlined text-xl">engineering</span>
                           </button>
                           <button 
                              title="Resolve Issue"
                              onClick={() => handleStatusChange(report._id, 'Resolved')}
                              disabled={report.status === 'Resolved'}
                              className={`w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center hover:scale-105 transition-transform active:scale-95 disabled:opacity-20 disabled:scale-100 shadow-lg shadow-secondary-fixed/30`}
                           >
                             <span className="material-symbols-outlined text-xl">check</span>
                           </button>
                        </div>
                      </div>

                      {/* AI Public Transparency Log */}
                      {report.publicUpdate && (
                        <div className="p-3 bg-surface-container-high rounded-xl border border-outline-variant/30">
                           <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="material-symbols-outlined text-[10px] text-primary font-bold animate-pulse">broadcast_on_home</span>
                              <span className="text-[10px] font-black uppercase text-on-surface-variant/70 tracking-tighter">AI Public Update</span>
                           </div>
                           <p className="text-[10px] font-bold text-on-surface-variant italic leading-tight">
                             {report.publicUpdate}
                           </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
