import React from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';
import runes from '../jsons/runesReforged.json';

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

  const getPerkIndex = (n) =>
    String(n).charAt(1) == 9 ? 1 : String(n).charAt(1);

  const getRuneObj = (perkId, slotIndex) => {
    console.log();
    return runes[primaryPerkIndex]?.slots[slotIndex].runes.find(
      (rune) => rune.id == perkId
    );
  };

  const getRuneUrl = (rune) => {
    const baseUrl =
      'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/';
    return baseUrl + rune.icon.toLowerCase();
  };

  const primaryPerkId = participant.perks.styles[0].selections[0].perk;
  const primaryPerkIndex = getPerkIndex(primaryPerkId);
  const primaryPerk = getRuneObj(primaryPerkId, 0);

  const secondaryPerkId = participant.perks.styles[1].selections[0].perk;
  const secondaryPerkIndex = getPerkIndex(secondaryPerkId);

  const border = teamId === 100 ? 'border-blue-500' : 'border-red-500';
  const items = [item0, item1, item2, item3, item4, item5];
  const championIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${championId}/${championId}000.jpg`;
  return (
    <div
      className='flex flex-row justify-center items-center hover:bg-neutral-600 bg-neutral-800 mb-2 px-4 py-2 mx-1 rounded-xl cursor-pointer'
      onClick={() => navigate(`/summoner/${summonerName}`)}
    >
      <div className='flex flex-row'>
        <img
          src={championIconURL}
          className={
            'w-12 h-12 border-2 mr-1 border-blue-500 rounded-full ' + border
          }
        ></img>
        <div className='flex flex-col justify-center items-center'>
          <img
            src={getRuneUrl(primaryPerk)}
            className={`w-6 h-6 rounded-lg`}
          ></img>
          <img
            src={getRuneUrl(runes[secondaryPerkIndex])}
            className={`w-5 h-5 rounded-lg`}
          ></img>
        </div>
      </div>

      <div className='min-w-[5rem] max-w-[5rem] sm:min-w-[10rem] sm:max-w-[10rem] px-2 mr-2 flex flex-row items-center'>
        <span className='truncate'>{summonerName}</span>
      </div>

      <div className='hidden md:flex flex-row min-w-[13rem] max-w-[13rem] mr-3'>
        {items.map((item, index) => {
          if (item != 0) {
            return (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/12.19.1/img/item/${item}.png`}
                key={index}
                className='w-8 h-8 mx-px my-1 rounded-lg border-[2px] border-zinc-600 '
              ></img>
            );
          } else {
            return (
              <div
                className='w-8 h-8 mx-px my-1 bg-gray-800 rounded-lg border-[2px] border-zinc-600'
                key={index}
              ></div>
            );
          }
        })}
      </div>

      <div className='flex flex-row items-center text-center'>
        <span className='min-w-[4rem] max-w-[4rem]'>
          {kills + '/' + deaths + '/' + assists}
        </span>
        <span className='whitespace-nowrap min-w-[5rem] max-w-[5rem]'>
          {totalMinionsKilled} CS
        </span>
        <div className='hidden lg:block text-center lg:min-w-[8rem] lg:max-w-[8rem]'>
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
