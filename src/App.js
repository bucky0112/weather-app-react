import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import dayjs from 'dayjs';
import WeatherIcon from './components/WeatherIcon';

// component as icon
import { ReactComponent as AirFlowIcon } from './assets/images/airFlow.svg';
import { ReactComponent as RainIcon } from './assets/images/rain.svg';
import { ReactComponent as RefreshIcon } from './assets/images/refresh.svg';
import { ReactComponent as LoadingIcon } from './assets/images/loading.svg';

// style component start ==============
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg)
    }
  }

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }
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
const CITY_NAME = "臺中市";

// fetch 氣象站 API
const fetchGetWeather = () => {
  // setWeather((prevState) => {
  //   return ({
  //     ...prevState,
  //     isLoading: true
  //   })
  // });

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

  // 處理溫度以及時間資訊
  const currentTemperature = (() => Math.round(currentWeather.temperature))();
  const currentTime = (() => {
    return new Intl.DateTimeFormat('zh-tw', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(dayjs(currentWeather.observationTime))
  })();

  const {
    locationName,
    description,
    windSpeed,
    rainChance,
    isLoading,
    comfortable,
    weatherCode
  } = currentWeather;

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>{description} {comfortable}</Description>
          <CurrentWeather>
            <Temperature>
              {currentTemperature} <Celsius>°C</Celsius>
            </Temperature>
            <WeatherIcon weatherCode={weatherCode} time="night" />
          </CurrentWeather>
          <AirFlow><AirFlowIcon />{windSpeed} m/h</AirFlow>
          <Rain><RainIcon />{rainChance} %</Rain>
          <Refresh
            onClick={fetchData}
            isLoading={isLoading}
          >
            最後觀測時間：{currentTime}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
