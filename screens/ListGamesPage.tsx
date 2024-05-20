import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, BackHandler, Touchable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import axios from "axios";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GameOnList from "../components/GameOnList";
import Spinner from "react-native-loading-spinner-overlay";

export default function ListGamesPage({ navigation }: { navigation: any }) {

    const [availableGames, setAvailableGames] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const battleShipWhite = require("../assets/battleshipwhite.png");

    const getAvailableGames = async () => {
        const userToken = await AsyncStorage.getItem('user_token');

        try {
            const response = await axios.get(`${api}/game`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            if (response.status === 200) {
                const gamesWithoutPlayer2 = response.data.games.filter((game: any) => game.player2Id === null);
                setAvailableGames({ ...response.data, games: gamesWithoutPlayer2 });
                setLoaded(true);
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAvailableGames();

        const backAction = () => {
            navigation.navigate('Home');
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
            <View className="w-full h-full bg-bgBlue">
                <View className="w-full flex-row p-5 items-center justify-between">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
                        <Ionicons name="arrow-back" size={36} color="white" />
                        <Text className="text-white text-2xl">List games</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View className="pt-4 items-center h-full">
                        <Text className="text-white text-xl text-center">Select one of the available games</Text>
                        <Text className="text-white text-lg text-center">Prepare for battle!</Text>
                        {
                            loaded === false ? (
                                <Spinner
                                    visible={true}
                                    textContent={'Loading games...'}
                                    textStyle={{ color: 'white' }}
                                />
                            )
                                :
                                (
                                    <View>
                                        <View className="flex-row space-x-1 items-center justify-center pt-4">
                                            <Text className="text-white text-lg text-center">Number of available games found:</Text>
                                            <Text className="text-white text-lg text-center">{(availableGames as { games: any[] } | null)?.games.length || 0}</Text>
                                        </View>
                                        <View className="p-4 w-full items-center">
                                            {
                                                (availableGames as { games: any[] } | null)?.games.sort((a, b) => (a.player2Id === null ? -1 : 1)).map((game, index) => (
                                                    <GameOnList key={game.id} gameId={game.id} gameName={"Game " + `${index + 1}`} players={game.player2Id === null ? 1 : 2} status={game.status} navigation={navigation} />
                                                ))
                                            }
                                        </View>
                                    </View>
                                )
                        }
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}