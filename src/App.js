import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Home from './Pages/Home/Home';

function App() {
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="App">
      <Home 
        wallet={wallet}
        setWallet={setWallet}
      />
    </div>
  );
}

export default App;
