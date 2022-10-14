import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nameRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'LoL History - Home';
  }, []);

  function handleKeyDown(event) {
    if (event.key === 'Enter') navigate(`/summoner/${nameRef.current.value}`);
  }

  return (
    <div className='flex justify-center items-center content-center w-full h-full'>
      <input
        className='p-2 m-4 placeholder:text-center'
        placeholder='Summoner Name'
        type='text'
        ref={nameRef}
        onKeyDown={handleKeyDown}
      />
      <button
        className=' rounded-lg bg-slate-700'
        onClick={() => navigate(`/summoner/${nameRef.current.value}`)}
      >
        Fetch
      </button>
    </div>
  );
}
