import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Match from './Match';

export default function History() {
  const [isLoading, setLoading] = useState(false);
  const [acceptInput, setacceptInput] = useState(true);
  const [name, setName] = useState('');
  const [matches, setMatches] = useState([[]]);

  const fetchData = () => {
    console.log(name);
    setMatches([]);
    setacceptInput(false);
    setLoading(true);
    const endpoint = `http://192.168.0.114:5000/match_history/${name}`;

    axios.get(endpoint)
    .then((response) => {
      console.log(response.data);
      response.data.map((match, index) => {
        setMatches((old) => {
          let copy = [...old];
          copy.push(
            <Match
              key={index}
              players={match.participants}
              info={match.info}
            />
          );
          return copy;
        });
      });
    })
    .catch((error) => {
      setacceptInput(true);
      console.error(error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') fetchData();
  }

  if (acceptInput) {
    return (
      <div>
        <input
          className='p-2 rounded-lg m-4 placeholder:text-center'
          placeholder='Summoner Name'
          type='text'
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className='py-2 px-4 rounded-lg' onClick={fetchData}>
          Fetch
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <span className='text-3xl'>Loading...</span>;
  }

  return <div className='flex items-center flex-col'>{matches}</div>;
}
