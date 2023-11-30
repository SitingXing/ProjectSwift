import { View, StyleSheet, Text, Image } from "react-native";

function TaskItemComment({comment}) {

    return (
        <View style={styles.container}>
            <Image
                style={styles.profile}
                source={{uri: comment.author.profile}}
            />
            <Text style={[styles.commentText, {fontFamily: "Poppins_400Regular"}]}>
                {comment.comment}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    profile: {
        marginRight: 15,
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    commentText: {
        marginTop: 2,
        width: '84%',
        paddingHorizontal: 20,
        paddingVertical: 7.5,
        backgroundColor: '#DCF3A0',
        borderRadius: 10,
        fontSize: 14,
        color: '#265504',
    },
})

export default TaskItemComment;