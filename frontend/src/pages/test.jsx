import { useEffect, useState } from "react";

function DiseasePrediction() {
  const [disease, setDisease] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [rpiAddress, setRpiAddress] = useState("192.168.255.124:5000");
  const [videoError, setVideoError] = useState(false);

  const fetchDisease = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("/api/disease");
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Server returned ${res.status}: ${errorData.error || res.statusText}`);
      }
      
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (!data.disease) {
        setError("Invalid response: Missing disease data");
      } else {
        setDisease(data.disease);
        setConfidence(data.confidence);
        setError(null);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on component mount
    fetchDisease();
    return () => {}; // Empty cleanup function
  }, []);

  // Format confidence as percentage
  const formattedConfidence = confidence !== null ? 
    `${(confidence * 100).toFixed(2)}%` : "N/A";
    
  // Determine color based on disease status
  const diseaseColor = disease === "Healthy Leaf" ? 
    "text-green-600" : "text-red-600";

  // Handle video error
  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Leaf Disease Detection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Feed Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Live Camera Feed</h3>
          
          {videoError ? (
            <div className="bg-red-50 p-4 rounded border border-red-200 text-center">
              <p className="text-red-600 mb-2">Unable to connect to video feed</p>
              <p className="text-sm text-gray-600 mb-3">
                Check that your Raspberry Pi is online and streaming
              </p>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raspberry Pi Address:
                </label>
                <input 
                  type="text" 
                  value={rpiAddress}
                  onChange={(e) => setRpiAddress(e.target.value)}
                  className="px-3 py-2 border rounded w-full"
                />
              </div>
              <button
                onClick={() => setVideoError(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className="relative bg-black rounded overflow-hidden aspect-video">
              <img 
                src={`http://${rpiAddress}/video_feed`}
                alt="Live camera feed from Raspberry Pi"
                className="w-full h-full object-contain"
                onError={handleVideoError}
              />
            </div>
          )}
        </div>
        
        {/* Disease Detection Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Disease Analysis</h3>
          
          <button 
            onClick={fetchDisease}
            disabled={loading}
            className={`px-6 py-3 mb-6 font-bold rounded-md w-full ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white transition-colors`}
          >
            {loading ? "Detecting..." : "Detect Now"}
          </button>
          
          {loading && (
            <div className="flex justify-center my-4">
              <p className="text-gray-600">Analyzing leaf image...</p>
            </div>
          )}
          
          {error ? (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 mb-4">
              <p>{error}</p>
              <button 
                onClick={fetchDisease}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry Connection
              </button>
            </div>
          ) : disease ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Status: </span>
                <span className={`font-bold ${diseaseColor}`}>{disease}</span>
              </div>
              
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Confidence: </span>
                <span className="font-bold">{formattedConfidence}</span>
              </div>
              
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No detection data available. Click "Detect Now" to analyze the current image.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiseasePrediction;