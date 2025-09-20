import { useFormStore } from "../store/useFormStore";
import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

const Modal = ({ isOpen, onClose }) => {
  const [area, setArea] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [district, setDistrict] = useState("");
  const firstInputRef = useRef(null);
  const { isSubmittingUserData, submitUserDataForm } = useFormStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      firstInputRef.current?.focus();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!area || !lat || !lng || !district) {
      alert("Please fill all fields");
      return;
    }
    try {
      await submitUserDataForm(lat, lng, area, district);
      window.location.reload();
    } catch (error) {
      console.error("API error:", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-1050 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Manual Data Entry
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <input
            ref={firstInputRef}
            type="number"
            placeholder="Area (sq.m)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
          />
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
          />
          <input
            type="number"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
          />
          <p className="text-gray-500 text-sm">
            Need help with coordinates?{" "}
            <a
              href="https://www.latlong.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              www.latlong.net
            </a>
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-white text-sm lg:text-base rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
              isSubmittingUserData
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#00a63e] hover:bg-[#008c34] hover:shadow-lg hover:scale-105"
            }`}
            disabled={isSubmittingUserData}
          >
            {isSubmittingUserData ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
