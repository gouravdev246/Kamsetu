const CTASection = ({ setCurrentPage }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="bg-on-background rounded-[3rem] p-12 md:p-24 relative overflow-hidden flex flex-col items-center text-center group">
        {/* Radial glow background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#005dac_0%,transparent_70%)] group-hover:opacity-30 transition-opacity duration-700"></div>

        {/* Floating dots decoration */}
        <div className="absolute top-12 left-12 w-2 h-2 rounded-full bg-primary-fixed/40 animate-pulse"></div>
        <div className="absolute top-24 right-20 w-3 h-3 rounded-full bg-secondary-fixed/30 animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-tertiary-fixed/40 animate-pulse animation-delay-500"></div>

        <h2 className="font-headline text-4xl md:text-6xl font-extrabold text-white mb-8 relative z-10 max-w-3xl leading-tight">
          Be the Change Your Neighborhood Needs.
        </h2>
        <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl relative z-10">
          Join thousands of citizens making our city cleaner, safer, and more
          efficient. It takes less than 60 seconds to file a report.
        </p>
        <button 
          onClick={() => setCurrentPage('report')}
          className="bg-primary text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:bg-primary-container transition-all active:scale-95 relative z-10 hover:translate-y-[-2px] hover:shadow-primary/30 duration-300">
          Submit a Report Now
        </button>
      </div>
    </section>
  );
};

export default CTASection;
