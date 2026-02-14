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

    const isHomeMyTeam = isMyMatch && !!myTeamName && !!game.home_team?.name?.toLowerCase().includes(myTeamName.toLowerCase());
    const isAwayMyTeam = isMyMatch && !!myTeamName && !!game.away_team?.name?.toLowerCase().includes(myTeamName.toLowerCase());

    const timeStr = format(new Date(game.game_date_time), 'HH:mm');
    const stadiumStr = game.stadium_name || '구장 정보 없음';

    const isScheduled = game.status === 'SCHEDULED';
    const isFinished = game.status === 'FINISHED';
    const isCanceled = game.status === 'CANCELED';

    // Result Badge Logic
    let badgeText: string | null = null;
    let badgeBgColor = 'bg-gray-200';
    let badgeTextColor = 'text-gray-500';

    if (isFinished && isMyMatch) {
        if (game.home_score === game.away_score) {
            badgeText = '무승부';
            badgeTextColor = 'text-gray-600';
        } else {
            const homeWon = (game.home_score || 0) > (game.away_score || 0);
            const myTeamWon = (isHomeMyTeam && homeWon) || (isAwayMyTeam && !homeWon);
            badgeText = myTeamWon ? '승리' : '패배';
            badgeBgColor = myTeamWon ? 'bg-ballog-orange' : 'bg-gray-400';
            badgeTextColor = 'text-white';
        }
    } else if (isCanceled) {
        badgeText = '경기 취소';
    } else if (isScheduled) {
        badgeText = '경기 예정';
    }

    const scoreColor = (isFinished && isMyMatch && badgeText === '승리') ? 'text-ballog-orange' : 'text-gray-800';

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
                className={`rounded-xl p-4 ${!isMyMatch ? 'shadow-sm' : ''}`}
                style={
                    isMyMatch
                        ? { backgroundColor: `${primaryColor}10`, borderWidth: 2, borderColor: primaryColor }
                        : { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6' }
                }
            >
                {/* Header: Time · Stadium */}
                <View className="items-center mb-3">
                    <Text className="text-[10px] text-gray-400 font-medium">
                        {timeStr} · {stadiumStr}
                    </Text>
                </View>

                {/* Team Info Rows */}
                <View className="flex-row items-center justify-between">
                    {/* Home Team */}
                    <View className="items-center w-1/3">
                        <TeamLogo
                            teamName={game.home_team?.name || ''}
                            teamCode={game.home_team?.code || ''}
                            primaryColor={game.home_team?.primary_color || '#F3F4F6'}
                            size={44}
                        />
                        <Text
                            className={`text-xs mt-2 text-center ${isHomeMyTeam ? 'font-bold text-ballog-orange' : 'text-gray-800'}`}
                        >
                            {game.home_team?.name}
                        </Text>
                    </View>

                    {/* Score Area */}
                    <View className="items-center w-1/3">
                        {isFinished && (
                            <Text className={`text-3xl font-extrabold ${scoreColor}`}>
                                {game.home_score} : {game.away_score}
                            </Text>
                        )}

                        {/* Result Badge */}
                        {badgeText && (
                            <View className={`mt-2 rounded-full px-2 py-0.5 ${badgeBgColor}`}>
                                <Text className={`text-[10px] font-bold ${badgeTextColor}`}>
                                    {badgeText}
                                </Text>
                            </View>
                        )}

                        {/* Attendance Badge */}
                        {!!game.record && (
                            <View className="mt-1 px-2 py-0.5 bg-green-50 rounded-full border border-green-100">
                                <Text className="text-[9px] font-bold text-green-600">직관</Text>
                            </View>
                        )}
                    </View>

                    {/* Away Team */}
                    <View className="items-center w-1/3">
                        <TeamLogo
                            teamName={game.away_team?.name || ''}
                            teamCode={game.away_team?.code || ''}
                            primaryColor={game.away_team?.primary_color || '#F3F4F6'}
                            size={44}
                        />
                        <Text
                            className={`text-xs mt-2 text-center ${isAwayMyTeam ? 'font-bold text-ballog-orange' : 'text-gray-800'}`}
                        >
                            {game.away_team?.name}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
