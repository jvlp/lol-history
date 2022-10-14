import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function PlayerSkeleton({ team, maxDmg }) {
  const border = team === 'blue' ? 'border-blue-500' : 'border-red-500';
  return (
    <SkeletonTheme baseColor='#383838' highlightColor='#828282'>
      <div className='flex flex-row justify-center items-center hover:bg-neutral-600 bg-neutral-800 mb-2 px-4 py-2 rounded-xl cursor-pointer'>
        <Skeleton
          circle
          width={48}
          height={48}
          className={`border-slate-700 mr-2 border-2 ${border} rounded-full`}
        />

        <div className=' px-2 mr-2 flex flex-row items-center'>
          <Skeleton
            height={20}
            width={'100%'}
            containerClassName={
              'min-w-[5rem] max-w-[5rem] sm:min-w-[10rem] sm:max-w-[10rem]'
            }
          />
        </div>

        <div className='hidden md:flex flex-row min-w-[13rem] max-w-[13rem] mr-3'>
          <Skeleton height={32} width={32} className={'mx-px my-1'} />
          <Skeleton height={32} width={32} className={'mx-px'} />
          <Skeleton height={32} width={32} className={'mx-px'} />
          <Skeleton height={32} width={32} className={'mx-px'} />
          <Skeleton height={32} width={32} className={'mx-px'} />
          <Skeleton height={32} width={32} className={'mx-px'} />
        </div>

        <div className='flex flex-row items-center text-center'>
          <span className='min-w-[4rem] max-w-[4rem] '>
            <Skeleton height={20} width={'100%'} />
          </span>
          <span className='whitespace-nowrap min-w-[5rem] max-w-[5rem]'>
            <Skeleton height={20} width={40} />
          </span>

          <span className='hidden lg:block text-center lg:min-w-[8rem] lg:max-w-[8rem]'>
            <Skeleton height={20} width={'100%'} count={2} />
          </span>
        </div>
      </div>
    </SkeletonTheme>
  );
}
