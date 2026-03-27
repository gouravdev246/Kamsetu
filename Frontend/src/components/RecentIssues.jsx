const issues = [
  {
    id: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCTn4vqEuezkPp6ez8eoEwQ1asWaEj8FiCkAuN7oVn8oUoJxZMoNCsTQZxh_LW-bc6eGTjOiYacM4qX75LyUueyuy5o0N4JkBIVAY4uAz2hoNhxCzsX8mPzH2jou7fif0AgVIC73P_JSPXlLr6MTBu36ntqjaDJiOUkNG8yMegEh2c5Apu-RgusDXEq9UiC736p-LA6DFXPjgkR_2m0HWMZjZDqqXO0s2JZnZzr7tzmMBExk3x3jibFmadZGO5Ro0PuMSgKMNjaW70',
    imageAlt:
      'Close up of a damaged urban road surface with a significant pothole',
    status: 'Pending',
    statusClasses:
      'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    location: '123 Main St, Central District',
    title: 'Severely damaged road surface',
    supporters: 12,
    time: '3h ago',
    avatarColors: ['bg-slate-200', 'bg-slate-300'],
  },
  {
    id: 2,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5rfbn_x8lwkKRxlkFl74m2HFkrGT8kJZI-ymHIA_mo1DJp1otyzuYdeRqFPdN-V4zexpAT2DW40NiWWj7U6XLqcbAKjDWTKoImkez1rmAyD3goLCo8GeypVrDC2FBuCK7C4ZR47gOCyVqX4TzLzU8Ia1bw1-tg9YCiv8AhZEp0wkGtIJPXr_9D3YG-5VdPQTBlRUdNhKvHiQ_GFXVAeThlwDAwHvInyzX0PClFJrxoHTdoN5E-wYFR8tlpHy5Yqr5Msm_uoe_Nks',
    imageAlt:
      'A modern urban park bench with some graffiti, surrounded by green grass',
    status: 'In Progress',
    statusClasses:
      'bg-primary-fixed text-on-primary-fixed-variant',
    location: 'Liberty Park, East Side',
    title: 'Graffiti on historical bench',
    supporters: 5,
    time: '8h ago',
    avatarColors: ['bg-slate-200', 'bg-slate-400'],
  },
  {
    id: 3,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMCTvKqggkcHJdKk-OmLsNbYJmzi2ORrQ3Tr4uSODX1L6NFiiA3qutjbIzDHSTncmH0cAjXSCq5-zEr_495cvyT52PViLZ3pOSGlztXJSzPq7dwBR4sEJLqBzLG8jjZ50JKNMA3rGBZVAgYBOA8DECha959nQ5ZdIr_9VYUwQrdy7cIQ9SNgigFuUUkAzMg0auQrKOvHemlQ-VNmSlCyBxZls1vOJ2ZTqks89bNfkMbdow5Uc0ugw_Lhpl8ag9KsUYNX4oKcN3RqM',
    imageAlt: 'A brightly lit street lamp at dusk with a clear twilight sky',
    status: 'Resolved',
    statusClasses:
      'bg-secondary-fixed text-on-secondary-fixed-variant',
    location: '45 Oak Boulevard',
    title: 'Broken street light flickering',
    supporters: 24,
    time: 'Solved yesterday',
    timeColor: 'text-secondary',
    avatarColors: ['bg-slate-500', 'bg-slate-200'],
  },
];

const IssueCard = ({ issue }) => (
  <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden group hover:shadow-xl transition-shadow duration-300">
    <div className="relative h-64 overflow-hidden">
      <img
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        alt={issue.imageAlt}
        src={issue.image}
      />
      <div
        className={`absolute top-4 right-4 ${issue.statusClasses} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider`}
      >
        {issue.status}
      </div>
    </div>
    <div className="p-8">
      <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-3">
        <span className="material-symbols-outlined text-sm">location_on</span>
        {issue.location}
      </div>
      <h4 className="font-headline text-xl font-bold mb-4 text-on-surface">
        {issue.title}
      </h4>
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex -space-x-2">
          {issue.avatarColors.map((color, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full border-2 border-white ${color}`}
            ></div>
          ))}
          <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-primary text-[10px] text-white font-bold">
            +{issue.supporters}
          </div>
        </div>
        <span
          className={`text-xs font-bold uppercase ${
            issue.timeColor || 'text-on-surface-variant'
          }`}
        >
          {issue.time}
        </span>
      </div>
    </div>
  </div>
);

const RecentIssues = () => {
  return (
    <section className="bg-surface-container-low py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-4">
              Recent Community Issues
            </h2>
            <p className="text-on-surface-variant max-w-lg">
              Real-time reports from your neighbors. Track progress and support
              local resolutions.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group">
            View All Reports{' '}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <button className="bg-primary-container text-white w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
            View All Reports{' '}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecentIssues;
