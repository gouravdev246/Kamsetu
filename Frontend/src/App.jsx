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

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'leaderboard':
        return <MunicipalityRanks />;
      case 'report':
        return <ReportIssue />;
      case 'contributors':
        return <TopContributors />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <main className="pt-20 pb-24 md:pb-0">
            <HeroSection />
            <StatsSection />
            <RecentIssues />
            <CTASection />
          </main>
        );
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer />
      <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default App
