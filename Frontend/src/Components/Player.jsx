import React from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';

export default function Player({ participant, maxDmg }) {
  const navigate = useNavigate();
  const {
    summonerName,
    championId,
    kills,
    deaths,
    assists,
    item0,
    item1,
    item2,
    item3,
    item4,
    item5,
    totalDamageDealtToChampions,
    totalMinionsKilled,
    teamId,
    win,
  } = participant;

  const border = teamId === 100 ? 'border-blue-500' : 'border-red-500';
  const items = [item0, item1, item2, item3, item4, item5];
  const championIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${championId}/${championId}000.jpg`;
  return (
    <div
      className='flex flex-row justify-center items-center hover:bg-neutral-600 bg-neutral-800 mb-2 px-4 py-1 rounded-xl cursor-pointer'
      onClick={() => navigate(`/${summonerName}`)}
    >
      <img
        src={championIconURL}
        className={
          'w-12 h-12 mr-2 border-2 border-blue-500 rounded-full ' + border
        }
      ></img>

      <div className='min-w-[12rem] max-w-[12rem]'>
        <span className='truncate flex flex-row items-center text-left '>
          {summonerName}
        </span>
      </div>

      <div className='flex flex-row min-w-[13rem] max-w-[13rem]'>
        {items.map((item, index) => {
          if (item != 0) {
            return (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/12.19.1/img/item/${item}.png`}
                key={index}
                className='w-8 h-8 mx-px my-1 rounded-lg border-[1px] p-px'
              ></img>
            );
          } else {
            return (
              <div
                className='w-8 h-8 mx-px my-1 bg-gray-800 rounded-lg border-[1.5px] border-opacity-5  p-px'
                key={index}
              >

              </div>
            );
          }
        })}
      </div>

      <div className='flex flex-row items-center text-center'>
        <span className='min-w-[5rem] max-w-[5rem]  pr-2'>
          {kills + '/' + deaths + '/' + assists}
        </span>
        <span className='whitespace-nowrap min-w-[5rem] max-w-[5rem] pr-4'>{totalMinionsKilled} CS</span>
        <div className='text-center min-w-[8rem] max-w-[8rem] '>
          <span className=''>
            {totalDamageDealtToChampions.toLocaleString()} Damage
          </span>
          <ProgressBar
            completed={(totalDamageDealtToChampions / maxDmg) * 100}
            height={'7px'}
            bgColor={win ? '#3482F6' : '#EF4444'}
            isLabelVisible={false}
          />
        </div>
      </div>
    </div>
  );
}
