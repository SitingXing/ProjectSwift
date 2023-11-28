import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Icon } from "@rneui/themed";


function TaskDetailScreen({route}) {
    const {task} = route.params;
    console.log(task)

    return (
        <View>
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
                <Text style={[styles.header, { fontFamily: "Poppins_600SemiBold" }]}>
                    Task Detail
                </Text>
            </View>
            {/* content */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        height: "100%",
        width: "100%",
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
    header: {
        fontSize: 20,
        marginTop: 6,
        color: "#1A1E1F",
    },
})

export default TaskDetailScreen;