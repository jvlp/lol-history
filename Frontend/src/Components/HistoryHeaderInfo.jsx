import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function HistoryHeaderInfo({ data }) {
  const numMatches = data.length;
  const numWin = data.filter((match) => match.info.win).length;
  const percentage = Math.floor((numWin / numMatches) * 100);
  const numLoss = numMatches - numWin;

  const counts = new Array(999).fill(0);
  const countsWin = new Array(999).fill(0);
  const comulativeKda = new Array(999).fill(0);

  data.map((match) => {
    const id = match.info.championId;
    const { win, kills, deaths, assists } = match.info;
    counts[id]++;
    countsWin[id] = win ? countsWin[id] + 1 : countsWin[id];
    comulativeKda[id] += (kills + assists) / deaths;
  });

  const countsCpy = [...counts];

  const topPlayed = [...countsCpy]
    .sort((a, b) => b - a)
    .slice(0, 3)
    .map((count) => {
      const index = countsCpy.indexOf(count);
      countsCpy[index] = 0;
      
      return index;
    });
  console.log();
  return (
    <div className='hidden lg:flex flex-row justify-center items-center'>
      <div className='flex flex-col items-center m-4'>
        <span>{`Last ${numMatches} matches`}</span>
        <span>
          {numWin}W - {numLoss}L
        </span>
      </div>
      <div className='w-24 h-24'>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({ trailColor: '#CC3333' })}
        />
      </div>

      {topPlayed.map((id, index) => (
        <div className='hidden xl:flex flex-row mx-4' key={index}>
          <img
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${id}/${id}000.jpg`}
            className={'w-16 h-16 mr-1'}
          ></img>
          <div className='flex flex-col'>
            <span
              className={`
              font-semibold
              ${
                countsWin[id] / counts[id] >= 0.5
                  ? 'text-cyan-400'
                  : 'text-red-500'
              }`}
            >
              {Math.floor((countsWin[id] / counts[id]) * 100)}%
            </span>
            <span className='text-gray-300'>
              {countsWin[id]}V - {counts[id] - countsWin[id]}D
            </span>
            <span className='text-gray-300'> {(comulativeKda[id] / counts[id]).toFixed(1) + ' '}KDA</span>
          </div>
        </div>
      ))}
    </div>
  );
}
