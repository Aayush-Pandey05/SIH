// src/pages/ContactPage.js
import React, { useState, useEffect, useRef } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import Header from "../components/Header";
import FullScreenMenu from "../components/FullScreen";

const ContactPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const observerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div>
      {/* ✅ Header & Menu */}
      <Header
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <FullScreenMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

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
            <h1 className="text-4xl md:text-6xl font-bold">Contact Us</h1>
            <p className="text-slate-300 max-w-2xl mx-auto mt-4 text-lg">
              We’d love to hear from you! Reach out with questions, feedback, or
              collaboration ideas.
            </p>
          </div>
        </div>

        {/* Contact Info + Form */}
        <div className="container mx-auto py-20 px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 lg:pr-10">
            <h2 className="text-3xl font-bold">Get In Touch</h2>
            <p className="text-slate-400">
              Our team is here to help and answer any questions you might have.
              We look forward to hearing from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
                <Mail className="w-6 h-6 text-cyan-400" />
                <p className="text-slate-300">support@jalsetu.com</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
                <Phone className="w-6 h-6 text-cyan-400" />
                <p className="text-slate-300">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
                <MapPin className="w-6 h-6 text-cyan-400" />
                <p className="text-slate-300">Bengaluru, Karnataka, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800/70 backdrop-blur-md p-10 rounded-2xl border border-slate-700 shadow-xl">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-3 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Your feedback or question..."
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 focus:outline-none transition"
                >
                  Send Message <Send className="w-4 h-4" />
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
