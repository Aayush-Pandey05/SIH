import React from "react";
import ThreeJSWaterScene from "./ThreeJSWaterScene";

const RightPannel = () => {
  return (
    <div className="hidden lg:flex w-1/2 relative">
      <div className="absolute inset-0">
        <ThreeJSWaterScene />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20 flex items-center justify-center">
        <div className="text-center px-12 space-y-6">
          <div className="space-y-4">
            <h3 className="text-4xl font-bold text-white leading-tight">
              Empowering Water Intelligence
            </h3>
            <p className="text-xl text-slate-200 leading-relaxed">
              Advanced analytics and AI-driven insights for sustainable water
              management across communities
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">50K+</div>
              <div className="text-sm text-slate-300">Liters Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">100+</div>
              <div className="text-sm text-slate-300">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">95%</div>
              <div className="text-sm text-slate-300">Efficiency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPannel;
