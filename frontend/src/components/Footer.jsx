import React from 'react';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> {/* Reduced padding */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> {/* Reduced gap */}
          <div>
            <h2 className="text-lg font-bold mb-1">JalSetu 2.0</h2> {/* Smaller heading */}
            <p className="text-xs">Every Drop Counts. Every Citizen Matters.</p>
            <p className="text-xs mt-0.5">Empowering India to harvest rainwater efficiently.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Quick Links</h3>
            <ul className="space-y-0.5">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Features</a></li>
              <li><a href="#" className="hover:underline">Schemes</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Resources</h3>
            <ul className="space-y-0.5">
              <li><a href="#" className="hover:underline">Govt. Resources & Policies</a></li>
              <li><a href="#" className="hover:underline">Knowledge Articles</a></li>
              <li><a href="#" className="hover:underline">FAQs</a></li>
              <li><a href="#" className="hover:underline">Blog/Updates</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Support</h3>
            <ul className="space-y-0.5">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Report an Issue</a></li>
              <li><a href="#" className="hover:underline">Feedback</a></li>
              <li><a href="#" className="hover:underline">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-600 my-2"></div> {/* Reduced from my-4 */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <h3 className="text-sm font-semibold mb-1">Contact Info</h3>
            <p className="text-xs">123 Jal Marg, New Delhi, India 110001</p>
            <p className="text-xs mt-0.5">Email: contact@jalsetu.gov.in</p>
            <p className="text-xs mt-0.5">Helpline: +91 1800 123 4567</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Follow Us</h3>
            <div className="flex space-x-2"> {/* Smaller spacing */}
              <a href="#" className="hover:text-gray-300"><FaInstagram size={18} /></a>
              <a href="#" className="hover:text-gray-300"><FaTwitter size={18} /></a>
              <a href="#" className="hover:text-gray-300"><FaFacebookF size={18} /></a>
              <a href="#" className="hover:text-gray-300"><FaLinkedinIn size={18} /></a>
              <a href="#" className="hover:text-gray-300"><FaYoutube size={18} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Newsletter Signup</h3>
            <p className="text-xs mb-1">Stay updated with our latest news and features.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-2 py-0.5 bg-white border border-gray-300 rounded-l text-gray-800 text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-0.5 bg-blue-600 hover:bg-blue-500 rounded-r text-xs"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-blue-600 my-2"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-200">
          <div className="space-x-2 mb-1 md:mb-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms & Conditions</a>
            <a href="#" className="hover:underline">Disclaimer</a>
          </div>
          <div>© 2024 JalSetu 2.0. All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
