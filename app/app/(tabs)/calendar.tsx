import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useCalendarData, CalendarGame } from '../../hooks/useCalendarData';
import { useTeamStore } from '../../store/useTeamStore';
import { useAuthStore } from '../../store/useAuthStore';
import MatchCard from '../../components/MatchCard';
import RecordModal from '../../components/RecordModal';

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
    const { markedDates, loading, refresh } = useCalendarData();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const { myTeam } = useTeamStore();
    const { memberId } = useAuthStore();

    // Refresh data when tab is focused (e.g. after record creation/edit elsewhere)
    useFocusEffect(
        React.useCallback(() => {
            refresh();
        }, [refresh])
    );

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGame, setSelectedGame] = useState<CalendarGame | null>(null);

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

    const handleMatchPress = (game: CalendarGame) => {
        setSelectedGame(game);
        setModalVisible(true);
    };

    const handleSaveRecord = async (data: {
        gameId: string;
        recordId?: string;
        seat: string;
        review: string;
        imageUri: string | null;
        supportedTeamId: string | null;
    }) => {
        try {
            const body = {
                memberId: memberId,
                gameId: data.gameId,
                supportedTeamId: data.supportedTeamId || null,
                seatInfo: data.seat || null,
                content: data.review || null,
                ticketImageUrl: data.imageUri || null,
            };
            console.log('Sending record to backend:', body);

            const isEdit = !!data.recordId;
            const url = isEdit
                ? `http://localhost:8080/api/v1/records/${data.recordId}`
                : 'http://localhost:8080/api/v1/records';

            const res = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isEdit ? {
                    seatInfo: body.seatInfo,
                    content: body.content,
                    ticketImageUrl: body.ticketImageUrl
                } : body),
            });

            if (res.ok) {
                const result = await res.json();
                Alert.alert(
                    isEdit ? '수정 완료' : '저장 완료',
                    isEdit ? '직관 기록이 수정되었습니다.' : `직관 기록이 저장되었습니다! 🎉\n결과: ${result.resultSnapshot || '미정'}`
                );
                // Refresh calendar data to show new badge or updated info
                refresh();
                setModalVisible(false);
                setSelectedGame(null);
            } else {
                const result = await res.json();
                Alert.alert(isEdit ? '수정 실패' : '저장 실패', result.error || '알 수 없는 오류가 발생했습니다.');
            }
        } catch (e) {
            console.error('Failed to save record:', e);
            Alert.alert('네트워크 오류', '백엔드 서버에 연결할 수 없습니다.');
        }
    };

    if (loading && !markedDates) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color={myTeam?.colors.primary || '#FF7E67'} />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="px-4 py-4">
                <Text className="text-xl font-quicksand-bold text-black mb-4">일정</Text>
            </View>

            <Calendar
                theme={{
                    todayTextColor: myTeam?.colors.primary || '#FF7E67',
                    arrowColor: myTeam?.colors.primary || '#FF7E67',
                    dotColor: myTeam?.colors.primary || '#FF7E67',
                    selectedDayBackgroundColor: myTeam?.colors.primary || '#FF7E67',
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
                        selectedColor: myTeam?.colors.primary || '#FF7E67',
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
                                    onPress={() => handleMatchPress(game)}
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

            {/* Record Modal */}
            {selectedGame && (
                <RecordModal
                    visible={modalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        setSelectedGame(null);
                    }}
                    game={selectedGame}
                    initialData={selectedGame.record}
                    onSave={handleSaveRecord}
                />
            )}
        </SafeAreaView>
    );
}

