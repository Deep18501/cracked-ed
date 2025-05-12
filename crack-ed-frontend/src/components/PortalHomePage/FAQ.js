// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import './FAQ.css'; // For custom styles

// const faqs = [
//   "Is job placement truly guaranteed after joining the AURUM program?",
//   "Do I need to pay the full ₹1.5 lakh fee upfront?",
//   "Will I earn back the course fee?",
//   "Do we receive any stipend during training?",
//   "What will my job involve after placement? Is it fieldwork-heavy?",
//   "Can I be placed in my home city or nearby location?",
//   "What does the career growth path look like?"
// ];

// const FAQ = () => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggle = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <section className="py-5 bg-white px-3">
//       <div className="container" style={{ maxWidth: '800px' }}>
//         <div className="text-white text-center py-3 rounded-top bg-orange fw-semibold">
//           Frequently Asked Questions
//         </div>
//         <div className="accordion border border-top-0 border-orange rounded-bottom">
//           {faqs.map((question, index) => (
//             <div
//               key={index}
//               className="faq-item d-flex justify-content-between align-items-center px-3 py-3 border-top"
//               onClick={() => toggle(index)}
//               role="button"
//             >
//               <span className="small text-dark">{`${index + 1}. ${question}`}</span>
//               {openIndex === index ? (
//                 <ChevronUp size={16} className="text-orange" />
//               ) : (
//                 <ChevronDown size={16} className="text-orange" />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FAQ;


import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FAQ.css'; // For custom styles

const faqs = [
  {
    question: "Is job placement truly guaranteed after joining the AURUM program?",
    answer: "While we strive to provide the best opportunities, job placement depends on various factors including your performance and market conditions."
  },
  {
    question: "Do I need to pay the full ₹2 lakh fee upfront?",
    answer: "No, we offer flexible payment plans to help you manage the course fee comfortably."
  },
  {
    question: "Will I earn back the course fee?",
    answer: "Many of our graduates have successfully earned back their course fees through their placements and career growth."
  },
  {
    question: "Do we receive any stipend during training?",
    answer: "Yes, eligible candidates receive a stipend during the training period."
  },
  {
    question: "What will my job involve after placement? Is it fieldwork-heavy?",
    answer: "Job roles vary, but most involve a mix of fieldwork and office tasks depending on the position."
  },
  {
    question: "Can I be placed in my home city or nearby location?",
    answer: "We try to accommodate location preferences as much as possible, but placements depend on available opportunities."
  },
  {
    question: "What does the career growth path look like?",
    answer: "Our program prepares you for progressive career growth with opportunities for advancement and skill development."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-container-section bg-white">
      <div className="faq-container-section-container">
        <div className="text-white text-center py-3 rounded-top bg-orange fw-semibold">
          Frequently Asked Questions
        </div>
        <div className="accordion faq-accordion rounded-bottom">
          {faqs.map(({ question, answer }, index) => (
            <div key={index} className="faq-item border order-top">
              <div
                className="faq-question d-flex justify-content-between gap-2 align-items-center"
                onClick={() => toggle(index)}
                role="button"
              >
                <span className="text-dark">{`${index + 1}. ${question}`}</span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="" />
                ) : (
                  <ChevronDown size={20} className="" />
                )}
              </div>
              {openIndex === index && (
                <div className="faq-answer text-muted">
                  {answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
