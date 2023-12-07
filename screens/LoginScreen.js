import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Input, Icon } from "@rneui/themed";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import {
  getAuthUser,
  signIn,
  signUp,
  subscribeToAuthChanges,
} from "../AuthManager";
import { addUser, setUser } from "../data/Actions";

function SigninBox({ setLoginMode, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    subscribeToAuthChanges(navigation, dispatch);
  }, []);

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
              dispatch(setUser(getAuthUser()));
              setEmail("");
              setPassword("");
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

function SignupBox({ setLoginMode, dispatch, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    setProfile(result.assets[0]);
  };

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
        <View style={styles.profile}>
          <TouchableOpacity onPress={pickImage}>
            {!profile ? (
              <Icon
                type="ant-design"
                name="pluscircle"
                size={50}
                color="#F7F7F7"
                style={styles.plusIcon}
              />
            ) : (
              <Image
                source={{ uri: profile.uri }}
                style={{ width: 50, height: 50 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* button */}
      <View style={styles.btnContainerSignup}>
        <TouchableOpacity
          style={styles.btnActive}
          onPress={async () => {
            const newUser = await signUp(userName, email, password);
            await dispatch(addUser(newUser, profile));
            navigation.navigate("Home");
            setEmail("");
            setPassword("");
            setUserName("");
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

  return (
    <View style={styles.container}>
      {loginMode ? (
        <SigninBox setLoginMode={setLoginMode} navigation={navigation} />
      ) : (
        <SignupBox
          setLoginMode={setLoginMode}
          dispatch={dispatch}
          navigation={navigation}
        />
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
  profile: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
    marginLeft: 10,
  },
  plusIcon: {
    alignItems: "flex-start",
  },
});

export default LoginScreen;
