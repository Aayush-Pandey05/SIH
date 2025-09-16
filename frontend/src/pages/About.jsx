import React, { useState, useEffect, useRef } from "react";
import { Target, Cpu, Send, BarChart4, Loader2 } from "lucide-react";
import Header from "../components/Header";
import FullScreenMenu from "../components/FullScreen";
import { useFormStore } from "../store/useFormStore";

const AboutPage = () => {
  // State and effects from your ContactPage for the header and menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const observerRef = useRef(null);
  const [visibleElements, setVisibleElements] = useState(new Set());

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    feedback: "",
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.feedback.trim()) return toast.error("Feedback is required");
    return true;
  };

  const { isSubmittingFeedback, submitFeedbackForm } = useFormStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm) {
      try {
        await submitFeedbackForm(formData);
        setFormData({ fullName: "", email: "", feedback: "" });
      } catch (error) {
        console.error("Signup failed:", error);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // This observer logic is for scroll-triggered animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) =>
              new Set(prev).add(entry.target.dataset.animate)
            );
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const animatedElements = document.querySelectorAll("[data-animate]");
    animatedElements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (observerRef.current) {
        animatedElements.forEach((el) => {
          if (observerRef.current) {
            observerRef.current.unobserve(el);
          }
        });
      }
    };
  }, []);

  return (
    <div>
      <Header
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <FullScreenMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div className="bg-slate-900 text-white min-h-screen">
        {/* Hero Section with Background Image */}
        <div className="relative h-[60vh] flex items-center justify-center text-center px-4">
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1444044205806-38f37f2d125f?q=80&w=2070&auto=format&fit=crop)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold">
              A Water-Secure Future.
            </h1>
            <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 mt-2">
              Built With You.
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto mt-6 text-lg">
              Personalized, proactive water journeys, guided by experts and
              powered by AI, designed to help you conserve better, plan smarter,
              and stay water-secure longer.
            </p>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="container mx-auto py-20 px-4">
          {/* Our Story Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold uppercase text-cyan-400 tracking-widest">
              For a Water-Secure India
            </h2>
            <p className="text-3xl md:text-4xl font-bold mt-4">
              Empowering Citizens with Water Intelligence
            </p>
            <p className="text-slate-400 mt-4 leading-relaxed">
              JalSetu connects advanced satellite mapping, artificial
              intelligence, and augmented reality into a simple platform. Our
              mission is to make rainwater harvesting accessible, data-driven,
              and actionable for everyone from individual homes to entire
              communities.
            </p>
          </div>

          {/* Core Pillars Section - Aligned with your Landing Page */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-center">
              <Target className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">GIS-Powered Precision</h3>
              <p className="text-slate-400 mt-2">
                Draw your rooftop on a satellite map and get precise
                calculations for harvestable rainwater.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-center">
              <Cpu className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">AI-Driven Recommendations</h3>
              <p className="text-slate-400 mt-2">
                Our intelligent system suggests the most effective recharge
                structures based on your location.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-center">
              <BarChart4 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Smart Analytics & Alerts</h3>
              <p className="text-slate-400 mt-2">
                Receive predictive rainfall alerts and track your water savings
                with a personalized analytics dashboard.
              </p>
            </div>
          </div>

          {/* Feedback Form Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">
                Share Your Feedback
              </h2>
              <p className="text-slate-400 mt-4 leading-relaxed">
                Have a question, a suggestion, or a story to share? We'd love to
                hear from you.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    id="name"
                    className="w-full px-4 py-3 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Your Name"
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    id="email"
                    className="w-full px-4 py-3 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Your Feedback
                  </label>
                  <textarea
                    id="message"
                    value={formData.feedback}
                    onChange={(e) =>
                      setFormData({ ...formData, feedback: e.target.value })
                    }
                    rows="5"
                    className="w-full px-4 py-3 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Tell us what you think..."
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none transition-colors"
                    disabled={isSubmittingFeedback}
                  >
                    {isSubmittingFeedback ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
