import React from 'react';
import { BarChart4, Megaphone, TrendingUp } from 'lucide-react';
import './CurriculumSection.css'; // for custom colors

const curriculum = [
  {
    title: 'Banking & Financial Fundamentals',
    description:
      'Build a strong foundation in core banking operations and financial concepts, helping you understand how the banking industry works.',
    icon: <BarChart4 className="curriculum-icon" />,
  },
  {
    title: 'Communication & Sales Skills',
    description:
      'Develop effective communication techniques, learn how to approach potential customers, generate leads, and handle objections with confidence and persuasion.',
    icon: <Megaphone className="curriculum-icon" />,
  },
  {
    title: 'Growth-Oriented Mindset',
    description:
      'Adopt a growth-driven mindset focused on continuous learning, goal-setting, and professional development to succeed in a fast-paced banking environment.',
    icon: <TrendingUp className="curriculum-icon" />,
  },
];

const CurriculumSection = () => {
  return (
    <section className="py-5 bg-white text-center">
      <h2 className="h4 fw-semibold text-dark mb-4">Become An Expert In Banking</h2>

      <div className="container">
        <div className="row g-4">
          {curriculum.map((item, index) => (
            <div key={index} className="col-md-4">
              <div className="card border-light shadow-sm h-100">
                {/* Icon Section */}
                <div className="bg-light-orange py-3 d-flex justify-content-center">
                <div className="rounded-circle p-3 shadow icon-wrapper"style={{ backgroundColor: '#F15A24' }}
>
{item.icon}
</div>
                </div>

                {/* Title */}
                <div className="bg-orange text-white fw-semibold text-sm py-2 px-3">
                  {item.title}
                </div>

                {/* Description */}
                <div className="bg-light-orange text-secondary small px-3 py-3 text-start">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
