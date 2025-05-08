import { useState, useEffect } from 'react';

function StatusInfo({ statusInfo }) {
  const [translations, setTranslations] = useState({
    systemStatus: "System Status",
    lastStored: "Last Stored",
    storageDelay: "Storage Delay",
    frameStability: "Frame Stability",
    none: "None",
    seconds: "seconds"
  });

  useEffect(() => {
    // Initialize with any existing translations first
    if (window.currentTranslations) {
      setTranslations(prev => ({
        ...prev,
        ...window.currentTranslations
      }));
    }
    
    // Add these keys to the page translation keys if not already there
    if (window.currentPageTranslationKeys) {
      const newKeys = [
        "systemStatus", "lastStored", "storageDelay", 
        "frameStability", "none", "seconds"
      ];
      
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
        systemStatus: "System Status",
        lastStored: "Last Stored",
        storageDelay: "Storage Delay",
        frameStability: "Frame Stability",
        none: "None",
        seconds: "seconds"
      };
    }
    
    // Listen for language changes
    const handleLanguageChange = (event) => {
      if (event.detail && event.detail.translations) {
        setTranslations(prev => ({
          ...prev,
          ...event.detail.translations
        }));
      }
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    
    // Dispatch an event to request translations
    window.dispatchEvent(new CustomEvent('requestTranslations', {
      detail: {
        keys: ["systemStatus", "lastStored", "storageDelay", 
               "frameStability", "none", "seconds"]
      }
    }));
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  return (
    <div className="bg-blue-50 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-blue-800">{translations.systemStatus}</h3>
      <div className="mt-4 space-y-2">
        <p className="text-gray-700">
          <span className="font-medium">{translations.lastStored}:</span> {statusInfo?.lastStored || translations.none}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">{translations.storageDelay}:</span> {statusInfo?.storageDelay} {translations.seconds}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">{translations.frameStability}:</span> {statusInfo?.frameStability}
        </p>
      </div>
    </div>
  );
}

export default StatusInfo;