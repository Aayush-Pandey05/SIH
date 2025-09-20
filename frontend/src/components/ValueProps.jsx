import React from "react";
import { useTranslation } from 'react-i18next';

const ValuePropsSection = ({ visibleElements }) => {
  const { t } = useTranslation();

  const valueProps = [
    {
      title: t('valueProps.item1.title'),
      desc: t('valueProps.item1.desc'),
    },
    {
      title: t('valueProps.item2.title'),
      desc: t('valueProps.item2.desc'),
    },
    {
      title: t('valueProps.item3.title'),
      desc: t('valueProps.item3.desc'),
    },
  ];

  return (
    <section className="py-12 px-6 bg-gray-950" data-animate="value-props">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {valueProps.map((item, index) => (
            <div
              key={index}
              className={`group space-y-4 transition-all duration-800 ease-out hover:scale-105 bg-gray-800/30 hover:bg-gray-800/80 hover:shadow-lg p-6 rounded-2xl ${
                visibleElements.has("value-props")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <h3 className="text-2xl font-bold group-hover:text-black-400 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropsSection;