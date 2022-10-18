import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function HistoryHeaderInfo({ data }) {
  const numWin = data.filter((match) => match.info.win).length;
  const percentage = (numWin / data.length) * 100;
  const numLoss = data.length - numWin;

  const counts = new Array(999).fill(0);
  const countsWin = new Array(999).fill(0);

  data.map((match) => {
    const id = match.info.championId;
    counts[id]++;
    countsWin[id] = match.info.win ? countsWin[id] + 1 : countsWin[id];
  });

  const topPlayed = [...counts]
    .sort((a, b) => b - a)
    .slice(0, 3)
    .map((count) => counts.indexOf(count));

  return (
    <div className='flex flex-row justify-center items-center'>
      <div className='flex flex-col items-center m-4'>
        <span>Last 20 matches</span>
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
        <div className='flex flex-row mx-4'>
          <img
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${id}/${id}000.jpg`}
            key={index}
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
            <span>
              {countsWin[id]}V - {counts[id] - countsWin[id]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
