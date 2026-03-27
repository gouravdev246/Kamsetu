import { useState } from 'react';

const podiumData = [
  {
    rank: 2,
    name: 'Marcus Chen',
    title: 'Civic Hero',
    issues: 142,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC68YDbFYhhVGroZgj0fwkQ3AwhGZpYagCkCDVTLYVjUHRwttHKGBx7ckUHukbKpzfo0VCfXTrsnRTi4lhwET-YL8G9jeKdGgKnq23G6SUx3sY6FM_p91BTXPtdudcrGo8l_Ep0M6R0JZSqZ7F97rdx8ZbrCkOom4FzUEpX7VwuAwqzt0gXLsNh5LKsEY3Hh2KCVpdmZB3x0Adh_seHjd5FIsgqnARgkOEtiQz1nrUfmZ7Dezi_lCa_ZPLzHnS_cRy7k__DGdiWdFA',
  },
  {
    rank: 1,
    name: 'Elena Rodriguez',
    title: 'Legendary Guardian',
    issues: 189,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnMS80LQ5L7lWPgWWAI-d6Pstx6chborED9oh3krFPNRYXzqxrNLzrVt2dnFr_93B8liF17tS1tiyi00CNn7t9Er3UqWIgKNgM2n5H75posF2d7CG5UhD7d4VMTcaw0SUf9OF---W5Lg5pJKnSJoSLGyesTLKJxgxTnvUXu3PRLsnVDkWJMIMuCMr2a07lGpiu5ceKR_Z7_N-_vbxeKbKpEeBdHmYmIeavc15PuLS-MRBr5XYGeleYWOAOOfM2WQ7Z8_jlf6CL4zk',
  },
  {
    rank: 3,
    name: 'Jordan Smith',
    title: 'Top Reporter',
    issues: 128,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6IS3WfJkBAM0dRsRhRPLUUW_8LBxQsEnd9b372hVfkoi4PUsobGAowGxhBwqMiHNlPG8oyhYWaJ3MrPyLOdzGpGz7OseNrvEKhLW2-WCbDE5s-X4fvtpGDvF-vngM4FO_aKVnjHQPi75Wo1bPNY1QXfWufxrLassqPWEVV3aGtV5vH3CIJtxpJ2o6Q8Z8XOedtsfnr0mTiTDTqeUPoklugnGGfF-wVOVElYRIU7jDOO5Eddy8AiqxblJcS_8igx2Ew_JUjSTt_3c',
  },
];

const tableData = [
  {
    rank: 4,
    name: 'Sarah Jenkins',
    issues: 94,
    badge: 'Advocate',
    badgeStyle: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    points: '2,850',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyuXFkBRrvwFC37_Ex0lGz_ilLznDg4O8uI49VdzJ6hRcCKShxwgNA3Hw8GjxkvLRwB6qlomvBINr8eWtRdz6yKhAlN3q3ffQqKNmyXU6hErkqpxiukNcwnlnI7qpd4uoBl4W9kbzUIMQrfds_Xjy0MRY2mgmwIelUzJQ3vM3NNjPB8gfOL8-42ys5sON6p_AddHlL4qNmfjLBA9wjUGckYYVsNIHEsPs0ava-XpE9qW2I_iy4ujrovHsM_e38PKgjmbV-pZKCkTQ',
    isCurrentUser: false,
  },
  {
    rank: 5,
    name: 'You (Alex Rivera)',
    issues: 88,
    badge: 'Rising Star',
    badgeStyle: 'bg-primary-fixed text-on-primary-fixed-variant',
    points: '2,420',
    avatar: null,
    isCurrentUser: true,
  },
  {
    rank: 6,
    name: 'Mia Thompson',
    issues: 76,
    badge: 'Initiator',
    badgeStyle: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    points: '2,100',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAotQZoJCRLAv6w5PQDyYYnxtXNXeE2cN7Tk_C37KZc2dWzeBIwQ8AkM_8_UOrve686gWQsSe-BwhVi_8n9kJ2Gl9JYZsjearFPbulOGb8Qz8TGmn-2wtEWxDs7Gp6FAWwV4Ki6QoFEyXiORUo2IySCVv5-t3MCBub2eYUIlMjXNfQPZdGaxqW-MzUjC9puHYJ9TIxkpr8UyyKt6ys2pEMBAlJnK4iLn8Y3Gq8f_aa94D4FiuFaIbwegbCNzNpdTjpraeoBqtdsw14',
    isCurrentUser: false,
  },
  {
    rank: 7,
    name: 'David Wilson',
    issues: 62,
    badge: 'Contributor',
    badgeStyle: 'bg-surface-variant text-on-surface-variant',
    points: '1,890',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP9tVfCJ0HJsXmBmZlpjNMKSxIiqFJ5VNuVwJV6s8KLKx9aC63b_r7_2T1PXvFQbbMnTmTjoCL5VzS3xypYa62wSU-blPO0kLJG5Ef14GnKOWfov8dYzTyb9a9TldPlUs3yj7O43LWyWH7B4D2q8MtnWLsFzsOir0-YQKNlLyOh3BZZ7n0aBI6l0AOpKMeYivz3QxvqYzIFELi58kyy-sFet7Fto1yKoclOw-su9q9N_iga1W-30cfepY2k-08N9w0Pt2tQyCaIqA',
    isCurrentUser: false,
  },
];

const TopContributors = () => {
  const [activeFilter, setActiveFilter] = useState('Weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const filters = ['Weekly', 'Monthly', 'All-Time'];

  const filteredTable = tableData.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {podiumData.map((person) => {
            if (person.rank === 1) {
              return (
                <div
                  key={person.rank}
                  className="order-1 md:order-2 bg-gradient-to-br from-primary to-primary-container rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-xl shadow-primary/10 relative overflow-hidden transform md:-translate-y-4"
                >
                  <div className="absolute -top-6 -right-6">
                    <span
                      className="material-symbols-outlined text-8xl text-white/10"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      workspace_premium
                    </span>
                  </div>
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 mb-6 overflow-hidden ring-4 ring-primary-fixed/30">
                    <img className="w-full h-full object-cover" alt={person.name} src={person.avatar} />
                  </div>
                  <h3 className="text-2xl font-black text-white">{person.name}</h3>
                  <span className="text-xs font-black text-white/80 uppercase tracking-[0.2em] mb-4">
                    {person.title}
                  </span>
                  <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full font-bold text-white text-base">
                    {person.issues} Issues Resolved
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
                <div className={`absolute top-4 ${isSecond ? 'left-4' : 'right-4'} text-4xl font-black text-on-surface/5`}>
                  {isSecond ? '02' : '03'}
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-surface-container-highest mb-4 overflow-hidden">
                  <img className="w-full h-full object-cover" alt={person.name} src={person.avatar} />
                </div>
                <h3 className="text-xl font-bold text-on-surface">{person.name}</h3>
                <span className={`text-sm font-semibold uppercase tracking-widest mb-4 ${isSecond ? 'text-primary' : 'text-secondary'}`}>
                  {person.title}
                </span>
                <div className="bg-surface-container-lowest px-4 py-2 rounded-full font-bold text-on-surface-variant text-sm">
                  {person.issues} Issues Resolved
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters & Table Section */}
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
          {/* Filter Header */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex bg-surface-container-low p-1.5 rounded-full w-full md:w-auto">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    activeFilter === f
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
                search
              </span>
              <input
                className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50"
                placeholder="Find a contributor..."
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
                {filteredTable.map((row) => (
                  <tr
                    key={row.rank}
                    className={
                      row.isCurrentUser
                        ? 'bg-primary/5 border-l-4 border-primary'
                        : 'hover:bg-surface-container-low/30 transition-colors'
                    }
                  >
                    <td className={`px-8 py-5 font-bold ${row.isCurrentUser ? 'font-black text-primary italic' : 'text-on-surface-variant'}`}>
                      {row.rank}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        {row.isCurrentUser ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                            <img className="w-full h-full object-cover" alt={row.name} src={row.avatar} />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-on-surface">{row.name}</span>
                          {row.isCurrentUser && (
                            <div className="text-[10px] text-primary font-bold uppercase tracking-tight">Current Position</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={`px-8 py-5 ${row.isCurrentUser ? 'font-bold' : 'font-medium'} text-on-surface`}>
                      {row.issues}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`${row.badgeStyle} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider`}>
                        {row.badge}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-black text-primary">{row.points}</td>
                  </tr>
                ))}
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
