import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Icon } from "@rneui/themed";

function OverviewLabel({ title, show, setShow }) {
  return (
    <View style={styles.labelContainer}>
      <TouchableOpacity onPress={() => setShow(!show)}>
        {show ? (
          <Icon name="chevron-down" type="ionicon" size={25} color="#1A1E1F" />
        ) : (
          <Icon name="chevron-up" type="ionicon" size={25} color="#1A1E1F" />
        )}
      </TouchableOpacity>
      <Text style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: "#1A1E1F",
    marginLeft: 5,
  },
});

export default OverviewLabel;
