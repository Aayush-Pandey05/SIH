import React from "react";
import { useTranslation } from "react-i18next";
import ThreeJSWaterScene from "./ThreeJSWaterScene";

const RightPannel = () => {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex w-1/2 relative">
      <div className="absolute inset-0">
        <ThreeJSWaterScene />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20 flex items-center justify-center">
        <div className="text-center px-12 space-y-6">
          <div className="space-y-4">
            <h3 className="text-4xl font-bold text-white leading-tight">
              {t('loginPanel.title')}
            </h3>
            <p className="text-xl text-slate-200 leading-relaxed">
              {t('loginPanel.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{t('loginPanel.stat1.value')}</div>
              <div className="text-sm text-slate-300">{t('loginPanel.stat1.label')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{t('loginPanel.stat2.value')}</div>
              <div className="text-sm text-slate-300">{t('loginPanel.stat2.label')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{t('loginPanel.stat3.value')}</div>
              <div className="text-sm text-slate-300">{t('loginPanel.stat3.label')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPannel;