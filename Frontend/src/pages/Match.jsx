import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import Player from '../Components/Player';

export default function Match() {
  const { matchId } = useParams();

  const { data, isFetching, error, refetch } = useQuery(
    matchId,
    async () => {
      const endpoint = `http://192.168.0.114:5000/match/${matchId}`;
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

  if (isFetching) {
    return <div>Loading...</div>;
  }

  const maxDmg = Math.max(...data.participants.map((p) => {
      return p.totalDamageDealtToChampions;
    })
  );
  
  return (
    <div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-neutral-900 bg-opacity-50 mt-auto'>
      <div className=' bg-neutral-800 py-10 px-40 bg-opacity-0 rounded-3xl'>
        <div className='text-blue-500 text-2xl font-semibold py-2 rounded-3xl'>
          Blue Team
        </div>
        {data.participants.map(
          (participant, index) =>
            participant.teamId === 100 && (
              <Player participant={participant} maxDmg={maxDmg} key={index} />
            )
        )}
        <div className=' text-red-500 text-2xl font-semibold pt-10 rounded-3xl'>
          Red Team
        </div>
        {data.participants.map(
          (participant, index) =>
            participant.teamId === 200 && (
              <Player participant={participant} maxDmg={maxDmg} key={index} />
            )
        )}
      </div>
    </div>
  );
}
