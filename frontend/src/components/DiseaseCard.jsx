import { useState, useEffect } from 'react';

const DiseaseCard = ({ disease, confidence }) => {
  const [translatedDisease, setTranslatedDisease] = useState(disease);
  const [translations, setTranslations] = useState({
    confidence: "Confidence",
    healthy: "Healthy",
    diseaseDetected: "Disease Detected"
  });

  useEffect(() => {
    // Update the disease name when props change
    setTranslatedDisease(disease);
    
    // Add these keys to the page translation keys if not already there
    if (window.currentPageTranslationKeys) {
      const newKeys = ["confidence", "healthy", "diseaseDetected"];
      newKeys.forEach(key => {
        if (!window.currentPageTranslationKeys.includes(key)) {
          window.currentPageTranslationKeys.push(key);
        }
      });
    }
    
    // Add these default texts if not already there
    if (window.currentPageDefaultTexts) {
      window.currentPageDefaultTexts = {
        ...window.currentPageDefaultTexts,
        confidence: "Confidence",
        healthy: "Healthy",
        diseaseDetected: "Disease Detected"
      };
    }
    
    // Listen for language changes
    const handleLanguageChange = async (event) => {
      if (!event.detail) return;
      
      const { language, translations } = event.detail;
      
      // Update static translations
      if (translations) {
        setTranslations(prevTranslations => ({
          ...prevTranslations,
          ...translations
        }));
      }
      
      // Only translate disease name if not English and not a loading message
      if (language !== 'english' && disease !== 'Loading...') {
        try {
          const translatedName = await translateDisease(disease, language);
          setTranslatedDisease(translatedName);
        } catch (error) {
          console.error('Error translating disease name:', error);
          setTranslatedDisease(disease);
        }
      } else {
        setTranslatedDisease(disease);
      }
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    
    // Check current language on mount and translate if needed
    const checkCurrentLanguage = async () => {
      const currentLanguage = localStorage.getItem('language');
      if (currentLanguage && currentLanguage !== 'english' && disease !== 'Loading...') {
        try {
          const translatedName = await translateDisease(disease, currentLanguage);
          setTranslatedDisease(translatedName);
        } catch (error) {
          console.error('Error in initial translation of disease:', error);
        }
      }
    };
    
    checkCurrentLanguage();
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, [disease]);
  
  const translateDisease = async (diseaseName, targetLanguage) => {
    try {
      const apiKey = import.meta.env.VITE_API_GOOGLE;
      if (!apiKey) {
        console.error('Google Translate API key not found');
        return diseaseName;
      }
      
      // Map language codes
      const languageMap = {
        english: 'en',
        hindi: 'hi',
        kannada: 'kn'
      };
      
      const targetLang = languageMap[targetLanguage];
      
      // Use Google Translate API
      const url = 'https://translation.googleapis.com/language/translate/v2';
      const response = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: [diseaseName],
          source: 'en',
          target: targetLang,
          format: 'text'
        })
      });
      
      const data = await response.json();
      
      if (data.data && data.data.translations && data.data.translations.length > 0) {
        return data.data.translations[0].translatedText;
      }
      
      return diseaseName;
    } catch (error) {
      console.error('Translation error for disease name:', error);
      return diseaseName;
    }
  };

  const isHealthy = disease.toLowerCase().includes('healthy') || disease.toLowerCase().includes('normal');
  const isDiseaseLoading = disease === 'Loading...';
  
  let bgColor = 'bg-yellow-50';
  let textColor = 'text-yellow-800';
  let borderColor = 'border-yellow-200';
  
  if (!isDiseaseLoading) {
    if (isHealthy) {
      bgColor = 'bg-green-50';
      textColor = 'text-green-800';
      borderColor = 'border-green-200';
    } else {
      bgColor = 'bg-red-50';
      textColor = 'text-red-800';
      borderColor = 'border-red-200';
    }
  }

  return (
    <div className={`rounded-lg shadow-md ${bgColor} border ${borderColor} p-6`}>
      <h2 className={`text-xl font-bold ${textColor} mb-2`}>
        {isHealthy ? translations.healthy : translations.diseaseDetected}
      </h2>
      <div className="mt-4">
        <p className={`text-lg font-semibold ${textColor}`}>{translatedDisease}</p>
        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-600">{translations.confidence}:</span>
          <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
            <div 
              className={`${isHealthy ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} 
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{(confidence * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default DiseaseCard;