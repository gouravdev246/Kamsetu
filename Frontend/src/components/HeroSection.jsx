const HeroSection = ({ setCurrentPage }) => {
  return (
    <section className="relative min-h-[870px] flex items-center px-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover brightness-[0.85]"
          alt="Wide angle view of a modern clean city street with high-tech sustainable architecture, green trees, and soft daylight illumination"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlLexbqBXNE0s1iNfwMZ04Kuxsr35ZxW9Mh3Il74WoTFZEK11HEhbGrKkA-kFsF6bUrgoWuHSVuFYfPwzjaF1vPcURVwdvs-eX2YT_0fEexbiurg9AxTajgfMxRtAa3Dmxw3fHxFEo_S3RXR5zZKCSB75rxqapNA42SjehTXljBkyYuMDML0AxqKStVPAXNjlfZOCjvDDHmYxaj6kUSdGDwHr0EiphkjQ8LllsTk-Kfts_bOnRfqPyHuSPuxNp7lUloWzXiEpE1Iw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-on-background/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - Hero Text */}
        <div className="space-y-8">
          <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-white leading-[1.1] tracking-tight animate-fade-in-up">
            Report Civic Issues, <br />
            <span className="text-primary-fixed">Build Better Cities</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl leading-relaxed font-medium animate-fade-in-up animation-delay-200">
            Empowering citizens to communicate directly with local government.
            Transparent, fast, and community-driven urban improvement.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 animate-fade-in-up animation-delay-400">
            <button 
              onClick={() => setCurrentPage('report')}
              className="bg-gradient-to-r from-primary to-primary-container text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2 hover:translate-y-[-2px] duration-300">
              <span className="material-symbols-outlined">add_circle</span>
              Report Issue
            </button>
            <button 
              onClick={() => setCurrentPage('leaderboard')}
              className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all active:scale-95 hover:translate-y-[-2px] duration-300">
              View Leaderboard
            </button>
          </div>
        </div>

        {/* Right - Featured Bento Card */}
        <div className="hidden lg:block bg-surface-container-lowest/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl animate-slide-in-right animation-delay-300">
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
              <span className="text-primary-fixed font-bold text-sm uppercase tracking-widest">
                Active Community
              </span>
              <h3 className="text-white font-headline text-2xl font-bold">
                Real-time Impact
              </h3>
            </div>
            <div className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold animate-pulse-glow">
              Live
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-fixed">
                  location_on
                </span>
              </div>
              <div>
                <p className="text-white font-bold">New Report: Pothole Repair</p>
                <p className="text-white/60 text-sm">
                  Downtown District • 2 mins ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary-fixed">
                  check_circle
                </span>
              </div>
              <div>
                <p className="text-white font-bold">
                  Issue Resolved: Street Light
                </p>
                <p className="text-white/60 text-sm">
                  North Side • 15 mins ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
