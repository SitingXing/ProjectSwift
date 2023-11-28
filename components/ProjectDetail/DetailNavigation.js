import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState } from "react";


function DetailNavigation({selected, setSelected, navigationList}) {

    return (
        <View style={styles.container}>
            {navigationList.map((item, index) => {
                return (
                    <View key={index}>
                        <TouchableOpacity
                            style={selected === index ? styles.selectedBtn : styles.btn}
                            onPress={() => setSelected(index)}
                        >
                            <Text
                                style={selected === index ? [
                                    styles.selectedText,
                                    { fontFamily: "Poppins_600SemiBold" },
                                ] : [
                                    styles.text,
                                    { fontFamily: "Poppins_500Medium" },
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '89%',
        height: 42.5,
        backgroundColor: '#F7F7F7',
        borderRadius: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 15,
    },
    selectedBtn: {
        backgroundColor: '#C4E868',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 8,
    },
    btn: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 8,
    },
    selectedText: {
        fontSize: 14,
        color: '#265504',
        marginTop: 2,
    },
    text: {
        fontSize: 14,
        color: '#828282',
        marginTop: 2,
    },
})

export default DetailNavigation;