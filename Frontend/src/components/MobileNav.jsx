const MobileNav = ({ currentPage, setCurrentPage, user, admin }) => {
  const getProfileLink = () => {
    if (admin) return { icon: 'verified_user', label: 'Admin', id: 'admin' };
    if (user) return { icon: 'account_circle', label: 'Profile', id: 'profile' };
    return { icon: 'login', label: 'Login', id: 'login' };
  };

  const profileLink = getProfileLink();

  const navItems = [
    { icon: 'home', label: 'Home', id: 'home', href: '#' },
    { icon: 'add_circle', label: 'Report', id: 'report', href: '#report' },
    { icon: 'leaderboard', label: 'Ranks', id: 'leaderboard', href: '#leaderboard' },
    { icon: profileLink.icon, label: profileLink.label, id: profileLink.id, href: `#${profileLink.id}` },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-white/90 backdrop-blur-xl rounded-t-3xl z-50 shadow-[0_-4px_24px_rgba(7,30,39,0.04)] border-t border-slate-100">
      {navItems.map((item) => (
        <a
          key={item.label}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(item.id);
          }}
          className={`flex flex-col items-center justify-center px-5 py-2 active:scale-90 transition-transform duration-150 cursor-pointer ${
            currentPage === item.id
              ? 'bg-primary/10 text-primary rounded-2xl'
              : 'text-slate-500'
          }`}
          href={item.href}
        >
          <span
            className={`material-symbols-outlined ${
              currentPage === item.id ? 'filled' : ''
            }`}
            style={
              currentPage === item.id
                ? { fontVariationSettings: "'FILL' 1" }
                : {}
            }
          >
            {item.icon}
          </span>
          <span className="font-body text-[10px] font-semibold uppercase tracking-wider mt-1">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
};

export default MobileNav;
