import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { getMoment } from './utils/helpers';
import WeatherCard from './views/WeatherCard'

// style component start ==============
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// style component end ==============

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

// fetch 氣象站 API
const fetchGetWeather = () => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${Authorization_KEY}&locationName=${LOCATION_NAME}`)
    .then((res) => res.json())
    .then((data) => {
      const locationData = data.records.location[0];
      // 風速&溫度取得
      const weatherElements = locationData.weatherElement.reduce(
        (needInfo, item) => {
          if (['WDSD', 'TEMP'].includes(item.elementName)) {
            needInfo[item.elementName] = item.elementValue;
          }
          return needInfo;
        }, {}
      );
      // data into state
      return ({
        locationName: locationData.locationName,
        description: "多雲時晴",
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        rainChance: 48,
        observationTime: locationData.time.obsTime,
        isLoading: false
      });
    }).catch((err) => {
      console.log('Error', err);
    })
}

// fetch 城市天氣 API
const fetchGetCityWeather = () => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${Authorization_KEY}&locationName=${CITY_NAME}`)
    .then((res) => res.json())
    .then((data) => {
      const locationData = data.records.location[0];
      // 取得天氣現象、降雨機率、舒適度
      const weatherElements = locationData.weatherElement.reduce((needInfo, item) => {
        if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
          needInfo[item.elementName] = item.time[0].parameter;
        }
        return needInfo;
      }, {});
      // data to to date
      return ({
        description: weatherElements.Wx.parameterName,
        rainChance: weatherElements.PoP.parameterName,
        comfortable: weatherElements.CI.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
      });
    }).catch((err) => {
      console.log('Error', err);
    })
}

function App() {
  // fetchData 因為需要共用，所以放在 useEffect 外面
  const fetchData = async () => {
    // 開始前先把loading打開
    setWeather((prev) => {
      return {
        ...prev,
        isLoading: true,
      }
    });
    // 透過陣列解構拿到promise回傳的資料
    const [currentWeather, currentCityWeather] = await Promise.all([
      fetchGetWeather(),
      fetchGetCityWeather()
    ]);
    // 透過物件解構灌入資料
    setWeather({
      ...currentWeather,
      ...currentCityWeather,
      isLoading: false
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 處理日出日落資訊
  const moment = useMemo(() => getMoment(CITY_NAME), []);

  useEffect(() => {
    setTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment])

  const [currentTheme, setTheme] = useState('light');

  const [currentWeather, setWeather] = useState({
    locationName: "",
    description: "",
    temperature: 0,
    windSpeed: 0,
    rainChance: 0,
    observationTime: new Date(),
    isLoading: true,
    comfortable: '',
    weatherCode: 0,
  });

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
