import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Match from '../Components/Match';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

export default function History() {
  const navigate = useNavigate();
  const { name } = useParams();

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

  return (
    <div>
      <div className='flex flex-row justify-between  mb-4'>
          <div className='flex items-center'>
            <div>
            <span className='text-5xl mx-2'>{data[0].info.summonerName}</span>
            <span className='text-lg mx-2'>
              {'Level ' + data[0].info.summonerLevel}
            </span>
            </div>
          </div>
        <button
          className='text-2xl py-4 px-6 rounded-lg'
          onClick={refetch}
        >
          update
        </button>
      </div>
      <div className='flex items-center flex-col'>
        {data.map((match, index) => (
          <Match key={index} players={match.participants} info={match.info} />
        ))}
      </div>
    </div>
  );
}
