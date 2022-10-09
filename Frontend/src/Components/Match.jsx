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
    championId,
  } = info;
  let containerClass, text, result;
  const championIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`;

  if (win) {
    containerClass =
      'max-w-full border-blue-500 hover:border-l-4 bg-win mb-4 p-1 flex justify-center sm:justify-between w-screen rounded-2xl';
    text = 'text-blue-500';
    result = 'Victory';
  } else {
    containerClass =
      'max-w-full border-red-500 hover:border-l-4 bg-lose mb-4 p-1 flex justify-center xm:justify-between w-screen rounded-2xl';
    text = 'text-red-500';
    result = 'Defeat';
  }

  return (
    <div className={containerClass}>
      <div className='flex flex-row'>
        <div className='flex flex-col justify-center items-center min-w-[9.5rem] center'>
          <div className='border-b-[1px] border-b-slate-400 mb-4 pb-4 border-opacity-25'>
            <p className={`text-gray-400 font-bold text-4xl mx-5 `}>
              {gameMode}
            </p>
            <p className=' text-gray-400 '>{diff(gameCreation)}</p>
          </div>
          <div>
            <p className={`${text} font-bold text-2xl `}>{result}</p>
            <p className=' text-gray-400 '>{getGameDuration(gameDuration)}</p>
          </div>
        </div>
        <div className='hidden flex-col justify-center items-center mx-20 sm:flex'>
          <img src={championIconURL} className=' scale-75 rounded-full'></img>
          <span className=' text-lg font-semibold'>{championName}</span>
          {kills + '/' + deaths + '/' + assists}
        </div>
      </div>

      <div className='grid grid-rows-5 grid-flow-col gap-1'>
        {players.map((player, index) => (
          <div className='flex flex-row text-gray-400 items-center' key={index}>
            <img
              src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId}.png`}
              className='w-7 h-7 mr-2 hidden xm:block'
            ></img>
            <span className=' text-left min-w-[4rem] max-w-[4rem] sm:min-w-[8rem] sm:max-w-[8rem] truncate hidden xm:flex'>
              {player.summonerName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
