import { useState, useEffect } from 'react';
import axios from 'axios';
import DiseaseCard from '../components/DiseaseCard';
import VideoFeed from '../components/VideoFeed';
import StatusInfo from '../components/StatusInfo';
import SolutionsList from '../components/SolutionsList';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [diseaseData, setDiseaseData] = useState({ disease: 'Loading...', confidence: 0 });
  const [statusInfo, setStatusInfo] = useState({});
  const [solutions, setSolutions] = useState([]);
  const [rpiAddress, setRpiAddress] = useState("192.168.11.124:5000");
  const [translations, setTranslations] = useState({
    recommendedSolutions: "Recommended Solutions",
    betelnutLeafMonitoring: "Betelnut Leaf Monitoring Dashboard",
    loading: "Loading..."
  });

  // Define the translation keys for this page
  useEffect(() => {
    // Set the translation keys for the current page
    window.currentPageTranslationKeys = [
      "recommendedSolutions", 
      "betelnutLeafMonitoring",
      "loading"
    ];
    
    // Set the default English texts for the current page
    window.currentPageDefaultTexts = {
      recommendedSolutions: "Recommended Solutions",
      betelnutLeafMonitoring: "Betelnut Leaf Monitoring Dashboard",
      loading: "Loading..."
    };
    
    // Dispatch an event to notify that page has loaded and needs translation
    const currentLanguage = localStorage.getItem('language') || 'english';
    if (currentLanguage !== 'english') {
      window.dispatchEvent(new CustomEvent('pageLoaded', {
        detail: {
          needsTranslation: true,
          language: currentLanguage
        }
      }));
    }
    
    // Add listener for language changes
    const handleLanguageChange = (event) => {
      if (event.detail && event.detail.translations) {
        setTranslations(prevTranslations => ({
          ...prevTranslations,
          ...event.detail.translations
        }));
      }
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      // Clean up
      delete window.currentPageTranslationKeys;
      delete window.currentPageDefaultTexts;
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    const fetchDiseaseData = async () => {
      try {
        const response = await axios.get(`http://${rpiAddress}/disease-data`);
        setDiseaseData(response.data);
        
        // Fetch solutions for the detected disease
        const solutionsRes = await axios.get(`http://${rpiAddress}/api/solutions/${response.data.disease}`);
        setSolutions(solutionsRes.data.solutions || []);
      } catch (error) {
        console.error('Error fetching disease data:', error);
      }
    };

    const fetchStatusInfo = async () => {
      try {
        const response = await axios.get(`http://${rpiAddress}/api/status-info`);
        setStatusInfo(response.data);
      } catch (error) {
        console.error('Error fetching status info:', error);
      }
    };

    // Initial fetch
    fetchDiseaseData();
    fetchStatusInfo();

    // Set up intervals for periodic fetching
    const diseaseInterval = setInterval(fetchDiseaseData, 1000);
    const statusInterval = setInterval(fetchStatusInfo, 2000);

    return () => {
      clearInterval(diseaseInterval);
      clearInterval(statusInterval);
    };
  }, [rpiAddress]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8 space-y-6">
        <h1 className="text-3xl font-bold text-green-800 mt-4">
          {translations.betelnutLeafMonitoring}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoFeed />
          </div>
          
          <div className="space-y-6">
            <DiseaseCard 
              disease={diseaseData.disease === 'Loading...' ? translations.loading : diseaseData.disease} 
              confidence={diseaseData.confidence} 
            />
            <StatusInfo statusInfo={statusInfo} />
          </div>
        </div>
        
        {solutions.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              {translations.recommendedSolutions}
            </h2>
            <SolutionsList solutions={solutions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;