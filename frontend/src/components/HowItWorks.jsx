import React from "react";
import { useTranslation } from "react-i18next";

const HowItWorksSection = ({ visibleElements, stepVisuals }) => {
  const { t } = useTranslation();

  const steps = [
    {
      step: "01",
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      includes: [
        t('howItWorks.step1.includes.item1'),
        t('howItWorks.step1.includes.item2'),
        t('howItWorks.step1.includes.item3'),
      ],
    },
    {
      step: "02",
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      includes: [
        t('howItWorks.step2.includes.item1'),
        t('howItWorks.step2.includes.item2'),
        t('howItWorks.step2.includes.item3'),
      ],
    },
    {
      step: "03",
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      includes: [
        t('howItWorks.step3.includes.item1'),
        t('howItWorks.step3.includes.item2'),
        t('howItWorks.step3.includes.item3'),
      ],
    },
  ];

  return (
    <section className="py-20 px-6 bg-gray-900" data-animate="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            visibleElements.has("how-it-works")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('howItWorks.mainTitle')}
          </h2>
        </div>
        <div className="space-y-16">
          {steps.map((item, index) => (
            <div
              key={index}
              data-animate={`step-${index}`}
              className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ease-out ${
                index % 2 === 1 ? "md:grid-flow-col-dense" : ""
              } ${
                visibleElements.has(`step-${index}`)
                  ? "opacity-100 translate-x-0"
                  : `opacity-0 ${
                      index % 2 === 0 ? "translate-x-10" : "-translate-x-10"
                    }`
              }`}
            >
              <div
                className={`space-y-6 ${
                  index % 2 === 1 ? "md:col-start-2" : ""
                } group`}
              >
                <div className="text-6xl font-bold text-gray-700 group-hover:text-gray-600 group-hover:scale-110 transition-all duration-500">
                  {item.step}
                </div>
                <h3 className="text-3xl font-bold group-hover:text-cyan-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-lg text-gray-400 leading-relaxed">
                  {item.description}
                </p>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {t('howItWorks.includesTitle')}
                  </div>
                  {item.includes.map((include, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 transition-all duration-300 hover:translate-x-2"
                    >
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:bg-cyan-300 transition-colors duration-300"></div>
                      <span className="font-medium text-gray-300">
                        {include}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`group bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/20 rounded-3xl h-95 flex items-center justify-center relative overflow-hidden hover:shadow-2xl hover:shadow-cyan-400/10 hover:scale-105 transition-all duration-500 cursor-pointer ${
                  index % 2 === 1 ? "md:col-start-1" : ""
                }`}
              >
                <img
                  src={stepVisuals[index]}
                  alt={t('howItWorks.imageAlt', { title: item.title })}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;