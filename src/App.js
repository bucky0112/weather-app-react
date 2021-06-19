import React from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import WeatherCard from './views/WeatherCard'
import useWeatherAPI from './hooks/useWeatherAPI';
import useMoment from './hooks/useMoment';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// setup theme color start ==========
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
// setup theme color end ==========

// weather API Info
const Authorization_KEY = "CWB-B27FB271-F097-42ED-8D99-67165F86E777";
const LOCATION_NAME = "臺中"; // 觀測站名稱
const CITY_NAME = "臺中市";

function App() {
  const [currentWeather, fetchData] = useWeatherAPI({
    Authorization_KEY,
    LOCATION_NAME,
    CITY_NAME
  })

  const [currentTheme, moment] = useMoment({
    CITY_NAME
  })

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard
          currentWeather={currentWeather}
          moment={moment}
          fetchData={fetchData}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
