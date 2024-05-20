import React, {useEffect} from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../api";

export default function Welcome({ navigation }: { navigation: any }) {

    const logoImage = require("../assets/battleship.png");

    const checkUserToken = async () => {
        const userToken = await AsyncStorage.getItem('user_token');
        console.log(userToken);
        if (!userToken) {
            navigation.navigate('Login');
            return;
        }

        try {
            const response = await axios.get(`${api}/user/details/me`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            if (response.status === 200) {
                navigation.navigate('Home');
            }
        }
        catch (error) {
            navigation.navigate('Login');
            return;
        }
    };

    const pressHandlerLogin = () => {
        checkUserToken();
    }

    const pressHandlerRegister = () => {
        navigation.navigate('Register');
    }

    useEffect(() => {
        const backAction = () => {
          Alert.alert("Wait!", "Are you sure you want to close the app?", [
            {
              text: "No",
              onPress: () => null,
            },
            { text: "Yes", onPress: () => BackHandler.exitApp() }
          ]);
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);

    return (
        <SafeAreaView className="bg-bgBlue">
            <View className="w-full h-full items-center justify-center">
                <StatusBar style="light" />
                <View className="pt-20 items-center h-full">
                    <Image source={logoImage} className="h-60 w-60" />
                    <View className="pt-16 w-full items-center">
                        <Text className="text-white text-4xl text-center">Welcome to Battleships</Text>
                        <Text className="text-white text-lg text-center p-8 pt-4">Register or login into your account and start the battle!</Text>
                    </View>
                    <View className="pt-8 w-full items-center">
                        <TouchableOpacity onPress={pressHandlerLogin} className="bg-[#4281FE] p-4 w-80 rounded-xl">
                            <Text className="text-white text-center">Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pressHandlerRegister} className="p-4 w-80 rounded-lg mt-4 border-[#4281FE] border-2">
                            <Text className="text-white text-center">Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}