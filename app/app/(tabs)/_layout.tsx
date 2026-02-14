import { Tabs } from 'expo-router';
import { Home, Calendar, PieChart, User } from 'lucide-react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FF7E67', // ballog-orange
                tabBarInactiveTintColor: '#CDCDE0',
                tabBarStyle: {
                    borderTopWidth: 0,
                    elevation: 0, // Remove shadow on Android
                    shadowOpacity: 0, // Remove shadow on iOS
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color }) => <PieChart color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="mypage"
                options={{
                    title: 'My Page',
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
