import React from 'react';
import './ProgramFeatures.css'; // For custom colors like #F26B1D and #FFF3F0
import aboutProgramImg from './about-program.jpg';
const features = [
  {
    title: '100% Assured Job',
    description:
      'Receive an offer letter before the program starts, with a competitive salary of Rs 3.5 LPA, plus incentives.',
  },
  {
    title: 'Earn While You Learn',
    description:
      'Get hands-on experience through a paid 3-month OJT, earning a stipend of Rs 10,000/month.',
  },
  {
    title: 'Post Graduate Certificate',
    description:
      "Earn a recognized Post Graduate Certificate from IMT Ghaziabad’s CDL upon successful completion of the program.",
  },
];
const JobCard = ({title,description}) => {
  return (
    <div className="assured-job-card">
      <div className="assured-card-header">
        {title}
      </div>
      <div className="assured-card-body">
        {description}
      </div>
    </div>
  );
};

const ProgramFeatures = () => {
  return (
    <section className="program-section bg-white">
      <div className="container">
        <h2 className="portal-section-title text-start">Program Features</h2>
        <div className="portal-section-cards">
          {features.map((feature, index) => (
            <JobCard title={feature.title} description={feature.description} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramFeatures;
