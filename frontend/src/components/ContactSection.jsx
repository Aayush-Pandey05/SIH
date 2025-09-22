import React from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, BookOpen } from "lucide-react";

const ContactCard = ({ icon, title, description, linkText, linkHref }) => (
    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 flex flex-col items-center text-center gap-4 hover:border-cyan-400 transition-colors">
        <div className="bg-slate-900/50 p-4 rounded-full border border-slate-700">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mt-2">{title}</h3>
        <p className="text-slate-400 text-sm flex-grow">{description}</p>
        <a href={linkHref} target='_blank' rel="noopener noreferrer" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors mt-4">
            {linkText}
        </a>
    </div>
);

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto mt-20 contact-section ">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white">{t('contactSection.title')}</h2>
        <p className="text-slate-400 mt-2">
          {t('contactSection.subtitle')}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <ContactCard
          icon={<Mail size={32} className="text-cyan-400" />}
          title={t('contactSection.email.title')}
          description={t('contactSection.email.description')}
          linkText={t('contactSection.email.linkText')}
          linkHref="mailto:support@jalsetu.com"
        />
        <ContactCard
          icon={<Phone size={32} className="text-cyan-400" />}
          title={t('contactSection.phone.title')}
          description={t('contactSection.phone.description')}
          linkText={t('contactSection.phone.linkText')}
          linkHref="tel:+911234567890"
        />
        <ContactCard
          icon={<BookOpen size={32} className="text-cyan-400" />}
          title={t('contactSection.knowledgeBase.title')}
          description={t('contactSection.knowledgeBase.description')}
          linkText={t('contactSection.knowledgeBase.linkText')}
          linkHref="https://nwm.gov.in/catchtherain"
        />
      </div>
    </div>
  );
};

export default ContactSection;