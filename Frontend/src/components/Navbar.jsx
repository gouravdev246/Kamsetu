import { useState, useEffect } from 'react';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home', href: '#' },
    { label: 'Report Issue', id: 'report', href: '#report' },
    { label: 'Leaderboard', id: 'leaderboard', href: '#leaderboard' },
    { label: 'Contributors', id: 'contributors', href: '#contributors' },
    { label: 'Portal', id: 'admin', href: '#portal' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 shadow-lg shadow-on-background/5'
          : 'bg-white/80 shadow-sm'
      } backdrop-blur-md`}
    >
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="text-2xl font-extrabold tracking-tighter text-slate-900 font-headline cursor-pointer"
        >
          Kamsetu
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(link.id);
              }}
              className={`font-headline font-bold text-sm tracking-tight transition-colors cursor-pointer ${
                currentPage === link.id
                  ? 'text-blue-700 border-b-2 border-blue-600 pb-1'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentPage('report')}
            className="hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary-container transition-all active:scale-95 shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Report
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-50 transition-all active:scale-95 duration-200">
            <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-50 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 animate-fade-in">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block py-2 font-headline font-bold text-sm cursor-pointer ${
                  currentPage === link.id ? 'text-blue-700' : 'text-slate-600'
                }`}
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
