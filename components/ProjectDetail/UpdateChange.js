import { View,StyleSheet, Text, TouchableOpacity } from "react-native";

function UpdateChange() {

    return (
        <TouchableOpacity style={styles.container}>
            <Text style={[styles.title, {fontFamily: 'Poppins_500Medium'}]}>Create Github</Text>
            <Text style={[styles.content, {fontFamily: 'Poppins_400Regular'}]}>User made a change to this task.</Text>
        </TouchableOpacity>
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
    },
    title: {
        fontSize: 15,
    },
    content: {
        fontSize: 13,
        color: '#828282',
    },
})

export default UpdateChange;