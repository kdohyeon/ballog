import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Star } from 'lucide-react-native';
import { CalendarGame } from '../hooks/useCalendarData';
import { useTeamStore } from '../store/useTeamStore';
import TeamLogo from './TeamLogo';

interface MatchCardProps {
    game: CalendarGame;
    isMyMatch: boolean;
    myTeamName?: string;
    onPress?: () => void;
}

export default function MatchCard({ game, isMyMatch, myTeamName, onPress }: MatchCardProps) {
    const { myTeam } = useTeamStore();
    const primaryColor = myTeam?.colors.primary || '#FF7E67';

    const isHomeMyTeam = isMyMatch && !!myTeamName && !!game.home_team?.name?.toLowerCase().includes(myTeamName);
    const isAwayMyTeam = isMyMatch && !!myTeamName && !!game.away_team?.name?.toLowerCase().includes(myTeamName);

    const getStatusDisplay = (status: string) => {
        if (status === 'FINISHED') return '경기 종료';
        if (status === 'SCHEDULED') return format(new Date(game.game_date_time), 'HH:mm');
        return status;
    };

    return (
        <TouchableOpacity className="mb-3" onPress={onPress} activeOpacity={0.7}>
            {/* MY TEAM Badge */}
            {isMyMatch && (
                <View className="flex-row items-center mb-1 ml-1">
                    <Star size={12} color={primaryColor} fill={primaryColor} />
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: primaryColor, marginLeft: 4 }}>
                        MY TEAM
                    </Text>
                </View>
            )}

            <View
                className="rounded-xl shadow-sm p-4 flex-row items-center justify-between"
                style={
                    isMyMatch
                        ? { backgroundColor: `${primaryColor}10`, borderWidth: 2, borderColor: primaryColor }
                        : { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6' }
                }
            >
                {/* Team Info Rows */}
                <View className="flex-row items-center justify-between">
                    {/* Home Team */}
                    <View className="items-center w-1/3">
                        <TeamLogo
                            teamName={game.home_team?.name || ''}
                            teamCode={game.home_team?.code || ''}
                            primaryColor={game.home_team?.primary_color || '#F3F4F6'}
                            size={40}
                        />
                        <Text
                            className="font-quicksand-bold text-sm mt-1"
                            style={{ color: isHomeMyTeam ? primaryColor : '#1F2937' }}
                        >
                            {game.home_team?.name}
                        </Text>
                    </View>

                    {/* Score / Time */}
                    <View className="items-center w-1/3">
                        <View className="px-2 py-0.5 rounded-full mb-1 bg-gray-100">
                            <Text className="font-bold text-[10px] text-gray-500">
                                {getStatusDisplay(game.status)}
                            </Text>
                        </View>
                        {game.home_score !== null && game.away_score !== null ? (
                            <Text className="text-xl font-quicksand-bold text-black">
                                {game.home_score} : {game.away_score}
                            </Text>
                        ) : (
                            <Text className="text-xl font-quicksand-bold text-gray-300">VS</Text>
                        )}
                        {/* Attendance Badge */}
                        {!!game.record && (
                            <View className="mt-1 px-2 py-0.5 bg-green-50 rounded-full border border-green-100">
                                <Text className="text-[9px] font-quicksand-bold text-green-600">직관</Text>
                            </View>
                        )}
                    </View>

                    {/* Away Team */}
                    <View className="items-center w-1/3">
                        <TeamLogo
                            teamName={game.away_team?.name || ''}
                            teamCode={game.away_team?.code || ''}
                            primaryColor={game.away_team?.primary_color || '#F3F4F6'}
                            size={40}
                        />
                        <Text
                            className="font-quicksand-bold text-sm mt-1"
                            style={{ color: isAwayMyTeam ? primaryColor : '#1F2937' }}
                        >
                            {game.away_team?.name}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
