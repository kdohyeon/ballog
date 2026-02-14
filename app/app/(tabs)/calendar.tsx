import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalendarData, CalendarGame } from '../../hooks/useCalendarData';
import { useTeamStore } from '../../store/useTeamStore';

// Configure Korean Locale
LocaleConfig.locales['ko'] = {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

function GameCard({ game, myTeamId }: { game: CalendarGame; myTeamId?: string }) {
    const isMyTeamGame = myTeamId && (game.home_team_id === myTeamId || game.away_team_id === myTeamId);

    return (
        <View
            className={`rounded-xl shadow-sm border p-4 flex-row items-center justify-between mb-3 ${isMyTeamGame ? 'bg-orange-50 border-ballog-orange/30' : 'bg-white border-gray-100'
                }`}
        >
            {/* Home Team */}
            <View className="items-center w-1/3">
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                    <Text className="font-bold text-gray-500 text-xs">{game.home_team?.name?.substring(0, 2)}</Text>
                </View>
                <Text className={`font-quicksand-bold text-sm ${isMyTeamGame && game.home_team_id === myTeamId ? 'text-ballog-orange' : 'text-gray-800'}`}>
                    {game.home_team?.name}
                </Text>
            </View>

            {/* Score / Time */}
            <View className="items-center w-1/3">
                <View className="px-2 py-0.5 rounded-full mb-1 bg-gray-100">
                    <Text className="font-bold text-[10px] text-gray-500">
                        {game.status === 'SCHEDULED' ? format(new Date(game.game_date_time), 'HH:mm') : game.status}
                    </Text>
                </View>
                {(game.home_score !== null && game.away_score !== null) ? (
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
                    <Text className="font-bold text-gray-500 text-xs">{game.away_team?.name?.substring(0, 2)}</Text>
                </View>
                <Text className={`font-quicksand-bold text-sm ${isMyTeamGame && game.away_team_id === myTeamId ? 'text-ballog-orange' : 'text-gray-800'}`}>
                    {game.away_team?.name}
                </Text>
            </View>
        </View>
    );
}

export default function CalendarScreen() {
    const { markedDates, loading } = useCalendarData();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const { myTeam } = useTeamStore();

    // Get games for selected date, with preferred team's games first
    const selectedDateData = markedDates[selectedDate];
    const gamesForDate = [...(selectedDateData?.games || [])].sort((a, b) => {
        const myTeamName = myTeam?.name?.toLowerCase();
        if (!myTeamName) return 0;
        const aIsMyTeam = a.home_team?.name?.toLowerCase().includes(myTeamName) || a.away_team?.name?.toLowerCase().includes(myTeamName);
        const bIsMyTeam = b.home_team?.name?.toLowerCase().includes(myTeamName) || b.away_team?.name?.toLowerCase().includes(myTeamName);
        if (aIsMyTeam && !bIsMyTeam) return -1;
        if (!aIsMyTeam && bIsMyTeam) return 1;
        return 0;
    });

    if (loading && !markedDates) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#FF7E67" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="px-4 py-4">
                <Text className="text-xl font-quicksand-bold text-black mb-4">Calendar</Text>
            </View>

            <Calendar
                theme={{
                    todayTextColor: '#FF7E67',
                    arrowColor: '#FF7E67',
                    dotColor: '#FF7E67',
                    selectedDayBackgroundColor: '#FF7E67',
                    textDayFontFamily: 'Quicksand_500Medium',
                    textMonthFontFamily: 'Quicksand_700Bold',
                    textDayHeaderFontFamily: 'Quicksand_500Medium',
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                }}
                markingType={'custom'}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: {
                        ...markedDates[selectedDate],
                        selected: true,
                        disableTouchEvent: true,
                        selectedColor: '#FF7E67',
                        selectedTextColor: 'white',
                    }
                }}
                onDayPress={(day: DateData) => {
                    setSelectedDate(day.dateString);
                }}
                enableSwipeMonths={true}
            />

            <View className="flex-1 px-4 mt-4">
                <Text className="text-lg font-quicksand-bold text-black mb-3">
                    {format(new Date(selectedDate), 'M월 d일 EEEE', { locale: ko })}
                </Text>

                {gamesForDate.length > 0 ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {gamesForDate.map((game) => (
                            <GameCard
                                key={game.id}
                                game={game}
                                myTeamId={myTeam?.id}
                            />
                        ))}
                        <View className="h-4" />
                    </ScrollView>
                ) : (
                    <View className="flex-1 items-center justify-center opacity-50">
                        <Text className="font-quicksand-medium text-gray-400 text-lg">
                            경기가 없는 날이에요
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
