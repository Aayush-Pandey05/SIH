// LanguageSwitcher.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import googleTranslateLogo from "../assets/Google_Translate_logo.svg.png"; // use your uploaded image path

const LanguageSwitcher = ({ closeOtherDropdown }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setOpen(false); // close dropdown after selecting
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle toggle + close profile dropdown if needed
  const handleToggle = () => {
    if (!open && closeOtherDropdown) {
      closeOtherDropdown(); // close profile dropdown (from parent)
    }
    setOpen(!open);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Google Translate Logo as button */}
      <img
        src={googleTranslateLogo}
        alt="Translate"
        className="w-8 h-8 cursor-pointer"
        title="Translate"
        onClick={handleToggle}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 right-0 w-40 bg-black border rounded shadow-md z-10">
          <ul className="py-1">
            <li
              className="px-3 py-2 hover:bg-blue-950 cursor-pointer text-white"
              onClick={() => handleLanguageChange("en")}
            >
              English
            </li>
            <li
              className="px-3 py-2 hover:bg-blue-950 cursor-pointer text-white"
              onClick={() => handleLanguageChange("hi")}
            >
              हिन्दी (Hindi)
            </li>
            <li
              className="px-3 py-2 hover:bg-blue-950 cursor-pointer text-white"
              onClick={() => handleLanguageChange("ta")}
            >
              தமிழ் (Tamil)
            </li>
            <li
              className="px-3 py-2 hover:bg-blue-950 cursor-pointer text-white"
              onClick={() => handleLanguageChange("te")}
            >
              తెలుగు (Telugu)
            </li>
            <li
              className="px-3 py-2 hover:bg-blue-950 cursor-pointer text-white"
              onClick={() => handleLanguageChange("kn")}
            >
              ಕನ್ನಡ (Kannada)
            </li>
            <li
              className="px-3 py-2 hover:bg-blue-950 cursor-pointer text-white"
              onClick={() => handleLanguageChange("ml")}
            >
              മലയാളം (Malayalam)
            </li>
            <li
              className="px-3 py-2 hover:bg-blue-950 cursor-pointer text-white"
              onClick={() => handleLanguageChange("pa")}
            >
              ਪੰਜਾਬੀ (Punjabi)
            </li>
            <li
              className="px-3 py-2 hover:bg-blue-950 cursor-pointer text-white"
              onClick={() => handleLanguageChange("as")}
            >
              অসমীয়া (Assamese)
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
