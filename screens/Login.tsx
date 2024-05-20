import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Controller, set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ScrollView } from "react-native";
import axios from "axios";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }: { navigation: any }) {

    const loginImage = require("../assets/captain.png");
    const [error, setError] = useState("")

    const schema = yup.object().shape({
        email: yup.string().required("The email address is required").email("The email must be a valid email address").typeError("The email must be a valid email address"),
        password: yup.string().required("The password is required").typeError("The password is required")
    });

    const { control, register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

    const handleLogionrSubmit = async (data: any) => {
        try {
            const response = await axios.post(`${api}/auth/login`, {
                email: data.email,
                password: data.password
            });

            if (response.status === 200) {
                await AsyncStorage.setItem('user_token', response.data.accessToken);
                navigation.navigate('Home');
            }
        } catch (error) {
            setError("Invalid email or password");
        }
    }

    const onSubmit = (data: any) => {
        handleLogionrSubmit(data);
    }

    return (
        <SafeAreaView className="bg-bgBlue">
            <ScrollView className="h-full">
                <View className="w-full h-full items-center justify-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="items-center flex-row self-start pt-12 px-6">
                        <Ionicons name="arrow-back" size={36} color="white" />
                        <Text className="text-white text-2xl">Login</Text>
                    </TouchableOpacity>
                    <View className="pt-12 items-center h-full">
                        <Image source={loginImage} className="h-60 w-60" />
                        <View className="pt-8 w-full items-center">
                            <Text className="text-white text-2xl text-center">Welcome back, captain!</Text>
                            <Text className="text-white text-lg text-center">Login into your account</Text>
                        </View>
                        <View className="pt-8 w-full items-center space-y-6">
                            <View>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="w-80 bg-white text-[16px] px-4 py-3 rounded-2xl border-[0.5px] border-black"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Email"
                                        />
                                    )}
                                    name="email"
                                    rules={{ required: 'Email is required' }}
                                    defaultValue=""
                                />
                                {errors.email && <Text className="text-red-500 ml-3 text-sm">{errors.email.message}</Text>}
                            </View>
                            <View>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="w-80 bg-white text-[16px] px-4 py-3 rounded-2xl border-[0.5px] border-black"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Password"
                                            secureTextEntry={true}
                                        />
                                    )}
                                    name="password"
                                    rules={{ required: 'Password is required' }}
                                    defaultValue=""
                                />
                                {errors.password && <Text className="text-red-500 ml-3 text-sm">{errors.password.message}</Text>}
                                {error && <Text className="pt-2 text-red-500 text-center ml-3 text-sm">{error}</Text>}
                            </View>
                            <TouchableOpacity onPress={handleSubmit(onSubmit)} className="bg-[#4281FE] p-4 w-80 rounded-xl">
                                <Text className="text-white text-center">Login</Text>
                            </TouchableOpacity>
                            <View className="flex-row space-x-1">
                                <Text className="text-white text-base">Don't have an account?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text className="text-[#4281FE] underline text-base">Register</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
