import { useState } from 'react';
import FormCard from './CreateCard';
import Bill from './Bill';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  const [dataBill, setDataBill] = useState(null);
  return (
    <Routes>
      <Route path='/' element={<FormCard setDataBill={setDataBill} />} />
      <Route path='/bill' element={<Bill dataBill={dataBill} />} />
    </Routes>
  )
}

export default App;
