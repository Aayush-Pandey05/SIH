import React from "react";

const FeaturesSectionAL = ({ visibleElements, features }) => {
  return (
    <section
      className=" py-13 px-6 bg-gray-950 border-t border-gray-950"
      data-animate="features"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gray-800/50 p-8 border border-cyan-500/20 rounded-xl text-center flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all`}
              style={{
                transitionDelay: `${index * 150}ms`,
                opacity: visibleElements.has("features") ? 1 : 0,
                transform: visibleElements.has("features")
                  ? "translateY(0)"
                  : "translateY(10px)",
              }}
            >
              <div className="w-16 h-16 bg-cyan-900/50 text-cyan-400 rounded-full flex items-center justify-center mb-6 border border-cyan-400/30">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSectionAL;
