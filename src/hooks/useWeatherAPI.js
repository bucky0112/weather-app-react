import { useState, useEffect, useCallback } from 'react';


// fetch 氣象站 API
const fetchGetWeather = ({ authorizationKey, locationName }) => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
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
const fetchGetCityWeather = ({ authorizationKey, cityName }) => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
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

export default function useWeatherAPI({ authorizationKey, locationName, cityName }) {
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

  // fetchData 因為需要共用，所以放在 useEffect 外面
  const fetchData = useCallback(async () => {
    // 開始前先把loading打開
    setWeather((prev) => {
      return {
        ...prev,
        isLoading: true,
      }
    });
    // 透過陣列解構拿到promise回傳的資料
    const [currentWeather, currentCityWeather] = await Promise.all([
      fetchGetWeather({ authorizationKey, locationName }),
      fetchGetCityWeather({ authorizationKey, cityName })
    ]);
    // 透過物件解構灌入資料
    setWeather({
      ...currentWeather,
      ...currentCityWeather,
      isLoading: false
    });
  }, [authorizationKey, locationName, cityName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // 最後回傳讓其他元件接收資料
  return [currentWeather, fetchData]
}
