
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FieldsPage from './pages/FieldsPage.tsx';
import FillsPage from './pages/FillsPage.tsx';

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
