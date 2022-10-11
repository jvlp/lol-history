import React from 'react'
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

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

  if (isFetching){
    return <div>Loading...</div>
  }

  return (
    
    <div>{JSON.stringify(data)}</div>
  )
}
