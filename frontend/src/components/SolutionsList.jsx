import { useState, useEffect } from 'react';

const SolutionsList = ({ solutions }) => {
  const [translatedSolutions, setTranslatedSolutions] = useState(solutions);
  
  useEffect(() => {
    // Initial solutions update
    setTranslatedSolutions(solutions);
    
    // Add translation handler to translate solutions when language changes
    const handleLanguageChange = async (event) => {
      if (!event.detail || !solutions.length) return;
      
      const { language } = event.detail;
      
      // Only translate if not English
      if (language !== 'english') {
        try {
          const translatedItems = await translateSolutions(solutions, language);
          setTranslatedSolutions(translatedItems);
        } catch (error) {
          console.error('Error translating solutions:', error);
          // Fallback to original solutions
          setTranslatedSolutions(solutions);
        }
      } else {
        // Reset to original solutions for English
        setTranslatedSolutions(solutions);
      }
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    
    // Check current language on mount and translate if needed
    const checkCurrentLanguage = async () => {
      const currentLanguage = localStorage.getItem('language');
      if (currentLanguage && currentLanguage !== 'english' && solutions.length) {
        try {
          const translatedItems = await translateSolutions(solutions, currentLanguage);
          setTranslatedSolutions(translatedItems);
        } catch (error) {
          console.error('Error in initial translation of solutions:', error);
        }
      }
    };
    
    checkCurrentLanguage();
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, [solutions]);
  
  const translateSolutions = async (items, targetLanguage) => {
    try {
      const apiKey = import.meta.env.VITE_API_GOOGLE;
      if (!apiKey) {
        console.error('Google Translate API key not found');
        return items;
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
          q: items,
          source: 'en',
          target: targetLang,
          format: 'text'
        })
      });
      
      const data = await response.json();
      
      if (data.data && data.data.translations) {
        return data.data.translations.map(t => t.translatedText);
      }
      
      return items;
    } catch (error) {
      console.error('Translation error for solutions:', error);
      return items;
    }
  };

  return (
    <ul className="space-y-2">
      {translatedSolutions.map((solution, index) => (
        <li key={index} className="flex">
          <span className="text-green-600 mr-2">•</span>
          <span className="text-gray-700">{solution}</span>
        </li>
      ))}
    </ul>
  );
};

export default SolutionsList;