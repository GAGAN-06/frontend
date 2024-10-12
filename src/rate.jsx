import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';  // Import navigation hook
import "./index.css";


const Languages = [
  { label: "Bulgarian", value: "bg" },
  { label: "Czech", value: "cs" },
  { label: "Danish", value: "da" },
  { label: "Dutch", value: "nl" },
  { label: "English (American)", value: "en-US" },
  { label: "English (British)", value: "en-GB" },
  { label: "Estonian", value: "et" },
  { label: "Finnish", value: "fi" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Greek", value: "el" },
  { label: "Hungarian", value: "hu" },
  { label: "Indonesian", value: "id" },
  { label: "Italian", value: "it" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Latvian", value: "lv" },
  { label: "Lithuanian", value: "lt" },
  { label: "Polish", value: "pl" },
  { label: "Portuguese (European)", value: "pt-PT" },
  { label: "Portuguese (Brazilian)", value: "pt-BR" },
  { label: "Romanian", value: "ro" },
  { label: "Russian", value: "ru" },
  { label: "Slovak", value: "sk" },
  { label: "Slovenian", value: "sl" },
  { label: "Spanish", value: "es" },
  { label: "Swedish", value: "sv" },
  { label: "Turkish", value: "tr" },
  { label: "Ukrainian", value: "uk" },
  { label: "Chinese (Simplified)", value: "zh" },
  { label: "Hindi", value: "hi" },  // Add Hindi manually
];

const RateTranslations = () => {
  const [formData, setFormData] = useState({ language: "", message: "" });
  const [translations, setTranslations] = useState(null);
  const [rating, setRating] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();  // Initialize the navigate function

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message || !formData.language) {
      setError("Please enter a message and select a language.");
      return;
    }

    try {
      const response = await fetch("https://backend-vaeh.onrender.com/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setTranslations(data);
      setRating(data.rating);
    } catch (error) {
      setError("An error occurred while fetching translations.");
    }
  };

  return (
    <div className="rate-translations">
      <h2 className="rate-title">Rate Translations</h2>
      
      <form className="rate-form" onSubmit={handleSubmit}>
        {/* Dropdown for selecting language */}
        <select
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          className="rate-select"
        >
          <option value="">Select a language</option>
          {Languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        
        <textarea
          name="message"
          placeholder="Enter your message"
          value={formData.message}
          onChange={handleInputChange}
          className="rate-textarea"
        />
        
        <button type="submit" className="rate-submit">Get Translations and Rating</button>
      </form>
      
      {error && <div className="rate-error">{error}</div>}
      
      {translations && (
        <div className="rate-results">
          <h3>Translations:</h3>
          <p><strong>Gemini:</strong> {translations.geminiTranslation}</p>
          <p><strong>DeepL:</strong> {translations.deeplTranslation}</p>
          <p><strong>OpenAI:</strong> {translations.openaiTranslation}</p>
          
          <h3>ChatGPT Rating:</h3>
          <p>{rating}</p>
        </div>
      )}
      
      <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default RateTranslations;
