import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { KBO_TEAMS, useTeamStore } from '../../store/useTeamStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
    const router = useRouter();
    const setTeam = useTeamStore((state) => state.setTeam);

    const handleSelectTeam = (team: any) => {
        setTeam(team);
        router.replace('/(tabs)/home');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-6">
                <Text className="text-3xl font-quicksand-bold text-gray-900 mb-2">
                    응원하는 팀을
                </Text>
                <Text className="text-3xl font-quicksand-bold text-gray-900 mb-8">
                    선택해주세요!
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="flex-row flex-wrap justify-between gap-y-4">
                        {KBO_TEAMS.map((team) => (
                            <TouchableOpacity
                                key={team.id}
                                onPress={() => handleSelectTeam(team)}
                                className="w-[48%] bg-gray-50 rounded-2xl p-4 items-center border border-gray-100 active:bg-gray-100"
                            >
                                <View
                                    className="w-16 h-16 rounded-full mb-3 items-center justify-center"
                                    style={{ backgroundColor: team.colors.primary }}
                                >
                                    <Text className="text-white font-bold text-lg">
                                        {team.name.substring(0, 1)}
                                    </Text>
                                </View>
                                <Text className="text-lg font-quicksand-medium text-gray-800">
                                    {team.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View className="h-10" />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
