import React from "react";
import ColorDetectionApp from "./ColorDetectionApp";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>AI Color Detection</h1>
        <p>Extract and identify colors from images or camera feed</p>
      </header>
      <main className="container main">
        <ColorDetectionApp />
      </main>
      <footer className="footer">
        <p>AI Color Detection App © 2025</p>
      </footer>
    </div>
  );
}

export default App;
