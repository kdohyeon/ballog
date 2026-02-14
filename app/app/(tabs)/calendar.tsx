import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalendarData, CalendarGame } from '../../hooks/useCalendarData';
import { useTeamStore } from '../../store/useTeamStore';
import MatchCard from '../../components/MatchCard';

// Configure Korean Locale
LocaleConfig.locales['ko'] = {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

export default function CalendarScreen() {
    const { markedDates, loading } = useCalendarData();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const { myTeam } = useTeamStore();

    // Helper: check if a game involves my team (name-based, since store IDs ≠ DB IDs)
    const myTeamName = myTeam?.name?.toLowerCase();
    const isMyTeamGame = (game: CalendarGame) => {
        if (!myTeamName) return false;
        return (
            game.home_team?.name?.toLowerCase().includes(myTeamName) ||
            game.away_team?.name?.toLowerCase().includes(myTeamName)
        );
    };

    // Get games for selected date, with preferred team's games first
    const selectedDateData = markedDates[selectedDate];
    const gamesForDate = [...(selectedDateData?.games || [])].sort((a, b) => {
        const aIsMine = isMyTeamGame(a);
        const bIsMine = isMyTeamGame(b);
        if (aIsMine && !bIsMine) return -1;
        if (!aIsMine && bIsMine) return 1;
        return new Date(a.game_date_time).getTime() - new Date(b.game_date_time).getTime();
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
                        {gamesForDate.map((game) => {
                            const isMyMatch = isMyTeamGame(game);
                            return (
                                <MatchCard
                                    key={game.id}
                                    game={game}
                                    isMyMatch={isMyMatch}
                                    myTeamName={myTeamName}
                                />
                            );
                        })}
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
