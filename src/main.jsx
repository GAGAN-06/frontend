import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import React Router components
import App from './App';  // Existing App component
import RateTranslations from './rate';  // New RateTranslations component
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />  {/* Home page (App) */}
        <Route path="/rate" element={<RateTranslations />} />  {/* New page for rating translations */}
      </Routes>
    </Router>
  </React.StrictMode>
);
