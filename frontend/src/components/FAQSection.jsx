import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import FAQItem from "./FAQItem";

const FAQSection = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqData = useMemo(() => [
    {
      question: t('faq.item1.question'),
      answer: t('faq.item1.answer'),
    },
    {
      question: t('faq.item2.question'),
      answer: t('faq.item2.answer'),
    },
    {
      question: t('faq.item3.question'),
      answer: t('faq.item3.answer'),
    },
  ], [t]);

  const filteredFaqs = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) return faqData;
    return faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowercasedQuery) ||
        faq.answer.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, faqData]);

  return (
    <div className="max-w-3xl mx-auto mb-20 faq-section">
      <h2 className="text-3xl font-bold text-center mb-10">
        {t('faq.title')}
      </h2>

      <div className="relative mb-8">
        <input
          type="search"
          placeholder={t('faq.searchPlaceholder')}
          className="w-full pl-12 pr-4 py-4 text-white bg-slate-800/50 border border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQ === index}
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            />
          ))
        ) : (
          <p className="text-center text-slate-400">
            {t('faq.noResults', { query: searchQuery })}
          </p>
        )}
      </div>
    </div>
  );
};

export default FAQSection;