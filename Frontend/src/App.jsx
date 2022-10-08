import { Route, Routes } from 'react-router-dom';
import './App.css';
import History from './pages/History';
import Home from './pages/home';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/:name' element={<History />} />
    </Routes>
  );
}

export default App;
