import React, { useState, useEffect } from 'react';
import './HeroSection.css'; // Custom styles for overlay, colors, sizes
import RegistrationForm from './Reg';

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="hero-section d-flex align-items-center position-relative text-white">
      {/* Overlay */}
      <div className="overlay position-absolute top-0 start-0 w-100 h-100"></div>

      <div className="container position-relative z-2">
        <div className="row align-items-center">
          {/* Left Side Content */}
          <div className="col-12 col-md-10 col-lg-7 mb-4">
            {!isMobile && (
              <div className="bg-purple p-4 rounded mb-4 d-inline-block">
                <h1 className="h3 fw-bold">AURUM Bankers Program</h1>
              </div>
            )}

            {!isMobile && (
              <div className="top-info-cards d-flex flex-wrap gap-2">
                <div className="badge-box bg-orange d-flex align-items-center gap-2 px-3 py-2 rounded text-white">
                  <span className="small fw-semibold">100% assured job</span>
                </div>
                <div className="badge-box bg-orange d-flex align-items-center gap-2 px-3 py-2 rounded text-white">
                  <span className="small fw-semibold">PG Certification</span>
                </div>
                <div className="badge-box bg-yellow d-flex align-items-center gap-2 px-3 py-2 rounded text-white">
                  <span className="small fw-semibold">Earn while you learn</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Registration Box */}
          <div className={isMobile ? "col-12" : "col-lg-5"}>
            <div className={isMobile ? "bg-white text-dark p-4 rounded shadow-sm w-100 form-box form-box-mobile" : "bg-white text-dark p-4 rounded shadow-sm w-100 form-box"}>
              <h2 className="h6 fw-semibold mb-3">
                Start your registration process today!
              </h2>
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bottom-bar bg-purple text-white text-center py-2 mt-auto w-100 position-absolute bottom-0">
        <div className="container">
          <div className="row row-cols-4">
            <div>
              <div className="fw-bold fs-5">2nd May</div>
              <div className="small">Start Date</div>
            </div>
            <div>
              <div className="fw-bold fs-5">6 Months</div>
              <div className="small">Duration</div>
            </div>
            <div>
              <div className="fw-bold fs-5">Graduates</div>
              <div className="small">Eligibility</div>
            </div>
            <div>
              <div className="fw-bold fs-5">Rs 2,00,000</div>
              <div className="small">Fees</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
