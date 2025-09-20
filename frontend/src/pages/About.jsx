import React, { useState } from "react";
import { Target, Cpu, BarChart4, Loader2 } from "lucide-react";
import Header from "../components/Header";
import { useFormStore } from "../store/useFormStore";

const AboutPage = () => {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    feedback: "",
  });

  const { isSubmittingFeedback, submitFeedbackForm } = useFormStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      alert("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Invalid email format");
      return false;
    }
    if (!formData.feedback.trim()) {
      alert("Feedback is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await submitFeedbackForm(formData);
        alert("Thank you for your feedback!");
        setFormData({ fullName: "", email: "", feedback: "" });
      } catch (error) {
        console.error("Feedback failed:", error);
        alert("Failed to send feedback. Please try again.");
      }
    }
  };


  return (
    <div>
      
      <Header />
      

      {/* Hero Section */}
      <section
        id="hero"
        className="relative h-[60vh] flex items-center justify-center text-center text-white bg-blue-950"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1444044205806-38f37f2d125f?q=80&w=2070&auto=format&fit=crop)",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 p-4">
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
      </section>

      {/* Our Story */}
      <section className="bg-black text-gray-300">
        <div className="container mx-auto py-20 px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold uppercase text-cyan-500 tracking-widest">
              For a Water-Secure India
            </h2>
            <p className="text-3xl md:text-4xl font-bold mt-4 text-gray-200">
              Empowering Citizens with Water Intelligence
            </p>
            <p className="text-gray-400 mt-4 leading-relaxed">
              JalSetu connects advanced satellite mapping, artificial intelligence,
              and augmented reality into a simple platform. Our mission is to make
              rainwater harvesting accessible, data-driven, and actionable for
              everyone from individual homes to entire communities.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gray-800 shadow-lg p-8 rounded-2xl text-center">
              <Target className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">GIS-Powered Precision</h3>
              <p className="text-gray-400 mt-2">
                Draw your rooftop on a satellite map and get precise calculations
                for harvestable rainwater.
              </p>
            </div>
            <div className="bg-gray-800 shadow-lg p-8 rounded-2xl text-center">
              <Cpu className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">AI-Driven Recommendations</h3>
              <p className="text-gray-400 mt-2">
                Our intelligent system suggests the most effective recharge
                structures based on your location.
              </p>
            </div>
            <div className="bg-gray-800 shadow-lg p-8 rounded-2xl text-center">
              <BarChart4 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">Smart Analytics & Alerts</h3>
              <p className="text-gray-400 mt-2">
                Receive predictive rainfall alerts and track your water savings
                with a personalized analytics dashboard.
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="mt-24 max-w-3xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl text-cyan-400 md:text-4xl font-bold">Share Your Feedback</h2>
              <p className="text-gray-400 mt-4 leading-relaxed">
                Have a question, a suggestion, or a story to share? We'd love to
                hear from you.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-700 shadow-md p-8 rounded-2xl mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    id="name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    id="email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    id="message"
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Tell us what you think..."
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg shadow-sm text-base font-medium text-white bg-cyan-600 hover:bg-cyan-700 transition-colors disabled:opacity-50"
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
      </section>
    </div>
  );
};

export default AboutPage;