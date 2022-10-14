import React from 'react';

export default function HistoryHeader({ data, refetch }) {
  let info = {};
  if (data) info = data[0].info;
  const { profileIconId, summonerLevel, summonerName } = info;
  const profileIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profileIconId}.jpg`;
  return (
    <div className='flex flex-row bg-neutral-800 p-5 mb-4'>
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
          className='rounded-lg bg-slate-700 px-4 py-2 text-2xl'
          onClick={refetch}
        >
          update
        </button>
      </div>
    </div>
  );
}
