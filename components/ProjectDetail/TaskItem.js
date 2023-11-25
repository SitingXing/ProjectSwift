import { View,StyleSheet, Text, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";
import { useState } from "react";

function TaskItem() {
    const [checked, setChecked] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.checkBox} onPress={() => setChecked(!checked)}>
                <View style={checked ? styles.checkedCircle : styles.circle}>
                    {checked && (
                        <Icon
                            style={styles.checkmark}
                            name="check"
                            type="entypo"
                            size={20}
                            color="#265504"
                        />
                    )}
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contentContainer}>
                <View style={styles.contentBox}>
                    <Text style={[styles.title, {fontFamily: 'Poppins_500Medium'}]}>Create Github</Text>
                    <Text style={[styles.content, {fontFamily: 'Poppins_400Regular'}]}>10/24/2023</Text>
                </View>
                <View style={styles.assignContainer}>
                    <Icon
                        style={styles.profile}
                        name="circle"
                        type="font-awesome"
                        size={30}
                        color="#B7B7B7"
                    />
                    <Icon
                        style={styles.profile}
                        name="circle"
                        type="font-awesome"
                        size={30}
                        color="#B7B7B7"
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#DFDFDF',
        borderRadius: 10,
        paddingVertical: 7.5,
        paddingHorizontal: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    circle: {
        position: 'relative',
        width: 30,
        height: 30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#DFDFDF',
    },
    checkedCircle: {
        position: 'relative',
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: '#C4E868',
    },
    checkmark: {
        marginTop: 5,
    },
    title: {
        fontSize: 15,
    },
    content: {
        fontSize: 13,
        color: '#828282',
    },
    contentContainer: {
        width: '85%',
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    assignContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profile: {
        marginLeft: 5,
    },
})

export default TaskItem;