import React from 'react';
import './ProgramFeatures.css'; // For custom colors like #F26B1D and #FFF3F0
import aboutProgramImg from './about-program.jpg';
const features = [
  {
    title: 'Become Job Ready',
    description:
      'By the end of the program, you’ll be job-ready with the potential to earn up to ₹3.5 LPA, along with additional incentives. Selected students will receive a Letter of Intent.',
  },
  {
    title: 'Earn While You Learn',
    description:
      'Gain the best of both worlds with structured classroom learning and hands-on on-the-job training — earn ₹20,000 during classroom training and ₹15,000 during OJT.',
  },
  {
    title: 'Post Graduate Certificate',
    description:
      "Earn a recognized Post Graduate Certificate from IMT Ghaziabad's CDL upon successful completion of the program.",
  },
];
const JobCard = ({title,description}) => {
  return (
    <div className="assured-job-card">
      <div className="assured-card-header">
        {title}
      </div>
      <div className="assured-card-body about-text-secondary">
        {description}
      </div>
    </div>
  );
};

const ProgramFeatures = () => {
  return (
    <section className="program-section bg-white">
      <div className="">
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
