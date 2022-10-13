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
          <button className='bg-slate-700 text-2xl rounded-lg'>update</button>
        </div>
      </div>
    </SkeletonTheme>
  );
}
