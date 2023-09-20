import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/videos")
    .then((response) => response.json())
    .then((data) => {
      setVideos(data);
    })
    .catch((error) => {
      console.error("Error fetching data:",error);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Recommendation</h1>
        <div>
          <h2>Video List</h2>
          <ul>
            {videos.map((video) => (
              <li key={video.id}>
                <strong>{video.title}</strong>
                <br />
                Rating: {video.rating}
                
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
