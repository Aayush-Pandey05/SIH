import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import FAQItem from "./FAQItem";

const faqData = [
  {
    question: "How do I get started with JalSetu?",
    answer:
      "To get started, sign up for an account, complete your profile, and explore the dashboard. You can access tutorials and guides in the 'Learn' section for detailed instructions.",
  },
  {
    question: "What are the benefits of rainwater harvesting?",
    answer:
      "Rainwater harvesting helps in conserving water, reducing soil erosion, recharging groundwater levels, and decreasing reliance on municipal water sources. It's a sustainable practice that promotes water security.",
  },
  {
    question: "How can I contact support?",
    answer:
      'You can contact our support team via email at support@jalsetu.com, call us at +91 123 456 7890, or browse our Knowledge Base. All options are listed in the "Contact Us" section.',
  },
];

const FAQSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const filteredFaqs = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) return faqData;
    return faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowercasedQuery) ||
        faq.answer.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-3xl mx-auto mb-20 faq-section">
      <h2 className="text-3xl font-bold text-center mb-10">
        Frequently Asked Questions
      </h2>

      <div className="relative mb-8">
        <input
          type="search"
          placeholder="Search for answers..."
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
            No results found for "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
};

export default FAQSection;
