import React, { useState, useEffect } from 'react';
import { X, Box, Layers, Sparkles, ArrowRight, PackageOpen, Ruler } from 'lucide-react';
import { Translation } from '@/i18n';

interface Props {
  t: Translation;
}

const STORAGE_KEY = 'packgenius_welcome_shown';

export const WelcomeGuide: React.FC<Props> = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem(STORAGE_KEY);
    if (!shown) setIsOpen(true);
  }, []);

  const handleClose = () => {
    if (dontShowAgain) localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const steps = [
    { icon: Box, color: 'indigo', title: t.guideStep1Title, desc: t.guideStep1Desc },
    { icon: Layers, color: 'emerald', title: t.guideStep2Title, desc: t.guideStep2Desc },
    { icon: Ruler, color: 'amber', title: t.guideStep3Title, desc: t.guideStep3Desc },
    { icon: Sparkles, color: 'purple', title: t.guideStep4Title, desc: t.guideStep4Desc },
    { icon: PackageOpen, color: 'blue', title: t.guideStep5Title, desc: t.guideStep5Desc },
  ];

  if (!isOpen) return null;

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400',
    blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <button onClick={handleClose} className="absolute top-3 right-3 p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className={`w-20 h-20 rounded-2xl ${colorMap[currentStep.color]} flex items-center justify-center shadow-lg`}>
            <Icon className="w-10 h-10" />
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-center gap-1.5 mb-4">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-200 dark:bg-slate-600'}`} />
            ))}
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">{currentStep.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed mb-6">{currentStep.desc}</p>
          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                {t.guidePrev}
              </button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                {t.guideNext}<ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleClose} className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                {t.guideStart}
              </button>
            )}
          </div>
          <label className="flex items-center justify-center gap-2 mt-4 cursor-pointer text-sm text-slate-400 dark:text-slate-500">
            <input type="checkbox" checked={dontShowAgain} onChange={e => setDontShowAgain(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600" />
            {t.guideDontShow}
          </label>
        </div>
      </div>
    </div>
  );
};
