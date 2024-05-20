import React, {useContext} from "react";
import { View, Text, Image, Touchable, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import api from "../api";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RefreshContext from './RefreshContext';

interface GameOnListProps {
    gameName: string;
    gameId: string;
    status: string;
    players: number;
    navigation: any;
}

const GameOnList: React.FC<GameOnListProps> = ({ gameName, players, gameId, status, navigation }) => {
    const battleShipWhite = require("../assets/battleshipwhite.png");
    const { toggleRefresh } = useContext(RefreshContext);

    const joinGame = async (gameId: string) => {
        const userToken = await AsyncStorage.getItem('user_token');

        try {
            const response = await axios.post(`${api}/game/join/${gameId}`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            console.log(response);
            if (response.status === 200) {
                Alert.alert("Success", "You have joined the game");
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            }
        }
        catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not join the game");
        }
    }

    return (
        <View className="w-full items-center pt-4">
            <View className="bg-bgBlueGreen w-full rounded-2xl p-2 flex-row justify-between items-center">
                <View className="items-center">
                    <Text className="text-white text-lg text-center">{gameName}</Text>
                </View>
                <View className="items-center space-x-2">
                    <Text className="text-white text-lg text-center">Players: {players}/2</Text>
                    <Text className="text-white text-lg text-center">Status: {status}</Text>
                </View>
                <TouchableOpacity onPress={() => joinGame(gameId)} className="items-center bg-bgBlueLight p-2 rounded-xl" disabled={players === 2} style={{ opacity: players === 2 ? 0.5 : 1 }}>
                    <Image source={battleShipWhite} className="h-10 w-10" />
                    <Text className="text-white text-lg text-center">Join</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default GameOnList;