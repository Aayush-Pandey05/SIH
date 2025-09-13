import { Mail, Phone, BookOpen } from "lucide-react";
import ContactCard from "./ContactCard";

const ContactSection = () => (
  <div className="max-w-5xl mx-auto">
    <div className="text-left mb-10 contact-section-title">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        Contact Us
      </h2>
      <p className="text-gray-600 mt-2">
        If you can't find the answer you're looking for, please don't hesitate
        to reach out to us.
      </p>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      <ContactCard
        icon={<Mail size={32} />}
        title="Email Us"
        description="Send us an email and we'll get back to you shortly."
        linkText="support@jalsetu.com"
        linkHref="mailto:support@jalsetu.com"
      />
      <ContactCard
        icon={<Phone size={32} />}
        title="Call Us"
        description="Talk to our support team for immediate assistance."
        linkText="+91 123 456 7890"
        linkHref="tel:+911234567890"
      />
      <ContactCard
        icon={<BookOpen size={32} />}
        title="Knowledge Base"
        description="Explore our articles and guides for self-service."
        linkText="Browse Articles"
        linkHref="#"
      />
    </div>
  </div>
);

export default ContactSection;
