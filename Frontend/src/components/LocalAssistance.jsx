import { useState, useEffect } from 'react';
import axios from 'axios';

const LocalAssistance = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Police', 'Hospital', 'Municipality', 'Fire Station', 'Emergency'];

    useEffect(() => {
        fetchContacts();
    }, [selectedCategory]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const categoryParam = selectedCategory !== 'All' ? `&category=${selectedCategory}` : '';
            const response = await axios.get(`/api/contact/all?query=${searchQuery}${categoryParam}`);
            setContacts(response.data.contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchContacts();
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Police': return 'local_police';
            case 'Hospital': return 'medical_services';
            case 'Municipality': return 'location_city';
            case 'Fire Station': return 'fire_truck';
            case 'Emergency': return 'emergency_share';
            default: return 'call';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Police': return 'text-blue-600 bg-blue-50';
            case 'Hospital': return 'text-green-600 bg-green-50';
            case 'Municipality': return 'text-amber-600 bg-amber-50';
            case 'Fire Station': return 'text-red-600 bg-red-50';
            case 'Emergency': return 'text-rose-600 bg-rose-50';
            default: return 'text-primary bg-primary/10';
        }
    };

    return (
        <div className="bg-surface min-h-screen pt-24 pb-32">
            <main className="max-w-6xl mx-auto px-6">
                <header className="mb-12 text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
                        Local Assistance
                    </h1>
                    <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
                        Find important contact numbers for emergency services, hospitals, and local authorities in your area.
                    </p>
                </header>

                {/* Search & Filter */}
                <div className="bg-surface-container-lowest p-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] mb-12">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40">search</span>
                            <input
                                type="text"
                                placeholder="Search by name or office..."
                                className="w-full pl-14 pr-6 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                        >
                            Find Contacts
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contacts Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-on-surface-variant font-medium">Loading local services...</p>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-20 bg-surface-container-lowest rounded-[2.5rem] border-2 border-dashed border-outline-variant/30">
                        <span className="material-symbols-outlined text-on-surface-variant/20 text-6xl mb-4">contact_support</span>
                        <h3 className="text-xl font-bold mb-2">No matching contacts found</h3>
                        <p className="text-on-surface-variant max-w-xs mx-auto">Try adjusting your search query or selecting a different category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contacts.map((contact) => (
                            <div key={contact._id} className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-3 rounded-2xl ${getCategoryColor(contact.category)}`}>
                                        <span className="material-symbols-outlined text-2xl">{getCategoryIcon(contact.category)}</span>
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 px-3 py-1 bg-surface-container-low rounded-lg">
                                        {contact.category}
                                    </div>
                                </div>

                                <h3 className="text-xl font-headline font-extrabold text-on-surface mb-2 group-hover:text-primary transition-colors">
                                    {contact.name}
                                </h3>
                                
                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-on-surface-variant">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        <span className="text-xs font-medium">{contact.municipality}, {contact.pinCode}</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant/60 leading-relaxed italic ml-8">
                                        {contact.address}
                                    </p>
                                </div>

                                <a
                                    href={`tel:${contact.phone}`}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-surface-container-high rounded-2xl text-on-surface font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95 shadow-inner"
                                >
                                    <span className="material-symbols-outlined">call</span>
                                    {contact.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default LocalAssistance;
