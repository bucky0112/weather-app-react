import React, { useMemo } from 'react';
import styled from '@emotion/styled/';

import { ReactComponent as DayCloudy } from './../assets/images/day-cloudy.svg';
import { ReactComponent as DayClear } from './../assets/images/day-clear.svg';
import { ReactComponent as DayCloudyFog } from './../assets/images/day-cloudy-fog.svg';
import { ReactComponent as DayFog } from './../assets/images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './../assets/images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './../assets/images/day-snowing.svg';
import { ReactComponent as DayThunderstorm } from './../assets/images/day-thunderstorm.svg';
import { ReactComponent as NightClear } from './../assets/images/night-clear.svg';
import { ReactComponent as NightCloudy } from './../assets/images/night-cloudy.svg';
import { ReactComponent as NightCloudyFog } from './../assets/images/night-cloudy-fog.svg';
import { ReactComponent as NightFog } from './../assets/images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './../assets/images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './../assets/images/night-snowing.svg';
import { ReactComponent as NightThunderstorm } from './../assets/images/night-thunderstorm.svg';

const IconContainer = styled.div`
  flex-basis: 30%;
  svg {
    max-height: 110px;
  }
`;

const weatherTypes = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    19,
    20,
    29,
    30,
    31,
    32,
    38,
    39,
  ],
  isSnowing: [23, 37, 42],
};

const weatherIcons = {
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />,
  },
  night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />,
  },
};

const findWeatherType = (weatherCode) => {
  const [weatherType] = Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
    weatherCodes.includes(Number(weatherCode))
  ) || [];
  return weatherType;
}

const WeatherIcon = ({ weatherCode, moment }) => {
  const weatherType = useMemo(() => findWeatherType(weatherCode), [weatherCode]);
  const weatherIcon = weatherIcons[moment][weatherType];
  return <IconContainer>{weatherIcon}</IconContainer>
}

export default WeatherIcon;
