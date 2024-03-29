import { Route, Routes } from 'react-router-dom';
import './App.css';
import History from './pages/History';
import Home from './pages/Home';
import Match from './pages/Match';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/summoner/:name' element={<History />} />
      <Route path='/match/:matchId' element={<Match />} />
    </Routes>
  );
}

export default App;
