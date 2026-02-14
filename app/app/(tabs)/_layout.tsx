import { Tabs } from 'expo-router';
import { Home, Calendar, PieChart, User } from 'lucide-react-native';
import { useTeamStore } from '../../store/useTeamStore';

export default function TabsLayout() {
    const { myTeam } = useTeamStore();
    const primaryColor = myTeam?.colors.primary || '#FF7E67';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: primaryColor,
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
                    title: '홈',
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: '일정',
                    tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: '스탯',
                    tabBarIcon: ({ color }) => <PieChart color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="mypage"
                options={{
                    title: '내정보',
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
