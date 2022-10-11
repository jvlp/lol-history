import React from 'react';
import { useNavigate, Link} from 'react-router-dom';
import items from '../jsons/items.json';
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
  } = info;
  let containerClass, text, result;
  const championIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`;

  if (win) {
    containerClass =
      'max-w-full border-blue-500 hover:border-l-4 bg-win mb-4 py-2 pl-4 pr-1 flex justify-center sm:justify-between w-screen rounded-2xl';
    text = 'text-blue-500';
    result = 'Victory';
  } else {
    containerClass =
      'max-w-full border-red-500 hover:border-l-4 bg-lose mb-4 py-2 pl-4 pr-1 flex justify-center sm:justify-between w-screen rounded-2xl';
    text = 'text-red-500';
    result = 'Defeat';
  }

  return (
      <div className={containerClass} onClick={()=> navigate(`/match/${matchId}`)}>
        <div className='flex flex-row'>
          <div className='flex flex-col justify-center items-center min-w-[15rem] lg:min-w-[25rem] center'>
            <div className='border-b-[1px] border-b-slate-400 mb-4 pb-4 border-opacity-25'>
              <p className={`text-gray-400 font-bold text-4xl hidden lg:block`}>
                {queues[queueId].detailedDescription !== "" ? queues[queueId].detailedDescription : queues[queueId].name}
              </p>
              <p className={`text-gray-400 font-bold text-3xl block lg:hidden`}>
                {queues[queueId].shortName}
              </p>
              <p className=' text-gray-400 '>{diff(gameCreation)}</p>
            </div>
            <div>
              <p className={`${text} font-bold text-2xl `}>{result}</p>
              <p className=' text-gray-400 '>{getGameDuration(gameDuration)}</p>
            </div>
          </div>
          <div className='hidden flex-col justify-center items-center mx-5 lg:mx-20 xm:flex'>
            <img src={championIconURL} className='w-16 h-16 lg:w-auto lg:h-auto rounded-full'></img>
            <span className=' text-lg font-semibold'>{championName}</span>
            {kills + '/' + deaths + '/' + assists}
          </div>
        </div>
        <div className='grid grid-rows-5 grid-flow-col float-right'>
          {players.map((player, index) => (
            <div className='flex flex-row text-gray-400 items-center ' key={index}>
              <img
                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId}.png`}
                className='w-7 h-7 mr-2 hidden sm:block'
              ></img>
              <p className='text-left mr-6 truncate max-w-[4rem] xm:max-w-[8rem] min-w-[4rem] xm:min-w-[8rem] hidden sm:block'>
                {player.summonerName}
              </p>
            </div>
          ))}
        </div>
      </div>
  );
}
