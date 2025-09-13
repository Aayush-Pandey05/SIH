import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import FAQItem from "./FAQItem";

const Data = [
  {
    question: "How do I get started with JalSetu ?",
    answer:
      "To get started with JalSetu, sign up for an account, complete your profile, and explore the dashboard. You can access tutorials and guides in the 'Learn' section for detailed instructions.",
  },
  {
    question: "What are the benefits of rainwater harvesting?",
    answer:
      "Rainwater harvesting helps in conserving water, reducing soil erosion, recharging groundwater levels, and decreasing reliance on municipal water sources. It's a sustainable practice that promotes water security.",
  },
  {
    question: "How can I contact support?",
    answer:
      'You can contact our support team via email at support@jalsetu.com, call us at +91 123 456 7890, or browse our Knowledge Base for self-service articles. All options are listed in the "Contact Us" section below.',
  },
];

const FAQSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const filteredFaqs = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) return Data;
    return Data.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowercasedQuery) ||
        faq.answer.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-3xl mx-auto mb-16 md:mb-20">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 faq-section-title">
        Frequently Asked Questions
      </h2>

      
      <div className="max-w-2xl mx-auto mb-12 md:mb-16 search-bar">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search for answers"
            className="w-full py-3 md:py-4 pl-12 pr-4 text-base md:text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
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
          <p className="text-center text-gray-600">
            No results found for "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
};

export default FAQSection;
