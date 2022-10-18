import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import HistoryHeaderInfo from './HistoryHeaderInfo';
export default function HistoryHeader({ data, refetch }) {
  function handleKeyDown(event) {
    if (event.key === 'Enter') navigate(`/summoner/${nameRef.current.value}`);
  }

  let info = {};
  if (data) info = data[0].info;
  const nameRef = useRef();
  const navigate = useNavigate();
  const { profileIconId, summonerLevel, summonerName } = info;
  const profileIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profileIconId}.jpg`;

  return (
    <div className='flex flex-row justify-evenly bg-neutral-800 p-5 mb-4'>
      <div className='flex flex-row'>
        <div className='text-center mr-5'>
          <img
            src={profileIconURL}
            className='w-28 h-28 rounded-full border-slate-700 border-4 border-double'
          ></img>
          <span className=' relative bottom-4 px-2 py-px z-10 bg-slate-700 rounded-xl text-center '>
            {summonerLevel}
          </span>
        </div>
        <div className='flex flex-col items-start'>
          <span className='text-2xl sm:text-5xl mb-2'>{summonerName}</span>
          <button
            className='rounded-lg bg-slate-700 text-2xl'
            onClick={refetch}
          >
            update
          </button>
        </div>
      </div>

      <HistoryHeaderInfo data={data} />

      <div className='hidden md:flex justify-center items-center float-right'>
        <input
          className='p-2 m-4 placeholder:text-center'
          placeholder='Another Summoner'
          type='text'
          ref={nameRef}
          onKeyDown={handleKeyDown}
        />
        <button
          className=' rounded-lg bg-slate-700'
          onClick={() => navigate(`/summoner/${nameRef.current.value}`)}
        >
          Search
        </button>
      </div>
    </div>
  );
}
