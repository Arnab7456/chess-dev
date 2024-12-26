

import './App.css'

import { HashRouter, Route, Routes } from "react-router-dom";
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';


function App() {
  
  return (
    <div className='h-screen bg-slate-950'>
    < HashRouter>
      <Routes>
        <Route path="/" element={<Landing></Landing>}/>
        <Route path="/game" element={<Game></Game>}/> 
      </Routes>
    </HashRouter>
      
     
    </div>
  ) 
}

export default App
