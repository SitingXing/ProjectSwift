import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Input, Icon } from "@rneui/themed";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { signIn, signUp, subscribeToAuthChanges } from "../AuthManager";
import { addUser } from "../data/Actions";

function SigninBox({ setLoginMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.boxContainer}>
      {/* icon */}
      {/* input */}
      <View style={styles.inputContainer}>
        <View style={styles.loginLabl}>
          <Text style={[styles.label, { fontFamily: "Poppins_400Regular" }]}>
            Email Address:
          </Text>
        </View>
        <View>
          <Input
            style={styles.inputBox}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={[
              styles.inputStyle,
              { fontFamily: "Poppins_400Regular" },
            ]}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.loginLabl}>
          <Text style={[styles.label, { fontFamily: "Poppins_400Regular" }]}>
            Password:
          </Text>
        </View>
        <View>
          <Input
            secureTextEntry
            style={styles.inputBox}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={[
              styles.inputStyle,
              { fontFamily: "Poppins_400Regular" },
            ]}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
      </View>
      {/* button */}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnActive}
          onPress={async () => {
            try {
              await signIn(email, password);
            } catch (error) {
              Alert.alert("Sign Up Error", "Invalid email and password", [
                { text: "OK" },
              ]);
            }
          }}
        >
          <Text
            style={[
              styles.btnActiveText,
              { fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            LOGIN
          </Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: "Poppins_400Regular" }}>OR</Text>
        <TouchableOpacity
          style={styles.btnInactive}
          onPress={() => setLoginMode(false)}
        >
          <Text
            style={[
              styles.btnInactiveText,
              { fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            SIGNUP
          </Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: "Poppins_400Regular" }}>
          If you do not have an account
        </Text>
      </View>
    </View>
  );
}

function SignupBox({ setLoginMode, dispatch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <View style={styles.boxContainer}>
      {/* icon */}
      {/* input */}
      <View style={styles.inputContainer}>
        <View style={styles.signupLabl}>
          <Text style={[styles.label, { fontFamily: "Poppins_400Regular" }]}>
            Username:
          </Text>
        </View>
        <View>
          <Input
            style={styles.inputBox}
            inputContainerStyle={styles.inputContainerStyle}
            value={userName}
            onChangeText={(text) => setUserName(text)}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.signupLabl}>
          <Text style={[styles.label, { fontFamily: "Poppins_400Regular" }]}>
            Email Address:
          </Text>
        </View>
        <View>
          <Input
            style={styles.inputBox}
            inputContainerStyle={styles.inputContainerStyle}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.signupLabl}>
          <Text style={[styles.label, { fontFamily: "Poppins_400Regular" }]}>
            Password:
          </Text>
        </View>
        <View>
          <Input
            secureTextEntry
            style={styles.inputBox}
            inputContainerStyle={styles.inputContainerStyle}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
      </View>
      <View style={styles.inputContainerProfile}>
        <View style={styles.signupLabl}>
          <Text style={[styles.label, { fontFamily: "Poppins_400Regular" }]}>
            Profile:
          </Text>
        </View>
        <View>
          <TouchableOpacity>
            <Icon
              type="ant-design"
              name="pluscircle"
              size={60}
              color="#F7F7F7"
              style={styles.plusIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* button */}
      <View style={styles.btnContainerSignup}>
        <TouchableOpacity
          style={styles.btnActive}
          onPress={async () => {
            try {
              const newUser = await signUp(userName, email, password);
              dispatch(addUser(newUser));
            } catch (error) {
              Alert.alert("Sign Up Error", "Email already being signed", [
                { text: "OK" },
              ]);
            }
          }}
        >
          <Text
            style={[
              styles.btnActiveText,
              { fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            SIGNUP
          </Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: "Poppins_400Regular", marginLeft: 5 }}>
          OR
        </Text>
        <TouchableOpacity
          style={styles.btnInactive}
          onPress={() => setLoginMode(true)}
        >
          <Text
            style={[
              styles.btnInactiveText,
              { fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            LOGIN
          </Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: "Poppins_400Regular", marginLeft: 5 }}>
          If you do not have an account
        </Text>
      </View>
    </View>
  );
}

function LoginScreen({ navigation }) {
  const [loginMode, setLoginMode] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    subscribeToAuthChanges(navigation);
  }, []);

  return (
    <View style={styles.container}>
      {loginMode ? (
        <SigninBox setLoginMode={setLoginMode} />
      ) : (
        <SignupBox setLoginMode={setLoginMode} dispatch={dispatch} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  text: {
    color: "#828282",
    fontSize: 12,
  },
  boxContainer: {
    margin: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    marginTop: -20,
  },
  inputContainerProfile: {
    width: "100%",
    marginTop: -20,
    marginBottom: 20,
  },
  loginLabl: {
    width: "100%",
    alignItems: "center",
  },
  signupLabl: {
    width: "100%",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  label: {
    color: "#1A1E1F",
    fontSize: 16,
  },
  inputBox: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  inputStyle: {
    textAlign: "center",
    color: "#1A1E1F",
    fontSize: 16,
  },
  btnContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  btnContainerSignup: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 30,
  },
  btnActive: {
    height: 37.5,
    width: "50%",
    backgroundColor: "#C4E868",
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingTop: 5,
    marginBottom: 10,
  },
  btnActiveText: {
    textAlign: "center",
    color: "#265504",
    fontSize: 18,
  },
  btnInactive: {
    height: 37.5,
    width: "50%",
    borderColor: "#828282",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingTop: 5,
    marginTop: 5,
  },
  btnInactiveText: {
    textAlign: "center",
    color: "#828282",
    fontSize: 18,
  },
  plusIcon: {
    alignItems: "flex-start",
    marginLeft: 10,
  },
});

export default LoginScreen;
