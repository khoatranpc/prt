import { useState } from 'react';
import FormCard from './CreateCard';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <FormCard />
    </>
  )
}

export default App;
