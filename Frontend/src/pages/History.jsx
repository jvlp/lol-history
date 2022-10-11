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
    return <span className='text-3xl'>Loading...</span>;
  }
  console.log(data);
  return (
    <div>
      <div className='flex flex-row justify-between  mb-4'>
        <div className='flex items-center'>
          <img
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${data[0].info.profileIconId}.jpg`}
            className='w-20 h-20 rounded-full border-slate-700 border-4 border-double'
          ></img>
          <span className=' relative right-[4rem] top-10 bg-slate-700 rounded-xl px-2 text-center '>
            {data[0].info.summonerLevel}
          </span>
          <div>
            <span className='text-xl sm:text-5xl'>
              {data[0].info.summonerName}
            </span>
          </div>
        </div>
        <button className='text-2xl py-4 px-6 rounded-lg' onClick={refetch}>
          update
        </button>
      </div>
      <div className='flex items-center flex-col '>
        {data.map((match, index) => (
            <MatchCard key={index} players={match.participants} info={match.info}  />
        ))}
      </div>
    </div>
  );
}
