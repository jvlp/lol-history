import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Summoner = () => {
  return (
    <div className='hidden sm:flex flex-row mr-2 items-center'>
      <Skeleton height={28} width={28} className={'mx-2'} />
      <Skeleton
        height={20}
        width={'100%'}
        containerClassName={
          'max-w-[4rem] md:max-w-[8rem] min-w-[4rem] md:min-w-[8rem]'
        }
      />
    </div>
  );
};

export default function MatchCardSkeleton({ players, info }) {
  return (
    <SkeletonTheme baseColor='#383838' highlightColor='#828282'>
      <div className='w-full xl:w-fit bg-neutral-700 mb-4 py-2 pr-5 flex flex-row justify-between rounded-2xl cursor-pointer'>
        {/* gamemode + time since + result + game duration */}
        <div className='flex flex-col px-5'>
          <Skeleton
            width={'100%'}
            height={45}
            className={'mb-1 pb-1'}
            containerClassName={
              'min-w-[10rem] max-w-[10rem] lg:min-w-[20rem] lg:max-w-[20rem]'
            }
          />
          <Skeleton
            width={'100%'}
            height={20}
            className={'mb-6 pb-6'}
            containerClassName={
              'min-w-[4rem] max-w-[4rem] lg:min-w-[8rem] lg:max-w-[8rem]'
            }
          />
          <Skeleton
            width={'100%'}
            height={30}
            containerClassName={
              'min-w-[6rem] max-w-[6rem] lg:min-w-[12rem] lg:max-w-[12rem]'
            }
          />
          <Skeleton
            width={'100%'}
            containerClassName={
              'min-w-[2rem] max-w-[2rem] lg:min-w-[4rem] lg:max-w-[4rem]'
            }
          />
        </div>
        {/* champions portrait + kda + cs + runes + items */}
        <div className='flex flex-col'>
          {/* champion portrait */}
          <div className='flex flex-col sm:flex-row items-center justify-center'>
            <Skeleton
              circle
              width={'100%'}
              height={'100%'}
              containerClassName={'w-16 h-16 lg:w-28 lg:h-28  mb-1'}
            />
            {/* kda + cs */}
            <div className='flex flex-col justify-center items-center'>
              <div className='mx-4'>
                <Skeleton width={70} count={2} />
              </div>
              {/* runes */}
              <div className='flex flex-row'>
                <Skeleton height={32} width={32} className={'mx-px'} />
                <Skeleton height={32} width={32} className={'mx-px'} />
              </div>
            </div>
          </div>
          {/* items */}
          <div className='hidden sm:flex flex-row mt-2'>
            {new Array(6).fill(0).map((_, index) => (
              <Skeleton
                height={32}
                width={32}
                className={'mx-px'}
                key={index}
              />
            ))}
          </div>
        </div>

        {/* player names + champion portraits */}
        <div className='grid grid-rows-5 grid-flow-col float-right'>
          {new Array(10).fill(0).map((_, index) => (
            <Summoner key={index} />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}
