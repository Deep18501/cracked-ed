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
import dropDownIcon from './dropdown_icon.png'
import dropUpIcon from './dropup_icon.png'
const faqs = [
  {
    question: "Is job placement truly guaranteed after joining the AURUM program?",
    answer: "Yes! Upon successful completion of the program—including classroom training, on-the-job training (OJT), regular attendance, and internal evaluations—you are guaranteed a job placement with AU Small Finance Bank."
  },
  {
    question: "Do I need to pay the full ₹2 lakh fee upfront?",
    answer: "No, you don’t. We offer flexible EMI and installment options for up to 18 months, making it easier for you to invest in your future."
  },
  {
    question: "Will I earn back the course fee?",
    answer: "Absolutely. If you continue working with AU Bank for 2 years, you'll receive a Retention Bonus of ₹60,000 after 12 months and ₹90,000 after 24 months. Combined with the stipend you earn during your course period and OJT this would make the course cost neutral."
  },
  {
    question: "Do we receive any stipend during training?",
    answer: "Yes. During your 3-month On-the-Job Training (OJT), you’ll receive a monthly stipend of ₹20,000 during your classroom training and ₹20,000 during your OJT, helping cover personal expenses while gaining hands-on experience."
  },
  {
    question: "What will my job involve after placement? Is it fieldwork-heavy?",
    answer: "As a Bank Officer, you’ll open CASA accounts, talk to walk-in customers, and follow up on leads, with a mix of field and branch work depending on your location and targets."
  },
  {
    question: "Can I be placed in my home city or nearby location?",
    answer: "Yes, here’s how it works: You’ll start with 3 months of classroom training at IMT Ghaziabad, followed by 3 months of on-the-job training at your home branch or a nearby AU Bank branch. After training, you’ll be placed in the same location."
  },
  {
    question: "What does the career growth path look like?",
    answer: "You’ll begin as a Bank Officer, with a clear path to grow into roles like Senior Sales Officer, Relationship Manager, and eventually Branch Manager. Top performers can get promoted faster and gain access to leadership programs and skill-building opportunities offered by the bank."
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
                  <img className='faq-dropdown-icon' src={dropUpIcon} ></img>
                ) : (
                  <img className='faq-dropdown-icon' src={dropDownIcon} ></img>
                )}
              </div>
              {openIndex === index && (
                <div className="faq-answer  text-muted">
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
