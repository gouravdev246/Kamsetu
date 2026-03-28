import { useState, useEffect } from 'react';

const IssueCard = ({ issue, user, onUpvote }) => {
  const hasUpvoted = user && issue.upvotes && issue.upvotes.includes(user._id);
  const upvoteCount = issue.upvotes ? issue.upvotes.length : 0;

  let statusClasses = 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
  if (issue.status === 'In Progress') statusClasses = 'bg-primary-fixed text-on-primary-fixed-variant';
  if (issue.status === 'Resolved') statusClasses = 'bg-secondary-fixed text-on-secondary-fixed-variant';

  let timeDisplay = new Date(issue.createdAt).toLocaleDateString();

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-64 overflow-hidden shrink-0 bg-slate-200">
        {issue.media && issue.media.length > 0 ? (
          <img
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            alt={issue.title}
            src={issue.media[0]}
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-500">
             <span className="material-symbols-outlined text-5xl">image_not_supported</span>
           </div>
        )}
        <div
          className={`absolute top-4 right-4 ${statusClasses} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg`}
        >
          {issue.status}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-3">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <span className="truncate">{issue?.location?.address || issue.municipality || 'Unknown Location'}</span>
        </div>
        <h4 className="font-headline text-xl font-bold mb-4 text-on-surface line-clamp-2">
          {issue.title}
        </h4>
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <button 
            onClick={() => onUpvote(issue._id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all active:scale-95 ${
              hasUpvoted 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: hasUpvoted ? "'FILL' 1" : "'FILL' 0" }}>
              thumb_up
            </span>
            {upvoteCount} {upvoteCount === 1 ? 'Upvote' : 'Upvotes'}
          </button>
          <span className="text-xs font-bold uppercase text-on-surface-variant">
            {timeDisplay}
          </span>
        </div>
      </div>
    </div>
  );
};

const RecentIssues = ({ user, standalone }) => {
  const [issues, setIssues] = useState([]);
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchIssues = async (pinFilter = '') => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/report/all";
      if (pinFilter && pinFilter.trim().length > 0) {
        url += `?pinCode=${pinFilter.trim()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.reports) {
        setIssues(data.reports);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues(pinCode);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIssues(pinCode);
  };

  const clearSearch = () => {
    setPinCode('');
    fetchIssues('');
  };

  const handleUpvote = async (issueId) => {
    if (!user) {
      alert("Please log in to upvote issues.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/report/${issueId}/upvote`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Update local state instantly so UI feels snappy
        setIssues(prevIssues => prevIssues.map(issue => {
          if (issue._id === issueId) {
            let newUpvotes = [...(issue.upvotes || [])];
            if (data.hasUpvoted) {
              newUpvotes.push(user._id);
            } else {
              newUpvotes = newUpvotes.filter(uid => uid !== user._id);
            }
            return { ...issue, upvotes: newUpvotes };
          }
          return issue;
        }));
      } else {
        alert(data.message || "Failed to upvote");
      }
    } catch (err) {
      console.error("Upvote error", err);
    }
  };

  return (
    <section className={`bg-surface-container-low py-24 px-6 min-h-[600px] ${standalone ? 'mt-16' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-4">
              Local Area Issues
            </h2>
            <p className="text-on-surface-variant max-w-lg mb-6">
              Track progress, upvote specific problems, and support local resolutions in your neighborhood.
            </p>
            
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  location_on
                </span>
                <input 
                  type="text" 
                  placeholder="Filter by PIN Code..." 
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-surface-container rounded-full border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-64 transition-all"
                />
              </div>
              <button type="submit" className="bg-on-background text-white px-6 py-3 rounded-full font-bold hover:bg-black transition-colors active:scale-95 shadow-md">
                Search
              </button>
              {pinCode && (
                <button type="button" onClick={clearSearch} className="text-on-surface-variant hover:text-error text-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">close</span> Clear
                </button>
              )}
            </form>

          </div>
        </div>

        {/* Grid of Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
             <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">sync</span>
             <p className="font-bold">Loading local issues...</p>
          </div>
        ) : issues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {issues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} user={user} onUpvote={handleUpvote} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest p-16 rounded-[2rem] text-center border border-outline-variant/30 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-primary-fixed/20 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-primary-fixed">verified_user</span>
            </div>
            <h3 className="font-headline text-2xl font-bold mb-2">No Issues Found</h3>
            <p className="text-on-surface-variant max-w-sm mx-auto">
              Your area looks great! There are no active issues reported for this PIN code right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentIssues;
