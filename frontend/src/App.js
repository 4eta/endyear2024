import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/pages/Login';
import WaitingForQAsk from './components/pages/WaitingForQAsk';
import QAsk from './components/pages/QAsk';
import WaitingForQResult from './components/pages/WaitingForQResult';
import QResult from './components/pages/QResult';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/WaitingForQAsk" element={<WaitingForQAsk />} />
        <Route path="/QAsk" element={<QAsk />} />
        <Route path="/WaitingForQResult" element={<WaitingForQResult />} />
        <Route path="/QResult" element={<QResult />} />
      </Routes>
    </div>
  );
}
export default App;