
import React from "react";

const HowItWorksSection = ({ visibleElements, stepVisuals }) => {
  const steps = [
    {
      step: "01",
      title: "Map & Measure",
      description:
        "Use our interactive GIS interface to draw your rooftop area on a high-resolution satellite map. Our system instantly calculates your roof's size and potential rainwater harvesting capacity.",
      includes: [
        "Satellite Imagery Integration",
        "Rooftop Polygon Drawing Tool",
        "Instant Runoff Calculation",
      ],
    },
    {
      step: "02",
      title: "Analyze & Plan",
      description:
        "Receive AI-powered recommendations tailored to your location's rainfall patterns, soil type, and groundwater levels. Get a detailed ROI analysis to understand your savings.",
      includes: [
        "AI Recommendation Engine",
        "Automated ROI Reports",
        "Recharge Structure Sizing",
      ],
    },
    {
      step: "03",
      title: "Connect & Act",
      description:
        "Turn your personalized plan into reality. JalSetu bridges the gap between planning and implementation by connecting you with verified local professionals and guiding you through the process of accessing government support.",
      includes: [
        "Verified Vendor Marketplace",
        "Simplified Subsidy Applications",
        "Step-by-Step Implementation Guide",
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
            Simple Steps to Water Independence
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
                    Includes
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
                  alt={`${item.title} Visual`}
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
