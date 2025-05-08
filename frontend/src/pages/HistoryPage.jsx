import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const HistoryPage = () => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loadingSolutions, setLoadingSolutions] = useState(false);
  const [rpiAddress, setRpiAddress] = useState("192.168.11.124:5000");
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US"); // Default to English
  const speechSynthRef = useRef(window.speechSynthesis);
  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchDetections();
    
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchDetections, 30000);
    
    return () => {
      clearInterval(interval);
      // Cancel any ongoing speech when component unmounts
      speechSynthRef.current.cancel();
    };
  }, []);

  const fetchDetections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${rpiAddress}/api/stored-detections`);
      setDetections(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch detection history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSolutions = async (disease) => {
    try {
      setLoadingSolutions(true);
      setSelectedDisease(disease);
      
      // Call the endpoint that uses Gemini for limited solutions
      const response = await axios.get(`${API_BASE_URL}/api/v1/gemini/solutions`, {
        params: { disease }
      });
      
      setSolutions(response.data.solutions || []);
    } catch (err) {
      console.error('Error fetching solutions from Gemini:', err);
      setSolutions(['Failed to fetch solutions. Please try again later.']);
    } finally {
      setLoadingSolutions(false);
    }
  };

  // Function to speak the solutions
  const speakSolutions = () => {
    // Cancel any ongoing speech
    speechSynthRef.current.cancel();
    
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    
    const textToSpeak = `Solutions for ${selectedDisease}. ${solutions.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set the language
    utterance.lang = selectedLanguage;
    
    // Find voice that matches the selected language
    const voices = speechSynthRef.current.getVoices();
    const voice = voices.find(voice => voice.lang.includes(selectedLanguage.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }
    
    // Event handlers for speech synthesis
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = () => {
      console.error('Speech synthesis error');
      setIsPlaying(false);
    };
    
    speechSynthRef.current.speak(utterance);
  };

  // Function to stop speaking
  const stopSpeaking = () => {
    speechSynthRef.current.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      
      {/* Add padding-top to create space after navbar */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="flex justify-end mb-6">
          <button 
            onClick={fetchDetections}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Refresh
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {loading && detections.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading detection history...</p>
          </div>
        ) : detections.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No disease detections have been stored yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {detections.map(detection => (
              <div 
                key={detection._id} 
                className={`bg-white rounded-lg shadow overflow-hidden ${
                  detection.disease.includes('Disease') ? 'border-l-4 border-red-500' : 
                  detection.disease === 'Dried Leaf' ? 'border-l-4 border-yellow-500' : 
                  'border-l-4 border-green-500'
                }`}
              >
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">{detection.disease}</h3>
                  <p className="text-gray-600">
                    Confidence: {(detection.confidence * 100).toFixed(2)}%
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(detection.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div className="border-t border-gray-100">
                  <img 
                    src={`http://${rpiAddress}/api/detection/${detection._id}/image`} 
                    alt={detection.disease}
                    className="w-full h-64 object-contain bg-gray-50"
                  />
                </div>
                
                <div className="p-4 bg-gray-50">
                  <button
                    onClick={() => showSolutions(detection.disease)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    View Solutions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Enhanced Solutions Modal with Text-to-Speech */}
        {selectedDisease && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-green-800">
                    Solutions for {selectedDisease}
                  </h3>
                  <button 
                    onClick={() => {
                      setSelectedDisease(null);
                      stopSpeaking();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto flex-grow">
                {loadingSolutions ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
                  </div>
                ) : (
                  <>
                    {/* Language Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Language
                      </label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="en-US">English</option>
                        <option value="kn-IN">Kannada</option>
                        <option value="hi-IN">Hindi</option>
                        <option value="ta-IN">Tamil</option>
                        <option value="te-IN">Telugu</option>
                      </select>
                    </div>
                    
                    {/* Text-to-Speech Controls */}
                    <div className="mb-4">
                      <button
                        onClick={speakSolutions}
                        className={`px-4 py-2 rounded-md w-full ${
                          isPlaying 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {isPlaying ? 'Stop Reading' : 'Read Solutions Aloud'}
                      </button>
                    </div>
                    
                    <ul className="space-y-3">
                      {solutions.map((solution, index) => (
                        <li key={index} className="flex">
                          <span className="text-green-600 mr-2">•</span>
                          <span className="text-gray-700">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              
              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    setSelectedDisease(null);
                    stopSpeaking();
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;