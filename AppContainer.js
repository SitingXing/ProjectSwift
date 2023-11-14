import { Icon } from "@rneui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./data/Reducer";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ProjectListScreen from "./screens/ProjectListScreen";
import ChatListScreen from "./screens/ChatListScreen";
import SettingsScreen from "./screens/SettingsScreen";


const store = configureStore({
    reducer: rootReducer,
});

function DashboardTabStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        </Stack.Navigator>
    )
}

function ProjectTabStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="ProjectList"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="ProjectList" component={ProjectListScreen} />
        </Stack.Navigator>
    )
}

function ChatTabStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="ChatList"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="ChatList" component={ChatListScreen} />
        </Stack.Navigator>
    )
}

function SettingTabStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="Settings"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        </Stack.Navigator>
    )
}

function TabsStack() {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    elevation: 0,
                    borderTopWidth: 0,
                    height: 75,
                    paddingHorizontal: 15,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="Dashboard"
                component={DashboardTabStack}
                options={{
                    tabBarIcon: ({focused}) => {
                        return (
                            <Icon
                                name="apps"
                                type="octicon"
                                color={focused ? '#265504' : '#B7B7B7'}
                                size={30}
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen
                name="Projects"
                component={ProjectTabStack}
                options={{
                    tabBarIcon: ({focused}) => {
                        return (
                            <Icon
                                name="inbox"
                                type="octicon"
                                color={focused ? '#265504' : '#B7B7B7'}
                                size={28}
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen
                name="Chat"
                component={ChatTabStack}
                options={{
                    tabBarIcon: ({focused}) => {
                        return (
                            <Icon
                                name="comment-discussion"
                                type="octicon"
                                color={focused ? '#265504' : '#B7B7B7'}
                                size={28}
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen
                name="Setting"
                component={SettingTabStack}
                options={{
                    tabBarIcon: ({focused}) => {
                        return (
                            <Icon
                                name="gear"
                                type="octicon"
                                color={focused ? '#265504' : '#B7B7B7'}
                                size={28}
                            />
                        )
                    }
                }}
            />
        </Tabs.Navigator>
    )
}

function AppContainer() {
    const Stack = createNativeStackNavigator();

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Login"
                    screenOptions={{ headerShown: false }}
                >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Home" component={TabsStack} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}

export default AppContainer;