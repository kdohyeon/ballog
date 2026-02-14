import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTeamStore } from '../../store/useTeamStore';
import { useAuthStore } from '../../store/useAuthStore';
import TeamGrid from '../../components/TeamGrid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useEffect } from 'react';

export default function OnboardingScreen() {
    const router = useRouter();
    const setTeam = useTeamStore((state) => state.setTeam);
    const fetchMember = useAuthStore((state) => state.fetchMember);

    // Fetch member info when onboarding loads (right after login)
    useEffect(() => {
        fetchMember();
    }, []);

    const handleSelectTeam = async (team: any) => {
        // 1. Update local state
        setTeam(team);

        // 2. Update preferred_team_id in DB
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('members')
                    .update({ preferred_team_id: team.id })
                    .eq('uid', user.id);
            }
        } catch (e) {
            console.error('Error updating preferred team:', e);
        }

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

                <TeamGrid onSelect={handleSelectTeam} />
            </View>
        </SafeAreaView>
    );
}
