import { View, Text, Alert, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { LinearGradient } from 'expo-linear-gradient';

import { signOut, getAuthUser } from "../AuthManager";
import { unsubscribeFromProjects } from "../data/Actions";


function SettingsScreen() {
    const currentAuthUser = getAuthUser();

    return (
        <View style={styles.container}>
            <Text>Settings</Text>
            <Text>{currentAuthUser.displayName}</Text>
            <Text>{currentAuthUser.email}</Text>
            <Button
                onPress={async() => {
                    try {
                        unsubscribeFromProjects();
                        await signOut();
                    } catch (error) {
                        Alert.alert("Sign Out Error", error.message, [{ text: "OK" }]);
                    }
                }}
            >
                signOut
            </Button>
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
        paddingTop: 50,
        paddingHorizontal: 40,
    },
    gradientBlock: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
})

export default SettingsScreen;