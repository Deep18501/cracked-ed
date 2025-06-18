import React, { useState, useEffect, useContext } from 'react';
import './HeroSection.css';
import RegistrationForm from './Reg';
import ServiceIcon1 from '../../assets/service_icon1.png';
import ServiceIcon2 from '../../assets/service_icon2.png';
import ServiceIcon3 from '../../assets/service_icon3.png';
import { AuthContext } from '../../context/AuthContext';

const ServiceTag = ({ text = "100% assured job", icon }) => {
  return (
    <div className="job-tag-container">
      <div className="job-tag-icon">
        <img src={icon} alt="Service Icon" className="service-icon" />
      </div>
      <span className="job-tag-text">{text}</span>
    </div>
  );
};

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="overlay position-absolute top-0 start-0 w-100 h-100"></div>

        <div className="hero-section-container position-relative z-2">
          <div className="aurum-program-row">
            {/* Left Side Content */}
            {/* Left Side Content - Show only when user is authenticated (i.e., logged in) */}

          {/**
 * LEFT CONTAINER LOGIC
 * Show when:
 *  - Desktop & logged in
 *  - Desktop & not logged in
 *  - Mobile & logged in
 */}
{(!isMobile || (isMobile && isAuthenticated)) && (
  <div className="aurum-program-left-holder col-12 col-md-10 col-lg-7 mb-4">
    <div className='d-flex flex-column'>
      <div className="aurum-program-hero-title d-inline-block">
        AURUM Bankers
      </div>
      <div className="aurum-program-hero-title mb-5 d-inline-block">
        Program
      </div>
    </div>
    <div className="top-info-cards d-flex justify-content-start flex-wrap">
      <ServiceTag text='Become job ready' icon={ServiceIcon1} />
      <ServiceTag text='PG Certification' icon={ServiceIcon2} />
      <ServiceTag text='Earn while you learn' icon={ServiceIcon3} />
    </div>
  </div>
)}

{/**
 * RIGHT CONTAINER LOGIC (Form)
 * Show only if NOT logged in
 * And only show on:
 *  - Desktop (with left)
 *  - Mobile (without left)
 */}
{!isAuthenticated && (
  <div className={isMobile ? "col-12" : "aurum-program-right-holder"}>
    <div className={isMobile ? "bg-white text-dark p-4 rounded shadow-sm w-100 form-box form-box-mobile" : "bg-white text-dark p-4 rounded shadow-sm w-100 form-box"}>
      <div className="heading-registration-home-page">
        Talk to our counsellors to know more!
      </div>
      <RegistrationForm />
    </div>
  </div>
)}

          </div>
        </div>
      </section>

      {/* Bottom Info Bar */}
      <section className="bottom-bar-section">
        <div className="bottom-bar bg-purple text-white text-center mt-auto w-100 bottom-0">
          <div className="container">
            {!isMobile ? (
              <div className="d-flex justify-content-around align-items-center px-3">
                <div>
                  <div className="title">1st July</div>
                  <div className="small">Start Date</div>
                </div>
                <div className='vertical-line'></div>
                <div>
                  <div className="title">3.5 Months</div>
                  <div className="small">Duration</div>
                </div>
                <div className='vertical-line'></div>
                <div>
                  <div className="title">Graduates</div>
                  <div className="small">Eligibility</div>
                </div>
                <div className='vertical-line'></div>
                <div>
                  <div className="title">Rs 2,00,000<span style={{fontSize:'12px'}}>+GST</span></div>
                  <div className="small">Fees</div>
                </div>
              </div>
            ) : (
              <div className="program-info bg-purple">
                <div className="info-box">
                  <h2>1st July</h2>
                  <p>Start Date</p>
                </div>
                <div className="info-box">
                  <h2>3.5 Months</h2>
                  <p>Duration</p>
                </div>
                <div className="info-box">
                  <h2>Graduates</h2>
                  <p>Eligibility</p>
                </div>
                <div className="info-box">
                  <h2>Rs 2,00,000<span style={{fontSize:'10px'}}>+GST</span></h2>
                  <p>Fees</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
