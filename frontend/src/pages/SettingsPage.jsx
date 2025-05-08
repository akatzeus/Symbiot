import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_BASE_URL = 'http://localhost:5000';

function SettingsPage() {
  const [settings, setSettings] = useState({
    storageDelay: 10,
    minStableFrames: 5
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cleanupDays, setCleanupDays] = useState(30);
  const [rpiAddress, setRpiAddress] = useState("192.168.11.124:5000");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${rpiAddress}/api/settings`);
      setSettings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`http://${rpiAddress}/api/settings`, settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://${rpiAddress}/api/clean-old-data`, {
        days: cleanupDays
      });
      alert(`Successfully deleted ${response.data.deleted_count} old records`);
    } catch (err) {
      setError('Failed to clean up old data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <Navbar/>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
          Settings saved successfully!
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Detection Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Storage Delay (seconds)
            </label>
            <input
              type="number"
              name="storageDelay"
              value={settings.storageDelay}
              onChange={handleChange}
              min="1"
              max="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum time between storing detections of the same disease
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Minimum Stable Frames
            </label>
            <input
              type="number"
              name="minStableFrames"
              value={settings.minStableFrames}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Number of consecutive frames needed to confirm detection
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Data Management</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Delete Data Older Than (days)
          </label>
          <input
            type="number"
            value={cleanupDays}
            onChange={(e) => setCleanupDays(parseInt(e.target.value))}
            min="1"
            max="365"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <button
          onClick={handleCleanup}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Clean Old Data'}
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;