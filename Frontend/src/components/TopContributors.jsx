import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Removed static mock data


const TopContributors = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        const res = await axios.get('/api/report/stats/contributors');
        const formatted = res.data.contributors.map((c, i) => ({
          rank: i + 1,
          name: c.name,
          issues: c.reportCount,
          points: c.points,
          title: i === 0 ? 'Legendary Guardian' : i === 1 ? 'Civic Hero' : i === 2 ? 'Top Reporter' : 'Contributor',
          badge: i < 5 ? 'Elite' : i < 10 ? 'Rising Star' : 'Member',
          badgeStyle: i < 5 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-variant text-on-surface-variant',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}` // Real-time placeholder avatar
        }));
        setData(formatted);
      } catch (err) {
        console.error('Leaderboard Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopContributors();
  }, []);

  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const podium = data.slice(0, 3);
  const list = filteredData.slice(3);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface flex-col gap-4">
      <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      <p className="font-bold text-[10px] tracking-widest uppercase opacity-50">Ranking Citizens...</p>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-24 pb-32 px-4 max-w-5xl mx-auto">
        {/* Hero Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold text-on-background tracking-tighter mb-4 font-headline">
            Top Contributors
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">
            Recognizing the guardians of our city. Your reports build a more transparent, efficient, and beautiful community for everyone.
          </p>
        </header>

        {/* Podium / Top 3 */}
        {podium.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {podium.map((person) => {
              if (person.rank === 1) {
                return (
                  <div
                    key={person.rank}
                    className="order-1 md:order-2 bg-gradient-to-br from-primary to-primary-container rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-xl shadow-primary/10 relative overflow-hidden transform md:-translate-y-4"
                  >
                    <div className="absolute -top-6 -right-6">
                      <span className="material-symbols-outlined text-8xl text-white/10" style={{ fontVariationSettings: "'FILL' 1" }}>
                        workspace_premium
                      </span>
                    </div>
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 mb-6 overflow-hidden ring-4 ring-primary-fixed/30 bg-white">
                      <img className="w-full h-full object-cover" alt={person.name} src={person.avatar} />
                    </div>
                    <h3 className="text-2xl font-black text-white">{person.name}</h3>
                    <span className="text-xs font-black text-white/80 uppercase tracking-[0.2em] mb-4">
                      {person.title}
                    </span>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full font-bold text-white text-base">
                      {person.issues} Reports Filed
                    </div>
                  </div>
                );
              }

              const isSecond = person.rank === 2;
              return (
                <div
                  key={person.rank}
                  className={`${isSecond ? 'order-2 md:order-1' : 'order-3'} bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-lg transition-shadow`}
                >
                  <div className={`absolute top-4 ${isSecond ? 'left-4' : 'right-4'} text-4xl font-black text-on-surface/5 font-headline`}>
                    0{isSecond ? '2' : '3'}
                  </div>
                  <div className="w-20 h-20 rounded-full border-4 border-surface-container-highest mb-4 overflow-hidden bg-white">
                    <img className="w-full h-full object-cover" alt={person.name} src={person.avatar} />
                  </div>
                  <h3 className="text-xl font-bold text-on-surface">{person.name}</h3>
                  <span className={`text-sm font-semibold uppercase tracking-widest mb-4 ${isSecond ? 'text-primary' : 'text-secondary'}`}>
                    {person.title}
                  </span>
                  <div className="bg-surface-container-lowest px-4 py-2 rounded-full font-bold text-on-surface-variant text-sm border border-outline-variant/10">
                    {person.issues} Reports
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filters & Table Section */}
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-outline-variant/10">
            <h2 className="text-xl font-bold text-on-surface italic">All-Time Guardians</h2>
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-sm">
                search
              </span>
              <input
                className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50"
                placeholder="Search citizens..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant/70">Rank</th>
                  <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant/70">Contributor</th>
                  <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant/70">Issues Reported</th>
                  <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant/70">Badge</th>
                  <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant/70">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {list.map((row) => (
                  <tr key={row.rank} className="hover:bg-primary/[0.02] transition-colors">
                    <td className="px-8 py-5 font-black text-on-surface-variant/30 italic">
                      0{row.rank}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-outline-variant/20">
                          <img className="w-full h-full object-cover" alt={row.name} src={row.avatar} />
                        </div>
                        <span className="font-bold text-on-surface">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-on-surface">
                      {row.issues} Reports
                    </td>
                    <td className="px-8 py-5">
                      <span className={`${row.badgeStyle} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm`}>
                        {row.badge}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-black text-primary tracking-tight">
                      {row.points.toLocaleString()} PTS
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-20 text-center opacity-50">
                       No citizens found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Load More */}
          <div className="p-8 flex justify-center border-t border-surface-container-low">
            <button className="px-8 py-3 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-95">
              View full rankings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopContributors;
