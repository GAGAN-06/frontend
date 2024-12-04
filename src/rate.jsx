import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/card';
import { Button } from './components/button';


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
  { label: "Hindi", value: "hi" }, // Add Hindi manually
];

const RateTranslations = () => {
  const [formData, setFormData] = useState({ language: "", message: "", model: "gpt-3.5-turbo" });
  const [translations, setTranslations] = useState(null);
  const [error, setError] = useState("");
  const [translationsList, setTranslationsList] = useState([]);
  const [ratings, setRatings] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRatingChange = (modelId, value) => {
    const validValue = Math.min(10, Math.max(1, value)); // Ensure rating is between 1 and 10
    setRatings(prev => ({
      ...prev,
      [modelId]: validValue
    }));
  };

  const moveTranslation = (index, direction) => {
    const newList = [...translationsList];
    if (direction === 'up' && index > 0) {
      [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
    } else if (direction === 'down' && index < newList.length - 1) {
      [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    }
    setTranslationsList(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message || !formData.language) {
      setError("Please enter a message and select a language.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTranslations(data);
      
      // Initialize translation list with rankings
      const list = [
        { id: 'gemini', content: data.geminiTranslation, model: 'gemini-1.5-pro' },
        { id: 'deepl', content: data.deeplTranslation, model: 'deepl' },
        { id: 'openai', content: data.openaiTranslation, model: 'gpt-4o' }
      ];
      setTranslationsList(list);
      
      // Initialize ratings
      const initialRatings = {};
      list.forEach(item => {
        initialRatings[item.id] = 5; // Default rating of 5
      });
      setRatings(initialRatings);
    } catch (error) {
      setError("An error occurred while fetching translations.");
    }
  };

  const saveRankings = async () => {
    try {
      const rankings = translationsList.map((item, index) => ({        
        sourceText: formData.message,
        targetLanguage: formData.Lan,
        modelName: item.model,
        translationText: item.content,
        rank: index + 1,
        rating: ratings[item.id]
      }));

      const response = await fetch("https://backend-vaeh.onrender.com/save-rankings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rankings }),
      });

      if (!response.ok) {
        throw new Error("Failed to save rankings");
      }

      alert("Rankings saved successfully!");
    } catch (error) {
      setError("Failed to save rankings");
    }
  };

  const ArrowUpIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
  
  const ArrowDownIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M19 12l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compare Translations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language:</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a language</option>
                {Languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message:</label>
              <textarea
                name="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-2 border rounded min-h-[100px]"
              />
            </div>

            <Button type="submit" className="w-full">Get Translations</Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded">
          {error}
        </div>
      )}

      {translations && (
        <Card>
        <CardHeader>
          <CardTitle>Rank and Rate Translations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-500 mb-4">
            Drag translations up or down to rank them, and rate each translation from 1-10
          </div>
          
          {translationsList.map((item, index) => (
            <div key={item.id} className="border p-4 rounded shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.model}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveTranslation(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUpIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveTranslation(index, 'down')}
                    disabled={index === translationsList.length - 1}
                  >
                    <ArrowDownIcon />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Rating:</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ratings[item.id]}
                  onChange={(e) => handleRatingChange(item.id, parseInt(e.target.value, 10))}
                  className="w-20 p-1 border rounded"
                />
              </div>

              <div className="bg-gray-50 p-2 rounded">
                {item.content}
              </div>
            </div>
          ))}

          <Button 
            onClick={saveRankings}
            className="w-full mt-4"
          >
            Save Rankings
          </Button>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default RateTranslations;