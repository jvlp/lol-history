import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [name, setName] = useState('');

  const navigate = useNavigate();

  function go2history() {
    navigate(`/${name}`);
  }

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') go2history();
  }

  return (
    <div>
      <input
        className='p-2 rounded-lg m-4 placeholder:text-center'
        placeholder='Summoner Name'
        type='text'
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button className='py-2 px-4 rounded-lg' onClick={go2history}>
        Fetch
      </button>
    </div>
  );
}
