import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2 } from 'lucide-react-native';
import { useTeamStore } from '../../store/useTeamStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useFocusEffect } from 'expo-router';
import RecordModal from '../../components/RecordModal';

interface RecordItem {
    id: string;
    gameId: string;
    gameDateTime: string;
    homeTeamId: string;
    awayTeamId: string;
    homeTeamName: string;
    awayTeamName: string;
    homeScore: number;
    awayScore: number;
    resultSnapshot: string | null;
    supportedTeamId: string | null;
    supportedTeamName: string | null;
    seatInfo: string | null;
    content: string | null;
    ticketImageUrl: string | null;
}

export default function HomeScreen() {
    const myTeam = useTeamStore((state) => state.myTeam);
    const { memberId } = useAuthStore();
    const [records, setRecords] = useState<RecordItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state for editing
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);

    const fetchRecords = useCallback(async () => {
        if (!memberId) {
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/api/v1/records?memberId=${memberId}`);
            if (res.ok) {
                const data = await res.json();
                setRecords(data);
            }
        } catch (e) {
            console.error('Failed to fetch records:', e);
        } finally {
            setLoading(false);
        }
    }, [memberId]);

    // Refresh records every time the tab is focused
    useFocusEffect(
        useCallback(() => {
            fetchRecords();
        }, [fetchRecords])
    );

    const handleDeleteRecord = (id: string) => {
        Alert.alert('기록 삭제', '정말로 이 직관 기록을 삭제하시겠습니까?', [
            { text: '취소', style: 'cancel' },
            {
                text: '삭제',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const res = await fetch(`http://localhost:8080/api/v1/records/${id}`, {
                            method: 'DELETE',
                        });
                        if (res.ok) {
                            setRecords((prev) => prev.filter((r) => r.id !== id));
                        } else {
                            Alert.alert('오류', '기록 삭제에 실패했습니다.');
                        }
                    } catch (e) {
                        console.error('Failed to delete record:', e);
                        Alert.alert('네트워크 오류', '서버와 통신할 수 없습니다.');
                    }
                },
            },
        ]);
    };

    const handleEditSave = async (data: {
        gameId: string;
        recordId?: string;
        seat: string;
        review: string;
        imageUri: string | null;
        supportedTeamId: string | null;
    }) => {
        if (!data.recordId) return;

        try {
            const body = {
                seatInfo: data.seat || null,
                content: data.review || null,
                ticketImageUrl: data.imageUri || null,
            };

            const res = await fetch(`http://localhost:8080/api/v1/records/${data.recordId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                Alert.alert('수정 완료', '직관 기록이 수정되었습니다.');
                fetchRecords(); // Refresh list
            } else {
                const result = await res.json();
                Alert.alert('수정 실패', result.error || '오류가 발생했습니다.');
            }
        } catch (e) {
            console.error('Failed to update record:', e);
            Alert.alert('네트워크 오류', '서비와 통신할 수 없습니다.');
        }
    };

    const getResultStyle = (result: string | null) => {
        const primaryColor = myTeam?.colors.primary || '#FF7E67';
        switch (result) {
            case 'WIN':
                return { bg: `${primaryColor}10`, text: primaryColor };
            case 'LOSE':
                return { bg: '#F3F4F6', text: '#9CA3AF' };
            case 'DRAW':
                return { bg: '#F9FAFB', text: '#6B7280' };
            default:
                return { bg: '#F9FAFB', text: '#6B7280' };
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <View className="flex-row items-center gap-2">
                    {myTeam ? (
                        <View
                            className="w-8 h-8 rounded-full items-center justify-center"
                            style={{ backgroundColor: myTeam.colors.primary }}
                        >
                            <Text className="text-white text-xs font-bold">
                                {myTeam.name.substring(0, 1)}
                            </Text>
                        </View>
                    ) : (
                        <View className="w-8 h-8 rounded-full bg-gray-200" />
                    )}
                    <Text className="text-xl font-quicksand-bold text-gray-900">
                        {myTeam?.name || 'Ballog'}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
                {/* Section Header */}
                <View className="px-6 pt-2 pb-3">
                    <Text className="text-lg font-quicksand-bold text-black">
                        나의 직관 기록
                    </Text>
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center py-16">
                        <ActivityIndicator size="large" color="#FF7E67" />
                    </View>
                ) : records.length === 0 ? (
                    /* Empty State */
                    <View className="mx-4 rounded-2xl py-12 items-center" style={{ backgroundColor: '#F9FAFB' }}>
                        <Text style={{ fontSize: 40 }}>⚾</Text>
                        <Text className="font-quicksand-bold text-gray-400 text-base mt-3">
                            최근 기록이 없습니다
                        </Text>
                        <Text className="font-quicksand-medium text-gray-300 text-sm mt-1">
                            캘린더에서 경기를 눌러 기록해보세요!
                        </Text>
                    </View>
                ) : (
                    /* Record Cards */
                    records.map((record) => {
                        const gameDate = new Date(record.gameDateTime);
                        const style = getResultStyle(record.resultSnapshot);
                        return (
                            <TouchableOpacity
                                key={record.id}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setEditingRecord(record);
                                    setEditModalVisible(true);
                                }}
                                className="mx-4 mb-3 rounded-2xl overflow-hidden"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 1,
                                    borderColor: '#F3F4F6',
                                }}
                            >
                                {/* Top: Date + Actions */}
                                <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
                                    <Text className="text-xs font-quicksand-medium" style={{ color: '#9CA3AF' }}>
                                        {format(gameDate, 'yyyy.MM.dd (EEE)', { locale: ko })}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteRecord(record.id)}
                                        className="p-1"
                                    >
                                        <Trash2 size={16} color="#D1D5DB" />
                                    </TouchableOpacity>
                                </View>

                                {/* Score Row */}
                                <View className="flex-row items-center justify-center px-4 py-2">
                                    <Text className="font-quicksand-bold text-sm text-gray-700 flex-1 text-center">
                                        {record.awayTeamName}
                                    </Text>
                                    <View className="items-center mx-4">
                                        <Text
                                            className="font-quicksand-bold"
                                            style={{
                                                fontSize: 24,
                                                color: record.resultSnapshot === 'WIN' ? (myTeam?.colors.primary || '#FF7E67') : '#1F2937',
                                            }}
                                        >
                                            {record.awayScore} : {record.homeScore}
                                        </Text>
                                        {record.resultSnapshot && (
                                            <View
                                                className="px-3 py-0.5 rounded-full mt-1"
                                                style={{ backgroundColor: style.bg }}
                                            >
                                                <Text
                                                    className="font-quicksand-bold text-[10px]"
                                                    style={{ color: style.text }}
                                                >
                                                    {record.resultSnapshot}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className="font-quicksand-bold text-sm text-gray-700 flex-1 text-center">
                                        {record.homeTeamName}
                                    </Text>
                                </View>

                                {/* Bottom: Seat + Content */}
                                {(record.seatInfo || record.content) && (
                                    <View className="px-4 pb-3 pt-1" style={{ borderTopWidth: 1, borderTopColor: '#F9FAFB' }}>
                                        {record.seatInfo && (
                                            <Text className="text-xs font-quicksand-medium text-gray-400">
                                                📍 {record.seatInfo}
                                            </Text>
                                        )}
                                        {record.content && (
                                            <Text className="text-sm font-quicksand-medium text-gray-600 mt-1" numberOfLines={2}>
                                                {record.content}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>

            {/* Edit Modal */}
            {editingRecord && (
                <RecordModal
                    visible={editModalVisible}
                    onClose={() => {
                        setEditModalVisible(false);
                        setEditingRecord(null);
                    }}
                    game={{
                        id: editingRecord.gameId,
                        game_date_time: editingRecord.gameDateTime,
                        home_team_id: editingRecord.homeTeamId,
                        away_team_id: editingRecord.awayTeamId,
                        home_score: editingRecord.homeScore,
                        away_score: editingRecord.awayScore,
                        status: 'FINISHED' as any,
                        home_team: { name: editingRecord.homeTeamName } as any,
                        away_team: { name: editingRecord.awayTeamName } as any,
                        stadium_id: ''
                    }}
                    initialData={{
                        id: editingRecord.id,
                        seatInfo: editingRecord.seatInfo,
                        content: editingRecord.content,
                        ticketImageUrl: editingRecord.ticketImageUrl,
                        supportedTeamId: editingRecord.supportedTeamId
                    }}
                    onSave={handleEditSave}
                />
            )}
        </SafeAreaView>
    );
}
