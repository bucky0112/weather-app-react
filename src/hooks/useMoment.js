import { useState, useEffect, useMemo } from 'react';
import { getMoment } from './../utils/helpers';

export default function useMoment ({ sunriseCityName }) {
  // 處理日出日落資訊
  const [currentTheme, setTheme] = useState('light');

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  useEffect(() => {
    setTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment]);
  
  return [currentTheme, moment]
}
