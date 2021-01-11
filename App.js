import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from "expo-location";
import axios from "axios";

const API_KEY = "6f96378ba99c9ea5aff4a2fc75d50a86";

export default class extends React.Component {
 
  state = {
    isLoading: true
  };

  getWeather = async (longitude, latitude) => {
    
    const { 
      data: {
        main: { temp },
        weather
      } 
    } = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric `
      );
      
      this.setState({
        isLoading: false, 
        condition: weather[0].main,
        temp
      });
       
  }

  getLocation = async () => {

    try {

      await Location.requestPermissionsAsync();

      const { 
        coords : { latitude, longitude} 
      } = await Location.getCurrentPositionAsync();
      
      this.getWeather(longitude, latitude);
      
    } catch (error){
      Alert.alert("can't find you.", "so sad");
    }
  };

  componentDidMount() {
    this.getLocation();
  }

  render(){

    const { isLoading, temp, condition } = this.state;

    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />;
  } 
}