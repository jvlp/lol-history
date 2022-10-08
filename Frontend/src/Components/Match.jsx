import React from 'react';

function getGameDuration(timestamp) {
  var a = new Date(timestamp * 1000);
  var min = a.getMinutes();
  var sec = a.getSeconds();

  if (min <= 9) min = '0' + min;
  if (sec <= 9) sec = '0' + sec;
  if (timestamp >= 3600) return '01' + ':' + min + ':' + sec;

  return min + ':' + sec;
}

function diff(timestamp) {
  const date1 = new Date(Date.now());
  const date2 = new Date(timestamp);
  const diffTime = Math.abs(date2 - date1);
  let day = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let hour = Math.floor(diffTime / (1000 * 60 * 60));
  let min = Math.floor(diffTime / (1000 * 60)) % 60;

  if (day <= 9 && day > 0) day = '0' + day;
  if (hour <= 9 && hour > 0) hour = '0' + hour;
  if (min <= 9) min = '0' + min;

  if (day > 1) return day + ' days ago';
  if (day == 1) return day + ' day ago';
  if (hour > 1) return hour + ' hours ago';
  if (hour == 1) return hour + ' hour ago';
  return min + ' minutes ago';
}

export default function Match({ players, info }) {
  const {
    gameCreation,
    gameDuration,
    gameMode,
    win,
    kills,
    deaths,
    assists,
    championName,
  } = info;
  let containerClass, text, result;

  if (win) {
    containerClass =
      'max-w-full border-blue-500 hover:border-l-8 bg-win mb-4 p-4 flex justify-between w-screen rounded-2xl';
    text = 'text-blue-500';
    result = 'Victory';
  } else {
    containerClass =
      'max-w-full border-red-500 hover:border-l-8 bg-lose mb-4 p-4 flex justify-between w-screen rounded-2xl';
    text = 'text-red-500';
    result = 'Defeat';
  }

  return (
    <div className={containerClass}>
      <div className='flex flex-col justify-center items-center'>
        <p className={`${text} font-bold text-2xl`}>{gameMode}</p>
        <p className=' text-gray-400 mb-2'>{diff(gameCreation)}</p>
        <p className=' text-slate-400 font-bold text-xl '>{result}</p>
        <p className=' text-gray-400 '>{getGameDuration(gameDuration)}</p>
      </div>

      <div className='flex flex-col justify-center items-center invisible md:visible'>
        <span className=' text-lg font-semibold'>{championName}</span>
        {kills} / {deaths} / {assists}
      </div>
      <div className='grid grid-rows-5 grid-flow-col gap-1'>
        {players.map((item, index) => (
          <div
            className=' text-gray-400 min-w-[6rem] max-w-[6rem] md:min-w-[8rem] md:max-w-[4rem] truncate'
            key={index}
          >
            {item.summonerName}
          </div>
        ))}
      </div>
    </div>
  );
}
