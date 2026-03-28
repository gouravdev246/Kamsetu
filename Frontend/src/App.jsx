import { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import RecentIssues from './components/RecentIssues'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'
import MunicipalityRanks from './components/MunicipalityRanks'
import ReportIssue from './components/ReportIssue'
import TopContributors from './components/TopContributors'
import AdminPanel from './components/AdminPanel'
import UserAuth from './components/UserAuth'
import AdminAuth from './components/AdminAuth'

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kamsetu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('kamsetu_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const handleUserAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('kamsetu_user', JSON.stringify(userData));
    setCurrentPage('home');
  };

  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem('kamsetu_user');
    setCurrentPage('home');
  };

  const handleAdminAuth = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('kamsetu_admin', JSON.stringify(adminData));
    setCurrentPage('admin');
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('kamsetu_admin');
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'leaderboard':
        return <MunicipalityRanks />;
      case 'report':
        return <ReportIssue user={user} />;
      case 'contributors':
        return <TopContributors />;
      case 'admin':
        return admin ? <AdminPanel admin={admin} onLogout={handleAdminLogout} /> : <AdminAuth onAuthSuccess={handleAdminAuth} />;
      case 'login':
        return <UserAuth onAuthSuccess={handleUserAuth} />;
      default:
        return (
          <main className="pt-20 pb-24 md:pb-0">
            <HeroSection user={user} setCurrentPage={setCurrentPage} />
            <StatsSection />
            <RecentIssues />
            <CTASection setCurrentPage={setCurrentPage} />
          </main>
        );
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        user={user} 
        admin={admin} 
        onUserLogout={handleUserLogout}
        onAdminLogout={handleAdminLogout}
      />
      {renderPage()}
      <Footer />
      <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} admin={admin} />
    </div>
  )
}

export default App
