import React from 'react';

function VideoFeed() {
  const videoUrl = 'http://192.168.11.124:5000/video_feed'; // Your Flask video endpoint
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-green-50 border-b border-green-100">
        <h3 className="text-lg font-medium text-green-800">Live Camera Feed</h3>
      </div>
      <div className="p-4 flex justify-center">
        <img 
          src={videoUrl} 
          alt="Live video feed" 
          className="rounded"
          style={{ 
            maxWidth: "500px", 
            width: "100%", 
            height: "auto",
            minHeight: "100px"
          }}
        />
      </div>
    </div>
  );
}

export default VideoFeed;