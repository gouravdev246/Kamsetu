import { useEffect, useCallback } from 'react';
import { useState, useRef } from 'react';
import axios  from 'axios';
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

const ReportIssue = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [municipalities, setMunicipalities] = useState([]);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    pinCode: user?.pinCode || '',
    municipality: user?.municipality || '',
    address: user?.address || '',
    location: '',
    lat: null,
    lng: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Start the camera stream
  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Unable to access camera. Please try again.');
      }
    }
  }, []);

  // Stop the camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Capture a frame from the live video
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    stopCamera();
    setCurrentStep(2);
  };

  // Start camera on mount, stop on unmount
  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    return () => stopCamera();
  }, [capturedImage, startCamera, stopCamera]);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode using OpenStreetMap Nominatim (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await response.json();
          const readableAddress = data.display_name || `${latitude}, ${longitude}`;
          setFormData((prev) => ({ 
            ...prev, 
            location: readableAddress,
            lat: latitude,
            lng: longitude,
          }));
        } catch {
          // If reverse geocoding fails, fall back to raw coordinates
          setFormData((prev) => ({ 
            ...prev, 
            location: `${latitude}, ${longitude}`,
            lat: latitude,
            lng: longitude,
          }));
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please allow access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('An unknown error occurred.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!capturedImage) {
      setSubmissionError('Please capture/upload an image first.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const payload = {
        ...formData,
        capturedImage, // the base64 string
      };

      const response = await axios.post('/api/report/create', payload);
      
      if (response.status === 201) {
        setCurrentStep(3);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (formData.pinCode.length !== 6) {
      setMunicipalities([]);
      return;
    }

    const fetchMunicipalities = async () => {
      try {
        const { data } = await axios.get(`https://api.postalpincode.in/pincode/${formData.pinCode}`);
        if (data?.[0]?.Status === 'Success' && data[0].PostOffice) {
          setMunicipalities(data[0].PostOffice);
        } else {
          setMunicipalities([]);
        }
      } catch (err) {
        console.error('Failed to fetch municipalities:', err);
        setMunicipalities([]);
      }
    };

    fetchMunicipalities();
  }, [formData.pinCode]);

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
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Camera Error */}
                {cameraError && !capturedImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 text-center">
                    <span className="material-symbols-outlined text-error text-5xl mb-4">videocam_off</span>
                    <p className="text-white text-sm mb-4">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm active:scale-95 transition-transform"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Camera Overlay */}
                {!capturedImage && cameraActive && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border border-white/30 rounded-full border-dashed animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6 flex flex-col items-center gap-4">
                      <button
                        onClick={capturePhoto}
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

              {/* Hidden canvas for capturing snapshots */}
              <canvas ref={canvasRef} className="hidden" />

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
                    {municipalities.length > 0 ? (
                      <select
                        name="municipality"
                        id="municipality"
                        className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                        value={formData.municipality}
                        onChange={(e) => handleInputChange('municipality', e.target.value)}
                      >
                        <option value="">Select Municipality</option>
                        {municipalities
                          .filter((item, index, self) => 
                            item.Block && self.findIndex(i => i.Block === item.Block) === index
                          )
                          .map((item, index) => (
                            <option key={index} value={item.Block}>
                              {item.Block}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <div className="w-full px-5 py-4 bg-surface-dim/40 rounded-2xl text-on-surface-variant flex items-center justify-between">
                        <span className="text-sm font-semibold italic">
                          {formData.pinCode.length >= 3 ? 'Enter full 6-digit PIN' : 'Enter PIN first'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                  <div className="space-y-2">
                  <label className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-5 py-4 pr-14 bg-surface-container-low border-none rounded-2xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter location or use GPS"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={fetchCurrentLocation}
                      disabled={locationLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
                      title="Use current location"
                    >
                      <span className={`material-symbols-outlined text-primary text-xl ${locationLoading ? 'animate-spin' : ''}`}>
                        {locationLoading ? 'sync' : 'my_location'}
                      </span>
                    </button>
                  </div>
                  {locationError && (
                    <p className="text-xs text-error ml-1 mt-1">{locationError}</p>
                  )}
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
                  disabled={isSubmitting}
                  className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-extrabold text-lg rounded-full shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      Submitting...
                      <span className="material-symbols-outlined animate-spin">sync</span>
                    </>
                  ) : (
                    <>
                      Submit Report
                      <span className="material-symbols-outlined">send</span>
                    </>
                  )}
                </button>
                {submissionError && (
                  <p className="text-center text-error font-medium text-sm mt-2">{submissionError}</p>
                )}
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
