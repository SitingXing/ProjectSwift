import { View, StyleSheet } from "react-native";
import { Input } from "@rneui/themed";
import { useState } from "react";

function AttachedLinks({handleLinkNameInput, handleLinkInput, link}) {
    const [name, setName] = useState(link.name);
    const [linkValue, setLinkValue] = useState(link.link);

    return (
        <View style={styles.container}>
            <View style={styles.nameInput}>
                <Input
                    style={styles.inputBox}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={[
                        styles.inputStyle,
                        { fontFamily: "Poppins_400Regular" },
                    ]}
                    placeholder="Name"
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        handleLinkNameInput(text);
                    }}
                />
            </View>
            <View style={styles.linkInput}>
                <Input
                    style={styles.linkInputBox}
                    inputContainerStyle={styles.linkInputContainer}
                    inputStyle={[
                        styles.inputStyle,
                        { fontFamily: "Poppins_400Regular" },
                    ]}
                    placeholder="link"
                    value={linkValue}
                    onChangeText={(text) => {
                        setLinkValue(text);
                        handleLinkInput(text);
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: -10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    nameInput: {
        width: '40%',
    },
    linkInput: {
        width: '60%',
        marginTop: 2,
    },
    inputBox: {
        backgroundColor: "#F7F7F7",
        borderRadius: 20,
        paddingHorizontal: 20,
        marginTop: 5,
        marginBottom: -10,
    },
    linkInputBox: {
        paddingHorizontal: 5,
        paddingTop: 6,
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
    },
    linkInputContainer: {
        borderColor: '#B7B7B7',
    },
    inputStyle: {
        color: "#1A1E1F",
        fontSize: 16,
    },
})

export default AttachedLinks;