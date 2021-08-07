import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, FlatList, TouchableHighlight, View, StyleSheet } from 'react-native';
import { create } from 'apisauce'
import Reactotron from "reactotron-react-native";
import moment from 'moment'

const DisplayWeather = () => {
    const [weatherData, setWeatherData] = useState([])
    const [cityData, setCityData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const api = create({
        baseURL: 'https://api.openweathermap.org/data/2.5',
        headers: { Accept: 'application/vnd.github.v3+json' },
    })
    useEffect(() => {
        setIsLoading(true)
        api
        .get('/forecast?q=sikar,in&mode=json&appid=aad8e08dbd6089982fa33e852f735b89')
        .then(response => response)
        .then(res=>{
            Reactotron.log("cod", res.data.cod)
            if(res.data.cod === '200'){
                const data = res.data.list
                const key = 'dt_txt';
                const arrayUniqueByKey = [...new Map(data.map(item =>[moment(item[key]).format('ll'), item])).values()];
                setWeatherData(arrayUniqueByKey)
                setCityData(res.data.city)
                setIsLoading(false)
            }else{
                setIsError(true)
                setIsLoading(false)
            }
        })
    },[]);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {isLoading ?
                    <Text>loading data</Text>
                :
                    <>
                        <View style={styles.topBar}>
                            <Text style={styles.cityName}>{cityData.name}</Text>
                        </View>
                        <TouchableHighlight>
                            <View style={styles.card}>
                                <Text>Date</Text>
                                <Text style={styles.dayValue}>Weather Condition</Text>
                            </View>
                        </TouchableHighlight>
                        {weatherData.map((val, index)=>{
                            return(
                                <TouchableHighlight key={val.dt}>
                                    <View style={styles.card}>
                                        <Text>{moment(val.dt_txt).format('ll')}</Text>
                                        <Text style={styles.dayValue}>{val?.weather[0]?.main}</Text>
                                    </View>
                                </TouchableHighlight>
                            )
                        })}
                    </>
                }
                {isError && <Text>Error while loading data</Text>}
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    cityName: {
      fontSize: 24,
      textAlign: 'center'
    },
    topBar:{
        margin: 20,
        marginBottom: "20%"
    },
    container:{
        alignSelf: "center"
    },
    card:{
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 2,
        padding: 10,
        margin: 10,
        width: "90%",
        flexDirection: "row"
    },
    dayValue:{
        marginLeft: "auto"
    }
});
export default DisplayWeather;

