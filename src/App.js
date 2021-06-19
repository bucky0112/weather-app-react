import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import useLocation from './hooks/useLocation';
import useWeatherAPI from './hooks/useWeatherAPI';
import useMoment from './hooks/useMoment';
import WeatherCard from './views/WeatherCard';
import WeatherSetting from './views/WeatherSetting';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// setup theme color ==========
const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

// weather API Info
const authorizationKey = "CWB-B27FB271-F097-42ED-8D99-67165F86E777";

function App() {
  // custom hook start ================================
  const [cityName, locationName, sunriseCityName, handleCurrentCityChange] = useLocation({});

  const [currentWeather, fetchData] = useWeatherAPI({
    authorizationKey,
    locationName,
    cityName
  });

  const [currentTheme, moment] = useMoment({
    sunriseCityName
  });
  // custom hook end ================================

  const [currentPage, setCurrentPage] = useState('WeatherCard');

  const handleCurrentPageSwitch = (currentPage) => {
    setCurrentPage(currentPage)
  }
  
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            cityName={cityName}
            currentWeather={currentWeather}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageSwitch={handleCurrentPageSwitch}
          />
        )}
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            cityName={cityName}
            handleCurrentPageSwitch={handleCurrentPageSwitch}
            handleCurrentCityChange={handleCurrentCityChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
