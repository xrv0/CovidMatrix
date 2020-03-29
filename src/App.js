import React from 'react';
import './App.css';
import CoronaRect from "./components/CoronaRect";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CoronaRect width={1000} height={1000}/>
      </header>
    </div>
  );
}

export default App;
