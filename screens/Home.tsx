import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, BackHandler, Touchable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Controller, set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ScrollView } from "react-native";
import axios from "axios";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PingAnimation from "../components/PingAnimation";
import { useIsFocused } from '@react-navigation/native';
import RefreshContext from "../components/RefreshContext";

export default function Home({ navigation }: { navigation: any }) {
    const [user, setUser] = useState<any>(null);
    const [refresh, setRefresh] = useState(false);

    const getUserDetails = async () => {
        const userToken = await AsyncStorage.getItem('user_token');

        try {
            const response = await axios.get(`${api}/user/details/me`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            if (response.status === 200) {
                setUser(response.data);
            }
        }
        catch (error) {
            await AsyncStorage.removeItem('user_token');
            navigation.navigate('Login');
        }
    };

    useEffect(() => {
        getUserDetails();

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
    }, [refresh]);

    const homeImage = require("../assets/ship.png");

    const logoutSubmit = async () => {
        await AsyncStorage.removeItem('user_token');
        navigation.navigate('Welcome');
    }

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "No",
                onPress: () => null,
            },
            { text: "Yes", onPress: () => logoutSubmit() }
        ]);
    }


    const handleCreateGame = async () => {
        const userToken = await AsyncStorage.getItem('user_token');

        try {
            const response = await axios.post(`${api}/game`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            if (response.status === 200) {
                Alert.alert("Success", "Game created successfully");
                setRefresh(!refresh);
            }
        }
        catch (error) {
            Alert.alert("Error", "Could not create the game");
        }
    }

    return (
        <SafeAreaView className="bg-bgBlue">
            <ScrollView className="h-full">
                <View className="w-full h-full items-center justify-center">
                    <Image source={homeImage} className="h-60 w-60" />
                    <View className="pt-4 p-6 w-full items-center space-y-8">
                        <Text className="text-center text-white text-2xl">Choose the next battle</Text>
                        <View className="flex-row w-full items-center justify-center space-x-5">
                            <TouchableOpacity onPress={() => handleCreateGame()} className="bg-bgBlueLight w-32 h-12 items-center justify-center rounded-xl">
                                <Text className="text-center text-white text-lg">Create game</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('ListGamesPage')} className="bg-bgBlueLight w-32 h-12 items-center justify-center rounded-xl">
                                <Text className="text-center text-white text-lg">Join game</Text>
                            </TouchableOpacity>
                        </View>
                        <View className='w-full rounded-2xl bg-[#305c96] p-6 space-y-2 overflow-hidden'>
                            <View className="flex-row items-center justify-center">
                                <Text className="text-white text-center text-2xl">User details</Text>
                                <PingAnimation color="#1df700" />
                            </View>
                            {
                                user &&
                                <View className="pt-4">
                                    <View className='flex-row space-x-2'><Text className="text-white/[0.75] text-lg">USER:</Text><Text className='text-white text-xl flex-shrink'>{user.user.email}</Text></View>
                                    <View className='flex-row space-x-2'><Text className="text-white/[0.75] text-lg">GAMES PLAYED:</Text><Text className='text-white text-xl flex-shrink'>{user.gamesPlayed}</Text></View>
                                    <View className='flex-row space-x-2'><Text className="text-white/[0.75] text-lg">GAMES WON:</Text><Text className='text-white text-xl flex-shrink'>{user.gamesWon}</Text></View>
                                    <View className='flex-row space-x-2'><Text className="text-white/[0.75] text-lg">GAMES LOST:</Text><Text className='text-white text-xl flex-shrink'>{user.gamesLost}</Text></View>
                                    <View className='flex-row space-x-2'><Text className="text-white/[0.75] text-lg">CURRENTLY PLAYING:</Text><Text className='text-white text-xl flex-shrink'>{user.gamesLost}</Text></View>
                                </View>
                            }
                            <View className='w-full pt-8'>
                                <TouchableOpacity onPress={handleLogout} className="bg-red-700 w-32 h-12 items-center self-center justify-center rounded-xl">
                                    <Text className="text-center text-white text-lg">Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}