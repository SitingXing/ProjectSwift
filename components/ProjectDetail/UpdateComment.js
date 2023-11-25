import { View,StyleSheet, Text, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";

function UpdateComment() {

    return (
        <TouchableOpacity style={styles.container}>
            <Text style={[styles.title, {fontFamily: 'Poppins_500Medium'}]}>Create Github</Text>
            <Text style={[styles.content, {fontFamily: 'Poppins_400Regular'}]}>User left a comment here</Text>
            <View style={styles.commentContainer}>
                <Icon
                    style={styles.teamProfile}
                    name="circle"
                    type="font-awesome"
                    size={30}
                    color="#B7B7B7"
                />
                <View style={styles.comment}>
                    <Text style={[styles.commentText, {fontFamily: 'Poppins_400Regular'}]}>
                        Comment Comment Comment Com...
                    </Text>
                </View>
            </View>
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
        paddingBottom: 12,
    },
    title: {
        fontSize: 15,
    },
    content: {
        fontSize: 13,
        color: '#828282',
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    comment: {
        marginLeft: 15,
        width: '85%',
        backgroundColor: '#DCF3A0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 50,
    },
    commentText: {
        fontSize: 13,
        color: '#265504',
    },
})

export default UpdateComment;