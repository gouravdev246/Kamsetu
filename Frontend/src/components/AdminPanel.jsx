import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  
  const [contactForm, setContactForm] = useState({
    name: '',
    category: 'Police',
    phone: '',
    address: '',
    pinCode: admin.pincode.toString()
  });

  useEffect(() => {
    if (admin) {
      if (activeTab === 'reports') {
        fetchReports(admin.organisation);
      } else {
        fetchContacts(admin.organisation);
      }
    }
  }, [admin, activeTab]);

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

  const fetchContacts = async (municipality) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/contact/all?municipality=${municipality}`);
      setContacts(response.data.contacts || []);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
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
      setError('Could not update status.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await axios.patch(`/api/contact/${editingContact._id}`, contactForm);
      } else {
        await axios.post('/api/contact/create', contactForm);
      }
      setShowContactModal(false);
      setEditingContact(null);
      setContactForm({ name: '', category: 'Police', phone: '', address: '', pinCode: admin.pincode.toString() });
      fetchContacts(admin.organisation);
    } catch (err) {
      console.error('Contact operation failed:', err);
      setError('Failed to save contact.');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await axios.delete(`/api/contact/${id}`);
      fetchContacts(admin.organisation);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setContactForm({
      name: contact.name,
      category: contact.category,
      phone: contact.phone,
      address: contact.address || '',
      pinCode: contact.pinCode || admin.pincode.toString()
    });
    setShowContactModal(true);
  };

  return (
    <div className="min-h-screen bg-surface pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
              {admin.organisation} Portal
            </span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight">Municipal Command Center</h1>
          
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high hover:bg-surface-dim'}`}
            >
              Reports
            </button>
            <button 
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'contacts' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high hover:bg-surface-dim'}`}
            >
              Contacts
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
            {admin.name[0]}
          </div>
          <div className="pr-4">
            <p className="text-xs font-bold leading-tight">{admin.name}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Authority Admin</p>
          </div>
          <button onClick={onLogout} className="w-10 h-10 rounded-xl hover:bg-error/10 text-error flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </header>

      {activeTab === 'reports' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-4">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Report Overview</p>
              <div className="space-y-4 font-medium">
                <div className="flex justify-between"><span>Total</span><span>{reports.length}</span></div>
                <div className="flex justify-between text-primary"><span>Pending</span><span>{reports.filter(r => r.status === 'Pending').length}</span></div>
                <div className="flex justify-between text-secondary"><span>Resolved</span><span>{reports.filter(r => r.status === 'Resolved').length}</span></div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>
            ) : reports.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-lowest rounded-[2.5rem] border-2 border-dashed border-outline-variant/30">No reports found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reports.map((report) => (
                    <div key={report._id} className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/20 shadow-sm hover:shadow-md transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${report.status === 'Pending' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                          {report.status}
                        </span>
                        <span className="text-[10px] font-bold text-on-surface-variant/60">{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-headline font-bold text-xl mb-2">{report.title}</h3>
                      <p className="text-sm text-on-surface-variant line-clamp-2 italic mb-6">"{report.description}"</p>
                      <div className="flex gap-2 border-t border-outline-variant/20 pt-4">
                         <button onClick={() => handleStatusChange(report._id, 'In Progress')} disabled={report.status!=='Pending'} className="flex-1 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold disabled:opacity-30">In Progress</button>
                         <button onClick={() => handleStatusChange(report._id, 'Resolved')} disabled={report.status==='Resolved'} className="flex-1 py-2 bg-secondary/10 text-secondary rounded-xl text-xs font-bold disabled:opacity-30">Resolve</button>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </main>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-headline">Directory Management</h2>
            <button 
              onClick={() => { setEditingContact(null); setContactForm({ name: '', category: 'Police', phone: '', address: '', pinCode: admin.pincode.toString() }); setShowContactModal(true); }}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span> Add Contact
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map(contact => (
              <div key={contact._id} className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-surface-container-high rounded-xl">
                    <span className="material-symbols-outlined text-primary">{contact.category === 'Police' ? 'local_police' : contact.category === 'Hospital' ? 'medical_services' : 'call'}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(contact)} className="w-8 h-8 rounded-lg hover:bg-primary/10 text-primary flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                    <button onClick={() => handleDeleteContact(contact._id)} className="w-8 h-8 rounded-lg hover:bg-error/10 text-error flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{contact.name}</h3>
                <p className="text-primary text-xs font-black uppercase tracking-widest mb-4">{contact.category}</p>
                <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span className="text-sm font-bold">{contact.phone}</span>
                </div>
              </div>
            ))}
          </div>

          {showContactModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-on-surface/20 backdrop-blur-sm animate-fade-in">
              <div className="bg-surface w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-outline-variant/30">
                <h3 className="text-2xl font-extrabold font-headline mb-6">{editingContact ? 'Edit Contact' : 'New Contact'}</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input required placeholder="Contact Name" className="w-full p-4 bg-surface-container-high rounded-2xl" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                  <select className="w-full p-4 bg-surface-container-high rounded-2xl" value={contactForm.category} onChange={e => setContactForm({...contactForm, category: e.target.value})}>
                    <option>Police</option><option>Hospital</option><option>Municipality</option><option>Fire Station</option><option>Emergency</option>
                  </select>
                  <input required placeholder="Phone Number" className="w-full p-4 bg-surface-container-high rounded-2xl" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                  <input placeholder="Address" className="w-full p-4 bg-surface-container-high rounded-2xl" value={contactForm.address} onChange={e => setContactForm({...contactForm, address: e.target.value})} />
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowContactModal(false)} className="flex-1 py-4 font-bold text-on-surface-variant hover:bg-surface-dim rounded-2xl transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg shadow-primary/20">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
