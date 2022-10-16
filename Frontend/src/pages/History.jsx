import React, { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryHeader from '../Components/HistoryHeader';
import HistoryHeaderSkeleton from '../Components/skeleton/HistoryHeaderSkeleton';
import MatchCard from '../Components/MatchCard';
import MatchCardSkeleton from '../Components/skeleton/MatchCardSkeleton';

export default function History() {
  const navigate = useNavigate();
  const { name } = useParams();

  useEffect(() => {
    document.title = document.title + ' - ' + name;
  }, []);

  const { data, isFetching, error, refetch } = useQuery(
    name,
    async () => {
      // const endpoint = `http://192.168.0.114:5000/api/match_history/${name}`;
      const endpoint = `${window.location.origin}/api/match_history/${name}`;
      console.log(endpoint);
      const response = await axios.get(endpoint);
      console.log(response.data);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    }
  );

  if (error) navigate('/');

  if (isFetching) {
    return (
      <div className='bg-neutral-900 bg-opacity-50'>
        <HistoryHeaderSkeleton />
        <div className='flex flex-col w-full h-full justify-center items-center'>
          {new Array(20).fill(0).map((_, index) => (
            <MatchCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col justify-center items-between bg-neutral-900 bg-opacity-50'>
      <HistoryHeader data={data} refetch={refetch} />
      <div className='flex flex-col items-center mx-4'>
        {data.map((match, index) => (
          <MatchCard
            key={index}
            players={match.participants}
            info={match.info}
          />
        ))}
      </div>

      <div className='flex justify-center'>
        <button className='bg-slate-700 text-xl px-8 mb-4 '>Show More</button>
      </div>
    </div>
  );
}
