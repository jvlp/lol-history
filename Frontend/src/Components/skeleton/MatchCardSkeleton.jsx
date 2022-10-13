import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Summoner = () => {
  return (
    <div className='flex flex-row mr-2 items-center'>
      <Skeleton height={28} width={28} className={'mx-2'} />
      <Skeleton height={20} width={150} className={''} />
    </div>
  );
};

export default function MatchCardSkeleton({ players, info }) {
  return (
    <SkeletonTheme baseColor='#383838' highlightColor='#828282'>
      <div className='w-full xl:w-fit bg-win mb-4 py-2 pr-5 flex flex-row justify-between rounded-2xl cursor-pointer'>
        <div className='flex flex-col px-5'>
          <Skeleton width={300} height={45} className={'mb-1 pb-1'} />
          <Skeleton width={120} height={20} className={'mb-6 pb-6'} />
          <Skeleton width={180} height={30} />
          <Skeleton width={80} />
        </div>

        <div className='flex flex-col'>
          <div className='flex flex-row items-center justify-center'>
            <Skeleton circle width={112} height={112} />
            <div className='mx-4'>
              <Skeleton width={70} count={2} />
            </div>
          </div>
          <div className='flex flex-row'>
            <Skeleton height={32} width={32} className={'mx-px'} />
            <Skeleton height={32} width={32} className={'mx-px'} />
            <Skeleton height={32} width={32} className={'mx-px'} />
            <Skeleton height={32} width={32} className={'mx-px'} />
            <Skeleton height={32} width={32} className={'mx-px'} />
            <Skeleton height={32} width={32} className={'mx-px'} />
          </div>
        </div>
        <div className='grid grid-rows-5 grid-flow-col float-right'>
            <Summoner/>
            <Summoner/>
            <Summoner/>
            <Summoner/>
            <Summoner/>
            <Summoner/>
            <Summoner/>
            <Summoner/>
            <Summoner/>
            <Summoner/>
        </div>
      </div>
    </SkeletonTheme>
  );
  111;
  {
    /* <div className={containerClass}>
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
        </div> */
  }
  {
    /* <div className='flex flex-row text-center justify-center items-center lg:min-w-[10rem]'> */
  }
  {
    /* <div className='flex flex-col text-center justify-center items-center lg:ml-15'>
          <div className='flex flex-col sm:flex-row justify-center items-center'>
            <img
              src={championIconURL}
              className='w-16 h-16 sm:mr-5 lg:w-28 lg:h-28 rounded-full border-2'
            ></img>
            <div className='flex flex-col'>
              <span className=' text-lg font-semibold'>
                {kills + '/' + deaths + '/' + assists}
              </span>
              <span className=' text-lg'>{cs} CS</span> */
  }
  {
    /* <span className=' text-lg font-bold'>{championName}</span> */
  }
  {
    /* </div>
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
    </div> */
  }
  //   );
}
