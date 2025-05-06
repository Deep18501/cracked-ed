import React from 'react';

import Header from '../components/PortalHomePage/header.js';
import HeroSection from '../components/PortalHomePage/HeroSection.js';
import AboutProgram from '../components/PortalHomePage/AboutProgram.js';
import ProgramFeatures from '../components/PortalHomePage/ProgramFeatures.js';
import ProgramJourney from '../components/PortalHomePage/ProgramJourney.js';
import Curriculum from '../components/PortalHomePage/Curriculum.js';
import Eligibility from '../components/PortalHomePage/Eligibility.js';
import SelectionProcess from '../components/PortalHomePage/SelectionProcess.js';
import FAQ from '../components/PortalHomePage/FAQ.js';
import Footer from '../components/PortalHomePage/Footer.js';
import 'bootstrap/dist/css/bootstrap.min.css';


const PortalHomePage = () => {
    return (
        <>
        <Header />
      <HeroSection />
      <AboutProgram />
      <ProgramFeatures />
      <ProgramJourney />
      <Curriculum />
      <Eligibility />
      <SelectionProcess />
      <FAQ />
      <Footer />
        </>
    );
}

export default PortalHomePage;