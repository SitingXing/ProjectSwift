import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Input, Icon } from "@rneui/themed";


function StageEditItem({stage, onChangeText, setSelected, setShowStart, setShowEnd, onPressMinus}) {

    return (
        <View style={styles.stageContainer}>
            <View>
                <View style={styles.minusContainer}>
                    <Text style={[styles.lebal, {fontFamily: 'Poppins_500Medium'}]}>Stage</Text>
                    <TouchableOpacity
                        onPress={() => onPressMinus(stage)}
                    >
                        <Icon
                            name="minuscircle"
                            type="antdesign"
                            size={20}
                            color='#F06060'
                        />
                    </TouchableOpacity>
                </View>
                <Input
                    style={styles.inputBox}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={[
                        styles.inputStyle,
                        { fontFamily: "Poppins_400Regular" },
                    ]}
                    value={stage.stageName}
                    onChangeText={(text) => onChangeText(text)}
                />
            </View>
            <View>
                <Text style={[styles.lebal, {fontFamily: 'Poppins_500Medium'}]}>Dates</Text>
                <View style={styles.datesContainer}>
                    <TouchableOpacity
                        style={styles.dateBtn}
                        onPress={() => {
                            setSelected();
                            setShowStart(true);
                        }}
                    >
                        <Text style={[styles.date, { fontFamily: "Poppins_400Regular" }]}>
                            {new Date(stage.startDate).toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.date, { fontFamily: "Poppins_400Regular" }]}>to</Text>
                    <TouchableOpacity
                        style={styles.dateBtn}
                        onPress={() => {
                            setSelected();
                            setShowEnd(true);
                        }}
                    >
                        <Text style={[styles.date, { fontFamily: "Poppins_400Regular" }]}>
                            {new Date(stage.endDate).toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    stageContainer: {
        borderBottomColor: '#F7F7F7',
        borderBottomWidth: 1,
        paddingBottom: 20,
        marginBottom: 20,
    },
    minusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginRight: 10,
    },
    lebal: {
        fontSize: 16,
        color: '#1A1E1F',
        marginLeft: 10,
        flex: 1,
    },
    inputBox: {
        width: "100%",
        backgroundColor: "#F7F7F7",
        borderRadius: 20,
        paddingHorizontal: 20,
        marginTop: 5,
        marginBottom: -15,
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
    },
    inputStyle: {
        color: "#1A1E1F",
        fontSize: 16,
    },
    datesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    dateBtn: {
        width: "40%",
        height: 35,
        backgroundColor: "#F7F7F7",
        borderRadius: 20,
        alignItems: "center",
        paddingTop: 7,
    },
    date: {
        fontSize: 14,
        color: "#1A1E1F",
    },
})

export default StageEditItem;