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
            {new Array(6).fill(0).map(() => (
              <Skeleton height={32} width={32} className={'mx-px'} />
            ))}
          </div>
        </div>
        <div className='grid grid-rows-5 grid-flow-col float-right'>
          {new Array(10).fill(0).map(() => (
            <Summoner />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}
