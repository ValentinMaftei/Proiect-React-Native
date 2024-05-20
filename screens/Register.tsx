import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ScrollView } from "react-native";
import axios from "axios";
import api from "../api";

export default function Register({ navigation }: { navigation: any }) {
    const schema = yup.object().shape({
        email: yup.string().required("The email address is required").email("The email must be a valid email address").typeError("The email must be a valid email address"),
        password: yup.string().min(6, "Password must contain minimum 6 characters").required("The password is required").typeError("The password is required")
    });

    const registerImage = require("../assets/man.png");

    const { control, register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

    const handleRegisterSubmit = async (data: any) => {
        try {
            const response = await axios.post(`${api}/auth/register`, {
                email: data.email,
                password: data.password
            });
            if (response.status === 201){
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onSubmit = (data: any) => {
        handleRegisterSubmit(data);
    }

    return (
        <SafeAreaView className="bg-bgBlue">
            <ScrollView className="h-full">
                <View className="w-full h-full items-center justify-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="items-center flex-row self-start pt-12 px-6">
                        <Ionicons name="arrow-back" size={36} color="white" />
                        <Text className="text-white text-2xl">Register</Text>
                    </TouchableOpacity>
                    <View className="pt-12 items-center h-full">
                        <Image source={registerImage} className="h-60 w-60" />
                        <View className="pt-8 w-full items-center">
                            <Text className="text-white text-2xl text-center">Welcome!</Text>
                            <Text className="text-white text-lg text-center">Register and let the battle begin!</Text>
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
                            </View>
                            <TouchableOpacity onPress={handleSubmit(onSubmit)} className="bg-[#4281FE] p-4 w-80 rounded-xl">
                                <Text className="text-white text-center">Register</Text>
                            </TouchableOpacity>
                            <View className="flex-row space-x-1">
                                <Text className="text-white text-base">Already have an account?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text className="text-[#4281FE] underline text-base">Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}