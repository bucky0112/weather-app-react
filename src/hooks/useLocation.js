import { useState, useMemo } from 'react';
import { findLocation } from '../utils/helpers';

export default function useLocation() {
  const cityNameFromStorage = localStorage.getItem('cityName') || '彰化縣';
  const [currentCity, setCurrentCity] = useState(cityNameFromStorage);

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity)
  }

  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  // console.log(currentLocation);
  // {cityName: "臺中市", locationName: "臺中", sunriseCityName: "臺中市"}
  const { cityName, locationName, sunriseCityName } = currentLocation;
  
  return [cityName, locationName, sunriseCityName, handleCurrentCityChange]
}