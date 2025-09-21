import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Emp. State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      "lat": 18.5737599,
      "lng": 73.8845683
    },
    creator: 'u2'
  }
];

const UserPlaces = () => {
  const { userId } = useParams();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  
  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
  }

  useEffect(() => {
    const fetch = async () => {
      try{
        const responseData = await sendRequest(import.meta.env.VITE_BACKEND_URL + `/places/user/${userId}`);
        setLoadedPlaces(responseData.places);
      } catch(err){
        console.log(err);
      }
    };
    fetch();
    
  }, [sendRequest, userId]);

  return (
  <React.Fragment>
    <ErrorModal error={error} onClear={clearError}/>
    {isLoading && <div className="center"><LoadingSpinner /></div>}
    {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
  </React.Fragment>
  );
};

export default UserPlaces;