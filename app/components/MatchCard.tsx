import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';
import { Star } from 'lucide-react-native';
import { CalendarGame } from '../hooks/useCalendarData';

interface MatchCardProps {
    game: CalendarGame;
    isMyMatch: boolean;
    myTeamName?: string;
}

export default function MatchCard({ game, isMyMatch, myTeamName }: MatchCardProps) {
    const isHomeMyTeam = isMyMatch && !!myTeamName && !!game.home_team?.name?.toLowerCase().includes(myTeamName);
    const isAwayMyTeam = isMyMatch && !!myTeamName && !!game.away_team?.name?.toLowerCase().includes(myTeamName);

    return (
        <View className="mb-3">
            {/* MY TEAM Badge */}
            {isMyMatch && (
                <View className="flex-row items-center mb-1 ml-1">
                    <Star size={12} color="#FF7E67" fill="#FF7E67" />
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FF7E67', marginLeft: 4 }}>
                        MY TEAM
                    </Text>
                </View>
            )}

            <View
                className="rounded-xl shadow-sm p-4 flex-row items-center justify-between"
                style={
                    isMyMatch
                        ? { backgroundColor: '#FFF7ED', borderWidth: 2, borderColor: '#FF7E67' }
                        : { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6' }
                }
            >
                {/* Home Team */}
                <View className="items-center w-1/3">
                    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                        <Text className="font-bold text-gray-500 text-xs">
                            {game.home_team?.name?.substring(0, 2)}
                        </Text>
                    </View>
                    <Text
                        className="font-quicksand-bold text-sm"
                        style={{ color: isHomeMyTeam ? '#FF7E67' : '#1F2937' }}
                    >
                        {game.home_team?.name}
                    </Text>
                </View>

                {/* Score / Time */}
                <View className="items-center w-1/3">
                    <View className="px-2 py-0.5 rounded-full mb-1 bg-gray-100">
                        <Text className="font-bold text-[10px] text-gray-500">
                            {game.status === 'SCHEDULED'
                                ? format(new Date(game.game_date_time), 'HH:mm')
                                : game.status}
                        </Text>
                    </View>
                    {game.home_score !== null && game.away_score !== null ? (
                        <Text className="text-xl font-quicksand-bold text-black">
                            {game.home_score} : {game.away_score}
                        </Text>
                    ) : (
                        <Text className="text-xl font-quicksand-bold text-gray-300">VS</Text>
                    )}
                </View>

                {/* Away Team */}
                <View className="items-center w-1/3">
                    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                        <Text className="font-bold text-gray-500 text-xs">
                            {game.away_team?.name?.substring(0, 2)}
                        </Text>
                    </View>
                    <Text
                        className="font-quicksand-bold text-sm"
                        style={{ color: isAwayMyTeam ? '#FF7E67' : '#1F2937' }}
                    >
                        {game.away_team?.name}
                    </Text>
                </View>
            </View>
        </View>
    );
}
