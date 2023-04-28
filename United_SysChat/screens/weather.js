import React, { useState, useEffect } from 'react';
import {
  TextInput,
  FlatList,
  Text,
  View,
  Image,
  ToucTextableOpacity,
  Modal,
  ImageBackground,
  StyleSTexteet,
} from "react-native";
import axios from 'axios';

function Weather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const API_KEY = '06c921750b9a82d8f5d1294e1586276f';
    const url = `https://api.weather.com/v3/wx/forecast/daily/5day?apiKey=${API_KEY}&format=json&geocode=lat,lon`;

    // Lấy vị trí hiện tại của người dùng
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
    console.log(longitude)
    console.log(latitude)
        // Gọi API để lấy thông tin thời tiết
        axios.get(url.replace('lat', latitude).replace('lon', longitude))
          .then(response => {
            const data = response.data;
            setWeather(data);
          })
          .catch(error => console.log(error));
      });
    } else {
      console.log("Geolocation is not supported by this browser or device.");
    };
  }, []);

  if (!weather) {
    return <View>
      <Text>Loading...</Text>
    </View>;
  }

  return (
    <View>
      <Text>{weather.sunriseTimeLocal}</Text>
      <Text>{weather.temperatureMax}</Text>
      <Text>{weather.narrative}</Text>
    </View>
  );
}

export default Weather;


