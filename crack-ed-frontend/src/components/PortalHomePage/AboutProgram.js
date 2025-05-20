import React from 'react';
import './AboutProgram.css'; 
import aboutProgramImg from './about-program.jpg';
import replaceForMobileImg from './replaceformobile.png';

const AboutProgram = () => {
  return (
    <section className="portal-about bg-white" id='about'>
      <div className="container d-flex flex-column flex-md-row align-items-center gap-4 gap-md-5">
        {/* Circular Images */}
        <div className="image-container flex-shrink-0 mb-3 mb-md-0">
          <img
            src={aboutProgramImg}
            alt="About the Program"
            className="rounded-circle img-fluid about-img desktop-img"
          />
          <img
            src={replaceForMobileImg}
            alt="About the Program Mobile"
            className="img-fluid about-img mobile-img1"
          />
        </div>

        {/* Text Content */}
        <div className="text-container text-start">
          <div className="title-text-purple">
            About the Program
          </div>
          <p className=" about-text-secondary mb-3 lh-relaxed">
            The BFSI sector is rapidly evolving, driven by digital banking, fintech, and a strong customer focus. AU Small Finance Bank, with an impressive annual growth over the past five years, is leading this transformation. To build on this momentum, AU Small Finance Bank has partnered with Crack-ED, the upskilling arm of the Cardekho Group, to launch the{' '}
            <span className="fw-semibold text-purple">AURUM Bankers Program</span>.  This program blends classroom learning with real-world experience, equipping you with the skills needed to succeed in today’s dynamic banking landscape—whether you're starting out or making a career shift into BFSI.
          </p>
          <p className="about-text-secondary">
            For any inquiries, please call: <a href="tel:+918864932909" className="text-purple fw-semibold">+91 8864932909</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutProgram;