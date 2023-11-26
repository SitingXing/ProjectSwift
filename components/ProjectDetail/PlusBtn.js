import { View, StyleSheet, TouchableOpacity, Text, Modal } from "react-native";
import { Icon, Overlay } from "@rneui/themed";
import { useState } from "react";

function PlusBtn() {
    const [overlayShow, setOverlayShow] = useState(false);

    return (
        <View>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => setOverlayShow(!overlayShow)}
            >
                <Icon
                    type="octicon"
                    name="plus"
                    size={36}
                    color='#265504'
                />
            </TouchableOpacity>
            <Overlay
                isVisible={overlayShow}
                onBackdropPress={() => {setOverlayShow(false)}}
                overlayStyle={styles.overlayStyle}
                animationType="fade"
            >
                <View style={styles.plusContainer}>
                    <TouchableOpacity style={styles.plusItem}>
                        <Icon
                            type="octicon"
                            name="plus"
                            size={24}
                            color='#C4E868'
                        />
                        <Text style={[styles.text, {fontFamily: 'Poppins_500Medium'}]}>New Task</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.plusItem}>
                        <Icon
                            type="octicon"
                            name="plus"
                            size={24}
                            color='#C4E868'
                        />
                        <Text style={[styles.text, {fontFamily: 'Poppins_500Medium'}]}>New Stage</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.openedBtn}
                    onPress={() => setOverlayShow(!overlayShow)}
                >
                    <Icon
                        type="octicon"
                        name="dash"
                        size={36}
                        color='#265504'
                    />
                </TouchableOpacity>
            </Overlay>
        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        position: 'absolute',
        right: 15,
        bottom: 10,
        width: 65,
        height: 65,
        borderRadius: 65,
        backgroundColor: '#C4E868',
        justifyContent: 'center',
        zIndex: 2,
    },
    overlayStyle: {
        position: 'absolute',
        right: 27.5,
        bottom: '21%',
        height: 90,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12.5,
    },
    plusContainer: {
        alignItems: 'flex-start',
        rowGap: 5,
        marginTop: 4,
    },
    plusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 10,
    },
    text: {
        fontSize: 16,
        color: '#265504',
        marginTop: 2,
    },
    openedBtn: {
        position: 'absolute',
        right: -12.5,
        bottom: -93,
        width: 65,
        height: 65,
        borderRadius: 65,
        backgroundColor: 'white',
        justifyContent: 'center',
        zIndex: 2,
    },
})

export default PlusBtn;