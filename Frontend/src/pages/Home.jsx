import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'LoL History - Home';
  }, []);

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') navigate(`/summoner/${name}`);
  }

  return (
    <div className='flex justify-center items-center content-center w-full h-full'>
      <input
        className='p-2 rounded-lg m-4 placeholder:text-center'
        placeholder='Summoner Name'
        type='text'
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button className='py-2 px-4 rounded-lg' onClick={() => navigate(`/summoner/${name}`)}>
        Fetch
      </button>
    </div>
  );
}
