import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TopRanksGrid = ({ topThree }) => {
  const top1 = topThree[0] || { name: '...', resolved: 0, total: 0, rate: 0 };
  const top2 = topThree[1] || { name: '...', resolved: 0, total: 0, rate: 0 };
  const top3 = topThree[2] || { name: '...', resolved: 0, total: 0, rate: 0 };

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20">
      {/* Rank 1: Major Feature Card */}
      <div className="md:col-span-12 lg:col-span-7 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-fixed/20 rounded-bl-[10rem] -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-5xl font-black text-secondary/20 block mb-2">01</span>
              <h2 className="text-3xl font-bold">{top1.name}</h2>
              <p className="text-on-surface-variant font-medium">Regional Excellence Center</p>
            </div>
            <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${top1.rate > 0.8 ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-primary-fixed text-on-primary-fixed'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              {top1.rate > 0.8 ? 'EXCELLENT' : 'TOP PERFORMER'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Issues Resolved</p>
              <p className="text-4xl font-extrabold text-primary">{top1.resolved}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Total Reports</p>
              <p className="text-4xl font-extrabold text-primary">{top1.total}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span>Community Progress</span>
              <span className="text-secondary">{(top1.rate * 100).toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-secondary to-secondary-fixed transition-all duration-1000" style={{ width: `${top1.rate * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Rank 2 & 3 */}
      <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
        {[top2, top3].map((item, idx) => (
          <div key={idx} className="bg-surface-container-low p-6 rounded-[2rem] flex-1 group hover:bg-surface-container-low/80 transition-all border border-transparent hover:border-outline-variant/30">
            <div className="flex justify-between items-center mb-6">
              <span className="text-3xl font-black text-primary/20">0{idx + 2}</span>
              <div className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Good</div>
            </div>
            <h3 className="text-xl font-bold mb-4">{item.name}</h3>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{item.resolved} <span className="text-sm font-normal text-on-surface-variant">resolved</span></p>
                <p className="text-sm text-on-surface-variant">{(item.rate * 100).toFixed(1)}% efficiency</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FullLeaderboardTable = ({ list }) => {
  return (
    <section className="bg-surface-container-lowest rounded-[2.5rem] shadow-sm p-8 border border-outline-variant/10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <h2 className="text-2xl font-bold">Full Municipal Performance</h2>
        <div className="relative w-full md:w-auto">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
          <input 
             className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-surface-container-low rounded-full border-none focus:ring-2 focus:ring-primary/20 text-sm" 
             placeholder="Search municipality..." 
             type="text" 
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Rank</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Municipality Name</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Issues Resolved</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Total Reported</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Progress</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px] text-right">Label</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {list.map((item, index) => (
              <tr key={index} className="group hover:bg-primary/[0.02] transition-colors">
                <td className="py-6 font-black text-on-surface-variant/40 italic">{String(index + 4).padStart(2, '0')}</td>
                <td className="py-6 font-bold text-on-background">{item.name}</td>
                <td className="py-6 font-bold text-primary">{item.resolved}</td>
                <td className="py-6 font-medium text-on-surface-variant">{item.total}</td>
                <td className="py-6">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs min-w-[3.5rem]">{(item.rate * 100).toFixed(0)}%</span>
                    <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${item.rate * 100}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-6 text-right">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap bg-primary-fixed text-on-primary-fixed-variant`}>
                    {item.rate > 0.7 ? 'Stable' : 'Observation'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const MunicipalityRanks = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/report/stats/municipalities');
        const formatted = response.data.stats.map(s => ({
          name: s.municipality,
          total: s.total,
          resolved: s.resolved,
          rate: s.resolutionRate
        }));
        setStats(formatted);
      } catch (error) {
        console.error('Leaderboard Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block uppercase tracking-wider text-primary font-bold text-[10px] bg-primary-fixed px-3 py-1.5 rounded-full shadow-sm">
              Public Accountability Engine
            </span>
            <h1 className="text-5xl font-black tracking-tight text-on-background leading-tight">
              Leading <span className="text-primary">Authorities</span>
            </h1>
            <p className="text-lg text-on-surface-variant font-medium leading-relaxed">
               Mapping civic efficiency through data transparency. These rankings reflect the real resolution rates of local bodies as verified by community reports.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
            <span className="material-symbols-outlined text-5xl animate-spin mb-4">sync</span>
            <p className="font-bold text-sm tracking-widest uppercase">Calculating Metrics...</p>
          </div>
        ) : stats.length === 0 ? (
          <div className="text-center py-32 bg-surface-container-low rounded-[3rem] border-2 border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-7xl text-outline mb-6">analytics</span>
            <h2 className="text-2xl font-bold mb-2">Awaiting Local Data</h2>
            <p className="text-on-surface-variant font-medium">Rankings will appear once initial reports are filed.</p>
          </div>
        ) : (
          <>
            <TopRanksGrid topThree={stats.slice(0, 3)} />
            <FullLeaderboardTable list={stats.slice(3)} />
          </>
        )}
      </main>
    </div>
  );
};

export default MunicipalityRanks;
