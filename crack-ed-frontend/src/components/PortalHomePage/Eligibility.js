import React from 'react';
import { CheckCircle } from 'lucide-react';
import './Eligibility.css'; // For custom colors
import reqICon from './requirement_tick.png'
const Eligibility = () => {
  return (
    <section className="py-5 bg-light px-3">
      <div className="container d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
        <div>

        <div className="heading-left-elegibility fw-semibold text-dark-blue mb-3 mb-md-0">
          Is this post graduate
        </div>        
        <div className="heading-left-elegibility fw-semibold text-dark-blue mb-3 mb-md-0">
          program right for you?
        </div>
        </div>
        <div>
          <h6 className="heading-right-elegibility mb-4">Requirements</h6>
          <ul className="list-unstyled small text-secondary">
            <li className="d-flex align-items-center gap-2 ">
              <img className='elegibility-requirement-icon' src={reqICon} ></img>
              <span className='text-start about-text-secondary'>
                Graduate in any discipline with a minimum aggregate score of 50% from a recognized university.
              </span>
            </li>
            <div className='breakline-elegibility'/>
            <li className="d-flex align-items-center gap-2">
              <img className='elegibility-requirement-icon' src={reqICon} ></img>
              <span className='text-start about-text-secondary'>
                Open to fresh graduates and professionals with up to 3 years of experience.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Eligibility;
