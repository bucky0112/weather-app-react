import React from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import WeatherIcon from './../components/WeatherIcon';

// component as icon
import { ReactComponent as AirFlowIcon } from './../assets/images/airFlow.svg';
import { ReactComponent as RainIcon } from './../assets/images/rain.svg';
import { ReactComponent as RefreshIcon } from './../assets/images/refresh.svg';
import { ReactComponent as LoadingIcon } from './../assets/images/loading.svg';
import { ReactComponent as CogIcon } from './../assets/images/cog.svg';

// style component start ==============
const WeatherCardWrapper = styled.div`
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

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;
// style component end ==============

export default function WeatherCard({
  cityName,
  currentWeather,
  moment,
  fetchData,
  handleCurrentPageSwitch
}) {
  const {
    description,
    windSpeed,
    rainChance,
    isLoading,
    comfortable,
    weatherCode
  } = currentWeather;


  // ??????????????????????????????
  const currentTemperature = (() => Math.round(currentWeather.temperature))();
  const currentTime = (() => {
    return new Intl.DateTimeFormat('zh-tw', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(dayjs(currentWeather.observationTime))
  })();

  // ??????????????????
  const handleSwitch = () => {
    handleCurrentPageSwitch('WeatherSetting')
  }

  return (
    <WeatherCardWrapper>
    <Cog onClick={handleSwitch} />
      <Location>{cityName}</Location>
      <Description>{description} {comfortable}</Description>
      <CurrentWeather>
        <Temperature>
          {currentTemperature} <Celsius>??C</Celsius>
        </Temperature>
        <WeatherIcon weatherCode={weatherCode} moment={moment} />
      </CurrentWeather>
      <AirFlow><AirFlowIcon />{windSpeed} m/h</AirFlow>
      <Rain><RainIcon />{rainChance} %</Rain>
      <Refresh
        onClick={fetchData}
        isLoading={isLoading}
      >
        ?????????????????????{currentTime}
        {isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  )
}