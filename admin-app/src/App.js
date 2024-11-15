import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from './components/pages/Admin';
import Ranking from './components/pages/Ranking';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </div>
  );
}
export default App;