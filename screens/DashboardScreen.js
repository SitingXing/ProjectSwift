import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Icon } from "@rneui/themed";
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { getAuthUser, subscribeToAuthChanges } from "../AuthManager";
import { setUser, subscribeToProjectsUpdates, setUserList } from "../data/Actions";


function DashboardScreen({navigation}) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser);

    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    useEffect(() => {
        dispatch(subscribeToProjectsUpdates(getAuthUser().uid));
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.date, {fontFamily: "Poppins_600SemiBold"}]}>{date}</Text>
                <View style={styles.profile}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Setting')}
                    >
                        <Image
                            style={styles.profileImage}
                            source={{uri: currentUser.profile.uri}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {/* gradient */}
            <LinearGradient
                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.6)']}
                style={styles.gradientBlock}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#C4E868',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 120,
        paddingTop: 55,
        paddingHorizontal: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    date: {
        width: '90%',
        color: '#265504',
        fontSize: 22,
    },
    profile: {
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    gradientBlock: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
})

export default DashboardScreen;