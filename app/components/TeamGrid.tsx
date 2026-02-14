import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTeamStore, Team } from '../store/useTeamStore';
import { useEffect } from 'react';

const MASCOT_IMAGES: { [key: string]: any } = {
    'HT': require('../assets/images/teams/ballog_mascot_HT.png'),
    'SS': require('../assets/images/teams/ballog_mascot_SS.png'),
    'LG': require('../assets/images/teams/ballog_mascot_LG.png'),
    'OB': require('../assets/images/teams/ballog_mascot_OB.png'),
    'KT': require('../assets/images/teams/ballog_mascot_KT.png'),
    'SSG': require('../assets/images/teams/ballog_mascot_SSG.png'),
    'LT': require('../assets/images/teams/ballog_mascot_LT.png'),
    'HH': require('../assets/images/teams/ballog_mascot_HH.png'),
    'NC': require('../assets/images/teams/ballog_mascot_NC.png'),
    'WO': require('../assets/images/teams/ballog_mascot_WO.png'),
};

interface TeamGridProps {
    onSelect: (team: Team) => void;
    selectedTeamId?: string;
}

export default function TeamGrid({ onSelect, selectedTeamId }: TeamGridProps) {
    const { teams, fetchTeams } = useTeamStore();

    useEffect(() => {
        fetchTeams();
    }, []);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between gap-y-4">
                {teams.map((team) => {
                    const mascotSource = MASCOT_IMAGES[team.code];
                    return (
                        <TouchableOpacity
                            key={team.id}
                            onPress={() => onSelect(team)}
                            className={`w-[48%] bg-gray-50 rounded-2xl p-4 items-center border ${selectedTeamId === team.id ? 'border-primary bg-primary/10' : 'border-gray-100'
                                } active:bg-gray-100`}
                        >
                            <View
                                className="w-16 h-16 rounded-full mb-3 items-center justify-center overflow-hidden"
                                style={{ backgroundColor: team.colors.primary }}
                            >
                                {mascotSource ? (
                                    <Image
                                        source={mascotSource}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className="text-white font-bold text-lg">
                                        {team.name.substring(0, 1)}
                                    </Text>
                                )}
                            </View>
                            <Text className="text-lg font-quicksand-medium text-gray-800">
                                {team.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View className="h-10" />
        </ScrollView>
    );
}
