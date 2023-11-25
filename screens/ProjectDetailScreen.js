import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Icon } from "@rneui/themed";
import { LinearGradient } from 'expo-linear-gradient';

import DetailNavigation from "../components/ProjectDetail/DetailNavigation";
import OverviewPage from "../components/ProjectDetail/OverviewPage";


function ProjectDetailScreen({route, navigation}) {
    const { item } = route.params;

    return (
        <View style={styles.container}>
            {/* header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity>
                    <Icon
                        style={styles.backIcon}
                        name="chevron-back"
                        type="ionicon"
                        size={30}
                        color="#1A1E1F"
                    />
                </TouchableOpacity>
                <Image source={{uri: item.basicInfo.logo}} style={styles.logo} />
                <Text style={[styles.header, { fontFamily: "Poppins_600SemiBold" }]}>{item.basicInfo.name}</Text>
            </View>
            {/* navigation */}
            <DetailNavigation />
            {/* content */}
            <OverviewPage item={item} />
            {/* gradient */}
            <LinearGradient
                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.75)']}
                style={styles.gradientBlock}
                pointerEvents="none"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%',
    },
    headerContainer: {
        marginTop: 70,
        marginLeft: 20,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginBottom: 15,
    },
    backIcon: {
        marginTop: 5,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 5,
    },
    header: {
        fontSize: 20,
        marginTop: 6,
        color: "#1A1E1F",
    },
    gradientBlock: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
})

export default ProjectDetailScreen;