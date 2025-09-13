import { ChevronDown } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-200 faq-item">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left py-5 px-1"
    >
      <span className="text-lg font-medium text-gray-800">{question}</span>
      <ChevronDown
        size={24}
        className={`text-gray-500 transform transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-96" : "max-h-0"
      }`}
    >
      <p className="text-gray-600 pb-5 px-1">{answer}</p>
    </div>
  </div>
);

export default FAQItem;
