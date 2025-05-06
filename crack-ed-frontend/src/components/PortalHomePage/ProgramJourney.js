import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase } from 'lucide-react';
import './ProgramJourney.css'; // Create this for custom styles
import utthaanImg from './path-to-utthaan.png';
import aarohanImg from './path-to-aarohan.png';
import shikharImg from './path-to-shikhar.png';

const ProgramJourney = () => {
  const journeyData = [
    {
      title: 'Utthaan',
      points: [
        'Banking & finance essentials',
        'Excel, PowerPoint & number skills',
        'Communication & workplace readiness',
      ],
      img: utthaanImg,
    },
    {
      title: 'Aarohan',
      points: [
        'CASA Products & Use-Cases',
        'Cross-Selling Related Offerings',
        'Understanding Customer Needs',
      ],
      img: aarohanImg,
    },
    {
      title: 'Shikhar',
      points: [
        'Smart lead generation tactics',
        'Confident pitching & handling objections',
        'Effective cross-selling & upselling',
      ],
      img: shikharImg,
    },
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setActiveIndex(null); // reset dropdown on desktop
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-5 px-3">
      <div className="container">

        {/* Classroom Training Header */}
        <div className="journey-header mb-4 text-center text-white py-3 rounded fw-semibold">
          3 Months of Classroom Training
        </div>

        {/* Cards or Dropdowns */}
        {isMobile ? (
          <div className="accordion" id="programJourneyAccordion">
            {journeyData.map((item, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button
                    className={`accordion-button ${activeIndex === index ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => toggleDropdown(index)}
                    aria-expanded={activeIndex === index}
                    aria-controls={`collapse${index}`}
                  >
                    {item.title}
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className={`accordion-collapse collapse ${activeIndex === index ? 'show' : ''}`}
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#programJourneyAccordion"
                >
                  <div className="accordion-body">
                    <img src={item.img} alt={item.title} className="img-fluid mb-3" />
                    <ul className="small ps-3">
                      {item.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {journeyData.map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 border border-light shadow-sm">
                  <img src={item.img} alt={item.title} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title text-purple fw-semibold">{item.title}</h5>
                    <ul className="card-text small ps-3">
                      {item.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* On-the-Job Training Header */}
        <div className="journey-header my-5 text-center text-white py-3 rounded fw-semibold">
          3 Months of Paid On-The-Job Training
        </div>

        {/* Paragraph */}
        <div className="bg-light-pink p-4 rounded text-secondary small">
          Transition smoothly into the professional world with OJT, where you’ll work on live projects, interact with customers, and get a firsthand exploration of the roles and responsibilities that await you post-graduation. Participants will receive a stipend of Rs 10,000, further supporting their transition into the professional environment while allowing them to apply their learning to real-world projects.
        </div>

        {/* Outcomes */}
        <div className="row g-4 mt-4">
          <div className="col-md-6">
            <div className="bg-light-pink p-3 rounded d-flex gap-3 align-items-start">
              <Briefcase className="text-purple mt-1" />
              <p className="small text-secondary mb-0">
                Upon successful completion of the initial 3-month period, the candidate will be absorbed into AU Small Finance Bank as a Bank Officer.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="bg-light-pink p-3 rounded d-flex gap-3 align-items-start">
              <GraduationCap className="text-purple mt-1" />
              <p className="small text-secondary mb-0">
                After successfully completing the program, the candidate receives a Post Graduate Certificate from IMT Ghaziabad (CDL).
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProgramJourney;
