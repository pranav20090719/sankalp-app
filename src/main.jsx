import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from react-dom/client for React 18+
import App from './App.jsx'; // Import your main App component
import './index.css'; // Import your main CSS file

// Get the root DOM element where the React app will be rendered
const rootElement = document.getElementById('root');

// Create a React root and render the App component inside it
// React.StrictMode enables extra checks and warnings for potential problems in your app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App /> {/* Your main application component */}
  </React.StrictMode>,
);
