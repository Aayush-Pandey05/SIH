const ContactCard = ({ icon, title, description, linkText, linkHref }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 contact-card">
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 flex-grow">{description}</p>
    <a href={linkHref} className="font-semibold text-blue-600 hover:underline">
      {linkText}
    </a>
  </div>
);

export default ContactCard;
