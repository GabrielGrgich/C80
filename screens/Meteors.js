import React, { Component } from 'react';
import { Text, View, Alert, ImageBackground, SafeAreaView, FlatList, Platform, StyleSheet, Dimensions, Image, StatusBar } from 'react-native';
import axios from "axios";

export default class MeteorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meteors: {},
        };
    }

    renderItem =({item})=>{
        let meteor = item
        let bjImage,speed,size
        if(meteor.threat_score<=30){
        bjImage = require("../assets/meteor_bg1.png")
        speed = require("../assets/meteor_speed3.gif")
        size = 100
        } else if (meteor.threat_score<=75){
            bjImage = require("../assets/meteor_bg2.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 150 
        }else {
            bjImage = require("../assets/meteor_bg3.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 200  
        }
        return(

            <View>
            <ImageBackground source = {bgImage} style = {styles.backgroundImage}>
            <View style = {styles.gifContainer}>
            <Image source = {speed} style = {{width:size, height: size, alignSelf:"center"}}/>
            <View>
            <Text style = {[styles.cardTitle,{marginTop: 400, marginLeft: 50}]}>{item.name}</Text>
            <Text style = {[styles.cardtext,{marginTop: 20, marginLeft: 50}]}>closest to earth: {item.close_approach_data[0].close_approach_date_full}</Text>
        <Text style = {[styles.cardtext,{marginTop: 5, marginLeft: 50}]}>minimum diameter (km)-{item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
        <Text style = {[styles.cardtext,{marginTop: 5, marginLeft: 50}]}>maximum diameter (km)-{item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
        <Text style = {[styles.cardtext,{marginTop: 5, marginLeft: 50}]}> velocity (km per hour){item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
        <Text style = {[styles.cardtext,{marginTop: 5, marginLeft: 50}]}>missing earth by (km){item.close_approach_data[0].miss_distance.kilometers}</Text>
            </View>
            </View>
            </ImageBackground>
            </View>

        )

    }

    componentDidMount() {
        this.getMeteors()
    }

    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=nAkq24DJ2dHxzqXyzfdreTvczCVOnwJuFLFq4bDZ")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    keyExtractor = (item,index)=>index.toString()

    render() {
        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )
        } else {
            let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => {
                return this.state.meteors[meteor_date]
            })
            let meteors = [].concat.apply([], meteor_arr);

            meteors.forEach(function (element) {
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
                let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000
                element.threat_score = threatScore;
            });

            meteors.sort(function(a,b){
            return b.threat_score-a.threat_score
            })

            meteors = meteors.slice(0,5)

            return (
                <View
                    style={styles.container}>
                    <SafeAreaView style = {styles.andriodSafeArea}/>
                    <FlatList keyExtractor = {this.keyExtractor} 
                    data = {meteors}
                    renderItem = {this.renderItem}
                    horizontal = {true}
                    />
                    <Text>Meteor Screen wip</Text>
                </View>
            )
        }
    }
}


const styles = StyleSheet.create({
    container:{
    flex:1,
    },
    andriodSafeArea:{
    marginTop: Platform.OS==="android"?statusbar.currentHeight:0,
    },
    backgroundImage:{
    flex:1,
    resizeMode:"cover",
    width: Demensions.get("window").width,
    height: Demensions.get("window").height,
    },
    cardTitle:{
    fontSize: 20,
    marginBottom:10,
    fontWieght:"bold",
    color:"white",
    },
    cardtext:{
        color:"white",
    },
    gifContainer:{
    justifyContent: "center",
    alignItems: "center",
    flex: 1
    },
})
