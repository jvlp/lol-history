import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import Player from '../Components/Player';
import PlayerSkeleton from '../Components/skeleton/PlayerSkeleton';

export default function Match() {
  const { matchId } = useParams();

  const { data, isFetching, error, refetch } = useQuery(
    matchId,
    async () => {
      // const endpoint = `http://192.168.0.114:5000/match/${matchId}`;
      const baseUrl = window.location.origin
      const endpoint = `${baseUrl}/api/match/${matchId}`;
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

  const getMaxDmg = () => {
    return Math.max(
      ...data.participants.map((p) => {
        return p.totalDamageDealtToChampions;
      })
    );
  };
  const maxDmg = !isFetching ? getMaxDmg() : 0;

  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center bg-neutral-900 bg-opacity-50'>
        <div className='text-blue-500 text-2xl font-semibold py-2 rounded-3xl'>
          Blue Team
        </div>
        {isFetching &&
          new Array(5).fill(0).map((_, index) => <PlayerSkeleton team={'blue'} key={index} />)}
        {!isFetching &&
          data.participants.map(
            (participant, index) =>
              participant.teamId === 100 && (
                <Player participant={participant} maxDmg={maxDmg} key={index} />
              )
          )}
        <div className=' text-red-500 text-2xl font-semibold mt-10 pb-2 rounded-3xl'>
          Red Team
        </div>
        {isFetching &&
          new Array(5).fill(0).map((_, index) => <PlayerSkeleton team={'red'} key={index} />)}
        {!isFetching &&
          data.participants.map(
            (participant, index) =>
              participant.teamId === 200 && (
                <Player participant={participant} maxDmg={maxDmg} key={index} />
              )
          )}
      </div>
  );
}
