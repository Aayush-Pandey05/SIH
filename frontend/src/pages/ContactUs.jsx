import React, { useState } from "react";
import { Send, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import toast from "react-hot-toast";
import { useFormStore } from "../store/useFormStore";

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error(t('contact.validation.fullNameRequired'));
    if (!formData.email.trim()) return toast.error(t('contact.validation.emailRequired'));
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error(t('contact.validation.invalidEmail'));
    if (!formData.message.trim()) return toast.error(t('contact.validation.messageRequired'));
    return true;
  };

  const { isSubmittingContact, submitContactForm } = useFormStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) { // Corrected this line
      try {
        await submitContactForm(formData);
        setFormData({ fullName: "", email: "", message: "" });
      } catch (error) {
        console.error("Signup failed:", error);
      }
    }
  };

  return (
    <div>
      <Header/>
      {/* Contact Page Content */}
      <div className="bg-slate-900 text-white min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[65vh] flex items-center justify-center text-center px-4">
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2070)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold">{t('contact.hero.title')}</h1>
            <p className="text-slate-300 font-[font16] max-w-2xl mx-auto mt-4 text-lg">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Contact Info + Form */}
        <div className="container mx-auto py-20 px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 lg:pr-10">
            <h2 className="text-3xl font-bold">{t('contact.info.title')}</h2>
            <p className="text-slate-400">
              {t('contact.info.subtitle')}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
                <Mail className="w-6 h-6 text-cyan-400" />
                <p className="text-slate-300">{t('contact.info.email')}</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
                <Phone className="w-6 h-6 text-cyan-400" />
                <p className="text-slate-300">{t('contact.info.phone')}</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
                <MapPin className="w-6 h-6 text-cyan-400" />
                <p className="text-slate-300">{t('contact.info.address')}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800/70 backdrop-blur-md p-10 rounded-2xl border border-slate-700 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  {t('contact.form.fullNameLabel')}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  id="name"
                  className="w-full px-4 py-3 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder={t('contact.form.fullNamePlaceholder')}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  {t('contact.form.emailLabel')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  id="email"
                  className="w-full px-4 py-3 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder={t('contact.form.emailPlaceholder')}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  {t('contact.form.messageLabel')}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows="5"
                  className="w-full px-4 py-3 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder={t('contact.form.messagePlaceholder')}
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 focus:outline-none transition"
                  disabled={isSubmittingContact}
                >
                  {isSubmittingContact ? (
                    <>
                      <Loader2 className="animate-spin" />
                      <span>{t('contact.form.sendingButton')}</span>
                    </>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;