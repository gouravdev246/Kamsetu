import { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const [data, setData] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    activeCitizens: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/report/global-stats");
        const json = await response.json();
        if (json.success) {
          setData(json.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      icon: 'analytics',
      label: 'Total Issues Reported',
      value: data.totalIssues,
      iconBg: 'bg-primary-container/10',
      iconColor: 'text-primary',
    },
    {
      icon: 'verified',
      label: 'Resolved Matters',
      value: data.resolvedIssues,
      iconBg: 'bg-secondary-container/20',
      iconColor: 'text-secondary',
      progress: data.totalIssues > 0 ? Math.round((data.resolvedIssues / data.totalIssues) * 100) : 0,
    },
    {
      icon: 'group',
      label: 'Active Citizens',
      value: data.activeCitizens,
      iconBg: 'bg-tertiary-fixed/20',
      iconColor: 'text-tertiary',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_24px_32px_rgba(7,30,39,0.04)] group hover:translate-y-[-4px] transition-all duration-300 animate-fade-in-up animation-delay-${(index + 1) * 200}`}
          >
            <div
              className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
            >
              <span className={`material-symbols-outlined ${stat.iconColor} text-3xl`}>
                {stat.icon}
              </span>
            </div>
            <p className="font-label text-on-surface-variant font-bold text-xs uppercase tracking-[0.15em] mb-2">
              {stat.label}
            </p>
            <h2 className="font-headline text-4xl font-extrabold text-on-surface">
              <AnimatedCounter end={stat.value} />
            </h2>
            {stat.progress && (
              <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-secondary-fixed rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
