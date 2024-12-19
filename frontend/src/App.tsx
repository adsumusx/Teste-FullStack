
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FieldsPage from './pages/fields/index.tsx';
import FillsPage from './pages/fills/index.tsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FieldsPage />} />
        <Route path="/fills" element={<FillsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
