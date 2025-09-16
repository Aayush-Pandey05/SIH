import React from 'react';
import { Mail, Phone, BookOpen } from "lucide-react";

const ContactCard = ({ icon, title, description, linkText, linkHref }) => (
    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 flex flex-col items-center text-center gap-4 hover:border-cyan-400 transition-colors">
        <div className="bg-slate-900/50 p-4 rounded-full border border-slate-700">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mt-2">{title}</h3>
        <p className="text-slate-400 text-sm flex-grow">{description}</p>
        <a href={linkHref} className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors mt-4">
            {linkText}
        </a>
    </div>
);

const ContactSection = () => (
  <div className="max-w-5xl mx-auto mt-20 contact-section ">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-white">
        Still Need Help?
      </h2>
      <p className="text-slate-400 mt-2">
        If you can't find the answer you're looking for, please don't hesitate to reach out.
      </p>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      <ContactCard
        icon={<Mail size={32} className="text-cyan-400" />}
        title="Email Us"
        description="Send us an email and we'll get back to you shortly."
        linkText="support@jalsetu.com"
        linkHref="mailto:support@jalsetu.com"
      />
      <ContactCard
        icon={<Phone size={32} className="text-cyan-400" />}
        title="Call Us"
        description="Talk to our support team for immediate assistance."
        linkText="+91 123 456 7890"
        linkHref="tel:+911234567890"
      />
      <ContactCard
        icon={<BookOpen size={32} className="text-cyan-400" />}
        title="Knowledge Base"
        description="Explore our articles and guides for self-service."
        linkText="Browse Articles"
        linkHref="#"
      />
    </div>
  </div>
);

export default ContactSection;
