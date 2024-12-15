import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from './components/pages/Admin';
import Ranking from './components/pages/Ranking';
import TeamRanking from './components/pages/TeamRanking';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/team" element={<TeamRanking />} />
      </Routes>
    </div>
  );
}
export default App;