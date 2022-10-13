import React, { useEffect } from 'react';
import axios from 'axios';
import MatchCard from '../Components/MatchCard';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

export default function History() {
  const navigate = useNavigate();
  const { name } = useParams();

  useEffect(() => {
    document.title = document.title + ' - ' + name;
  }, []);

  const { data, isFetching, error, refetch } = useQuery(
    name,
    async () => {
      const endpoint = `http://192.168.0.114:5000/match_history/${name}`;
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
      <div className='flex w-full h-full justify-center items-center'>
        <span className='text-3xl'>Loading...</span>
      </div>
    );
  }
  console.log(data);
  return (
    <div className='w-full flex flex-col justify-center items-between bg-neutral-900 bg-opacity-50'>
      <div className='flex flex-row bg-neutral-800 p-5 mb-4'>
        <div className='text-center mr-5'>
          <img
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${data[0].info.profileIconId}.jpg`}
            className='w-28 h-28 rounded-full border-slate-700 border-4 border-double'
          ></img>
          <span className=' relative bottom-2 p-1 px-2 bg-slate-700 rounded-xl text-center '>
            {data[0].info.summonerLevel}
          </span>
        </div>
        <div className='flex flex-col items-start'>
          <span className='text-2xl sm:text-5xl mb-2'>
            {data[0].info.summonerName}
          </span>
          <button className='text-2xl rounded-lg' onClick={refetch}>
            update
          </button>
        </div>
      </div>
      <div className='flex flex-col items-center mx-4'>
        {data.map((match, index) => (
          <MatchCard
            key={index}
            players={match.participants}
            info={match.info}
          />
        ))}
      </div>
    </div>
  );
}
