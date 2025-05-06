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

const ProgramFeatures = () => {
  return (
    <section className="py-5 px-3 bg-white">
      <div className="container">
        <h2 className="h4 fw-semibold text-dark mb-4">Program Features</h2>
        <div className="row">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4 mb-4 custom-feature-col">
              <div className="card feature-card h-100">
                <div className="card-header feature-header text-white fw-semibold">
                  {feature.title}
                </div>
                <div className="card-body bg-light text-dark small">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramFeatures;
