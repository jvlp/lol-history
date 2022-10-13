import React from 'react';
import { useNavigate } from 'react-router-dom';
import queues from '../jsons/queues.json';

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

export default function MatchCard({ players, info }) {
  const navigate = useNavigate();
  const {
    gameCreation,
    gameDuration,
    queueId,
    win,
    kills,
    deaths,
    assists,
    championName,
    championId,
    matchId,
    items,
    cs,
    totalDamageDealt,
  } = info;
  let containerClass, text, result, border;
  const championIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${championId}/${championId}000.jpg`;

  if (win) {
    containerClass =
      ' border-transparent w-full xl:w-fit hover:border-blue-500 border-l-8 bg-win mb-4 py-2 pl-4 pr-1 flex justify-evenly rounded-2xl cursor-pointer';
    text = 'text-blue-500';
    result = 'Victory';
    border = 'border-blue-500';
  } else {
    containerClass =
      ' border-transparent w-full xl:w-fit hover:border-red-500 border-l-8 bg-lose mb-4 py-2 pl-4 pr-1 flex justify-evenly rounded-2xl cursor-pointer';
    text = 'text-red-500';
    result = 'Defeat';
    border = 'border-red-500';
  }

  return (
    <div
      className={containerClass}
      onClick={() => navigate(`/match/${matchId}`)}
    >
      <div className='flex flex-row'>
        <div className='flex flex-col justify-center min-w-[10rem] max-w-[10rem] lg:min-w-[20rem] lg:max-w-[20rem] pr-5'>
          <div className=' mb-4 pb-4'>
            <p className='text-gray-400 font-bold text-4xl hidden lg:block'>
              {queues[queueId].detailedDescription !== ''
                ? queues[queueId].detailedDescription
                : queues[queueId].name}
            </p>
            <p className='text-gray-400 font-bold text-3xl block lg:hidden'>
              {queues[queueId].shortName}
            </p>
            <p className=' text-gray-400 '>{diff(gameCreation)}</p>
          </div>
          <div>
            <p className={`${text} font-bold text-2xl `}>{result}</p>
            <p className=' text-gray-400 '>{getGameDuration(gameDuration)}</p>
          </div>
        </div>
        {/* <div className='flex flex-row text-center justify-center items-center lg:min-w-[10rem]'> */}
        <div className='flex flex-col text-center justify-center items-center lg:ml-15'>
          <div className='flex flex-col sm:flex-row justify-center items-center'>
            <img
              src={championIconURL}
              className='w-16 h-16 sm:mr-5 lg:w-28 lg:h-28 rounded-full border-2'
            ></img>
            <div className='flex flex-col'>
              <span className=' text-lg font-semibold'>
                {kills + '/' + deaths + '/' + assists}
              </span>
              <span className=' text-lg'>{cs} CS</span>
              {/* <span className=' text-lg font-bold'>{championName}</span> */}
            </div>
          </div>
          <div className='md:flex flex-row mx-2 hidden min-w-[13rem]'>
            {items.map((item, index) => {
              if (item != 0) {
                return (
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/12.19.1/img/item/${item}.png`}
                    key={index}
                    className={`w-8 h-8 mx-px my-1 rounded-lg border-2 ${border}`}
                  ></img>
                );
              } else {
                return (
                  <div
                    className={`w-8 h-8 mx-px my-1 rounded-lg border-2 bg-gray-600 ${border}`}
                    key={index}
                  ></div>
                );
              }
            })}
          </div>
        </div>
      </div>
      <div className='grid grid-rows-5 grid-flow-col float-right'>
        {players.map((player, index) => (
          <div
            className='flex flex-row text-gray-400 items-center '
            key={index}
          >
            <img
              src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId}.png`}
              className='w-7 h-7 mr-2 hidden sm:block'
            ></img>
            <p className='text-left mr-6 truncate max-w-[4rem] md:max-w-[8rem] min-w-[4rem] md:min-w-[8rem] hidden sm:block'>
              {player.summonerName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
