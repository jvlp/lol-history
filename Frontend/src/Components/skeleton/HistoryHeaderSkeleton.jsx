import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function HistoryHeaderSkeleton() {
  return (
    <SkeletonTheme baseColor='#383838' highlightColor='#828282'>
      <div className='flex flex-row bg-neutral-800 p-5 mb-4'>
        <div className='text-center mr-5'>
          <Skeleton
            circle
            width={112}
            height={112}
            className='border-slate-700 border-4 border-double'
          />
          <span className=' relative bottom-4 z-10 bg-slate-700 rounded-xl text-center border-slate-700 border-[1px] '>
            <Skeleton width={40} className='rounded-xl mx-px' />
          </span>
        </div>
        <div className='flex flex-col items-start'>
          <span className='text-2xl sm:text-5xl mb-2'>
            <Skeleton width={300} />
          </span>
          <button
            type='button'
            className='flex items-center rounded-lg bg-slate-700 text-2xl'
            disabled
          >
            <svg
              className='mr-3 h-5 w-5 animate-spin text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            <span className='font-medium'> Updating... </span>
          </button>
        </div>
      </div>
    </SkeletonTheme>
  );
}
