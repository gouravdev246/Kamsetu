import React from 'react';

const TopRanksGrid = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20">
      {/* Rank 1: Major Feature Card */}
      <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-fixed/20 rounded-bl-[10rem] -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-5xl font-black text-secondary/20 block mb-2">01</span>
              <h2 className="text-3xl font-bold">Northwood District</h2>
              <p className="text-on-surface-variant">Regional Excellence in Infrastructure</p>
            </div>
            <div className="bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              EXCELLENT
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Issues Resolved</p>
              <p className="text-4xl font-extrabold text-primary">1,284</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Response Time</p>
              <p className="text-4xl font-extrabold text-primary">1.4d</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span>Community Resolution Progress</span>
              <span className="text-secondary">98.2%</span>
            </div>
            <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-secondary to-secondary-fixed w-[98.2%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Rank 2 & 3: Secondary Cards */}
      <div className="md:col-span-5 flex flex-col gap-8">
        {/* Rank 2 */}
        <div className="bg-surface-container-low p-6 rounded-[2rem] flex-1 group">
          <div className="flex justify-between items-center mb-6">
            <span className="text-3xl font-black text-primary/20">02</span>
            <div className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Good</div>
          </div>
          <h3 className="text-xl font-bold mb-4">West Port Marina</h3>
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-2xl font-bold">942 <span className="text-sm font-normal text-on-surface-variant">resolved</span></p>
              <p className="text-sm text-on-surface-variant">2.1 days avg.</p>
            </div>
            <div className="h-12 w-24 flex items-end gap-1 pb-1">
              <div className="w-2 bg-primary/20 h-1/2 rounded-t"></div>
              <div className="w-2 bg-primary/30 h-2/3 rounded-t"></div>
              <div className="w-2 bg-primary/50 h-3/4 rounded-t"></div>
              <div className="w-2 bg-primary h-full rounded-t"></div>
            </div>
          </div>
        </div>
        {/* Rank 3 */}
        <div className="bg-surface-container-low p-6 rounded-[2rem] flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-3xl font-black text-primary/20">03</span>
            <div className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Good</div>
          </div>
          <h3 className="text-xl font-bold mb-4">South Peak Valley</h3>
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-2xl font-bold">876 <span className="text-sm font-normal text-on-surface-variant">resolved</span></p>
              <p className="text-sm text-on-surface-variant">2.8 days avg.</p>
            </div>
            <div className="h-12 w-24 flex items-end gap-1 pb-1">
              <div className="w-2 bg-primary/40 h-1/3 rounded-t"></div>
              <div className="w-2 bg-primary/50 h-2/3 rounded-t"></div>
              <div className="w-2 bg-primary/20 h-1/2 rounded-t"></div>
              <div className="w-2 bg-primary/80 h-3/4 rounded-t"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FullLeaderboardTable = () => {
  const municipalities = [
    { rank: '04', name: 'Evergreen Heights', region: 'Metro Region', resolved: 754, avgResponse: '3.1 days', rate: '88%', badge: 'Good', badgeClass: 'bg-primary-fixed text-on-primary-fixed-variant', progress: '75%' },
    { rank: '05', name: 'Riverstone Township', region: 'Central District', resolved: 621, avgResponse: '3.4 days', rate: '82%', badge: 'Good', badgeClass: 'bg-primary-fixed text-on-primary-fixed-variant', progress: '62%' },
    { rank: '06', name: 'Oak Ridge Settlement', region: 'South Sector', resolved: 312, avgResponse: '5.8 days', rate: '54%', badge: 'Needs Improvement', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', progress: '35%', barColor: 'bg-tertiary' },
    { rank: '07', name: 'Crestview Colony', region: 'Northern Frontier', resolved: 498, avgResponse: '4.1 days', rate: '71%', badge: 'Good', badgeClass: 'bg-primary-fixed text-on-primary-fixed-variant', progress: '50%' },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-[2.5rem] shadow-sm p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <h2 className="text-2xl font-bold">Full Municipal Performance</h2>
        <div className="relative w-full md:w-auto">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
          <input className="w-full md:w-64 pl-10 pr-4 py-2 bg-surface rounded-full border-none focus:ring-2 focus:ring-primary/40 text-sm" placeholder="Search municipality..." type="text"/>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-surface">
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Rank</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Municipality Name</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Issues Resolved</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Avg Response</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Performance Rate</th>
              <th className="pb-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px] text-right">Badge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface">
            {municipalities.map((item) => (
              <tr key={item.rank} className="group hover:bg-surface-container-low/50 transition-colors">
                <td className="py-6 font-bold text-on-surface-variant">{item.rank}</td>
                <td className="py-6">
                  <p className="font-bold text-on-background">{item.name}</p>
                  <p className="text-xs text-on-surface-variant">{item.region}</p>
                </td>
                <td className="py-6">
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{item.resolved}</span>
                    <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className={`h-full ${item.barColor || 'bg-primary'}`} style={{ width: item.progress }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-6 font-medium">{item.avgResponse}</td>
                <td className="py-6 font-bold text-on-surface">{item.rate}</td>
                <td className="py-6 text-right">
                  <span className={`${item.badgeClass} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap`}>
                    {item.badge}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex justify-center">
        <button className="text-primary font-bold hover:underline">View All 142 Municipalities</button>
      </div>
    </section>
  );
};

const MunicipalityRanks = () => {
  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-block uppercase tracking-wider text-primary font-semibold text-xs bg-primary-fixed px-3 py-1 rounded-full">
                Civic Performance Tracking
              </span>
              <h1 className="text-5xl font-extrabold tracking-tight text-on-background">
                Top Performing Authorities
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Quantifying municipal accountability through real-time resolution data. 
                Transparent metrics driving better public services.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-surface-container-highest text-on-background px-6 py-3 rounded-full font-semibold hover:opacity-80 transition-all active:scale-95 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">filter_list</span> 
                Filter Region
              </button>
              <button className="bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
                Download Report <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>
        </header>

        {/* Top 3 Ranks */}
        <TopRanksGrid />

        {/* Detailed Leaderboard */}
        <FullLeaderboardTable />
      </main>
    </div>
  );
};

export default MunicipalityRanks;
