import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Route'lar ve diğer bileşenler buraya eklenecek */}
        </div>
      </Router>
    </Provider>
  );
}

export default App; 