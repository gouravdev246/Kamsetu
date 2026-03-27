import { useState, useRef } from 'react';

const ProgressIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Visual Proof', sub: 'Capture evidence' },
    { number: 2, label: 'Details', sub: 'Location & Contact' },
    { number: 3, label: 'Review', sub: 'Final Submission' },
  ];

  return (
    <div className="mb-12 flex items-center gap-4">
      {steps.map((step, idx) => (
        <div key={step.number} className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-3" style={{ opacity: step.number <= currentStep ? 1 : step.number === currentStep + 1 ? 0.5 : 0.3 }}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step.number <= currentStep
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'bg-surface-container-highest text-on-surface'
              }`}
            >
              {step.number < currentStep ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                step.number
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-sm text-on-surface">{step.label}</span>
              <span className="text-xs text-on-surface-variant font-medium hidden sm:block">{step.sub}</span>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div className="w-12 h-px bg-outline-variant hidden md:block"></div>
          )}
        </div>
      ))}
    </div>
  );
};

const SuccessModal = ({ reportId, onClose, onTrack }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-fade-in">
      <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-surface-container-lowest p-10 rounded-[2.5rem] max-w-md w-full text-center shadow-[0_32px_64px_-16px_rgba(0,93,172,0.2)] animate-fade-in-up">
        <div className="w-24 h-24 bg-secondary-fixed rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <span className="material-symbols-outlined text-on-secondary-fixed text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h3 className="font-headline text-3xl font-extrabold text-on-surface mb-3 tracking-tight">Report Received</h3>
        <p className="text-on-surface-variant leading-relaxed mb-8">
          Thank you for being a Transparent Guardian. Your report ID <span className="font-mono font-bold text-primary">#{reportId}</span> is now being routed to the appropriate department.
        </p>
        <button
          onClick={onTrack}
          className="w-full py-4 bg-on-background text-white rounded-full font-headline font-bold text-sm tracking-widest uppercase hover:opacity-90 active:scale-95 transition-all"
        >
          Track Progress
        </button>
        <button
          onClick={onClose}
          className="mt-4 text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

const ReportIssue = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pinCode: '',
    municipality: '',
    address: '',
  });
  const fileInputRef = useRef(null);

  const handleImageCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        setCurrentStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Simulate municipality auto-fetch on PIN code change
    if (field === 'pinCode' && value.length >= 5) {
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, municipality: 'Northwood District' }));
      }, 1200);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
    setShowSuccess(true);
  };

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-4">
            Report an Issue
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Submit real-time evidence of civic concerns. Your report helps our community prioritize resolution and transparency.
          </p>
        </header>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Camera / Photo Section */}
          <section className="space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_24px_48px_-12px_rgba(7,30,39,0.06)] overflow-hidden">
              <h2 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">photo_camera</span>
                Photo Upload
              </h2>

              <div className="relative aspect-[3/4] rounded-2xl bg-on-background group overflow-hidden shadow-inner">
                {capturedImage ? (
                  <img
                    className="w-full h-full object-cover"
                    alt="Captured issue"
                    src={capturedImage}
                  />
                ) : (
                  <img
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    alt="Camera viewfinder showing a cracked city sidewalk"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3s0scZthlsB8SugEZG0590vDs1bMwYT_W81ZQ9pzqeED3n3WLUnuFqzP_NUdsAAgqIrzdP95NTnJRqcNZfZnKZ-RmkSK7wv4VG5fXSn0D08WoroBI_hhKRBPWzSMt4D-wwODlqBpI2KHoPArvAfRM8PwdntCy1s6hFjMDgNUKeOH0j90kX2rIwut8p9ANkZzFS9pg1YODk118eJS3zSx_DS8mwYo1gONfu6EK-6mOHcmwLto9F-JYWnHnFB1XvXx6aoq0VR8pdGw"
                  />
                )}

                {/* Camera Overlay */}
                {!capturedImage && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border border-white/30 rounded-full border-dashed animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6 flex flex-col items-center gap-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-full border-4 border-white/40 p-1 active:scale-95 transition-transform"
                      >
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-2xl">
                          <span className="material-symbols-outlined text-primary text-4xl">camera</span>
                        </div>
                      </button>
                      <p className="text-white text-xs font-label uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                        Tap to Capture Photo
                      </p>
                    </div>
                  </>
                )}
                {capturedImage && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        setCurrentStep(1);
                      }}
                      className="bg-white/90 backdrop-blur-md text-on-surface px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform shadow-lg"
                    >
                      <span className="material-symbols-outlined text-sm">refresh</span>
                      Retake Photo
                    </button>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageCapture}
              />

              <div className="mt-6 flex items-start gap-3 p-4 bg-primary-fixed text-on-primary-fixed-variant rounded-2xl">
                <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                <p className="text-sm font-medium leading-snug">
                  Evidence must be captured live to ensure authenticity and timestamp accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* Right: Form Section */}
          <section className="space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_24px_48px_-12px_rgba(7,30,39,0.06)]">
              <h2 className="font-headline text-xl font-bold mb-8">Incident Details</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Full Name
                  </label>
                  <input
                    className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Enter your name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">+91</span>
                    <input
                      className="w-full pl-14 pr-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="00000-00000"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                {/* PIN Code & Municipality */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      PIN Code
                    </label>
                    <input
                      className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="123456"
                      type="text"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Municipality
                    </label>
                    {formData.municipality ? (
                      <div className="w-full px-5 py-4 bg-secondary-fixed/10 rounded-2xl text-on-surface flex items-center justify-between">
                        <span className="text-sm font-semibold">{formData.municipality}</span>
                        <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                    ) : (
                      <div className="w-full px-5 py-4 bg-surface-dim/40 rounded-2xl text-on-surface-variant flex items-center justify-between">
                        <span className="text-sm font-semibold italic">
                          {formData.pinCode.length >= 3 ? 'Auto-fetching...' : 'Enter PIN first'}
                        </span>
                        {formData.pinCode.length >= 3 && (
                          <span className="material-symbols-outlined text-primary text-sm animate-spin">sync</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Precise Address
                  </label>
                  <textarea
                    className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Street name, landmark, house number..."
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-extrabold text-lg rounded-full shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                >
                  Submit Report
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>

            {/* Privacy Note */}
            <div className="p-6 bg-surface-container-low rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed flex-shrink-0">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm text-on-surface">Data Privacy Guaranteed</p>
                <p className="text-xs text-on-surface-variant">
                  Your personal details are encrypted and only shared with verified municipal officials.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          reportId="CC-8821"
          onClose={() => setShowSuccess(false)}
          onTrack={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default ReportIssue;
