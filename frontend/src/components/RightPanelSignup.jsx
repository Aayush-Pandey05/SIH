import React from 'react'
import ThreeJSRainScene from './ThreeJSRainScene'

const RightPanelSignup = () => {
  return (
    <div className="hidden lg:flex w-1/2 relative">
        {/* Three.js Rain Animation */}
        <div className="absolute inset-0">
          <ThreeJSRainScene />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20 flex items-center justify-center">
          <div className="text-center px-12 space-y-6">
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-white leading-tight">
                Every Drop Counts
              </h3>
              <p className="text-xl text-slate-200 leading-relaxed">
                Join thousands of communities already making a difference
                through intelligent water harvesting
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">24/7</div>
                <div className="text-sm text-slate-300">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">AI</div>
                <div className="text-sm text-slate-300">Predictions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default RightPanelSignup
