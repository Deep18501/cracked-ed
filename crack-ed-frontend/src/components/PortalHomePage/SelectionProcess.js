import React from 'react';
import {
  Laptop,
  MonitorSmartphone,
  Users,
  Handshake,
  Briefcase
} from 'lucide-react';
import './SelectionProcess.css'; // for .icon-wrapper and .text-purple

const steps = [
  {
    icon: <Laptop className="icon-size text-purple" />,
    text: "Submit your online application to get started",
  },
  {
    icon: <MonitorSmartphone className="icon-size text-purple" />,
    text: "Attend the Pre-Placement Talk to learn more about the program",
  },
  {
    icon: <Users className="icon-size text-purple" />,
    text: "Participate in the first round of personal interviews",
  },
  {
    icon: <Handshake className="icon-size text-purple" />,
    text: "Attend the second round of interviews for further evaluation",
  },
  {
    icon: <Briefcase className="icon-size text-purple" />,
    text: "Receive your offer letter and take the next step in your career journey",
  },
];

const SelectionProcess = () => {
  return (
    <section className="selection-process-section bg-white " id='eligibility'>
      <div className="container">
        <h2 className="portal-section-title">Selection Process</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 g-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="d-flex flex-row flex-md-column align-items-center text-center text-md-start gap-3 px-2"
            >
              <div className="icon-wrapper d-flex justify-content-center align-items-center rounded-circle">
                {step.icon}
              </div>
              <p className="small text-secondary mb-0 flex-grow-1">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectionProcess;
